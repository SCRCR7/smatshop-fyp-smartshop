import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Loader2, Plus, Minus, ShoppingCart, Star, Share2, Heart, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { addToCart } from '../store/slices/cartSlice';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import { formatRelativeWithTime } from '../utils/dateUtils';
import useNow from '../hooks/useNow';
import { toggleWishlist, selectIsInWishlist } from '../store/slices/wishlistSlice';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.auth);
    const isInWishlist = useSelector(state => selectIsInWishlist(state, id));

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const [activeImage, setActiveImage] = useState(0);

    // Review State
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewSuccess, setReviewSuccess] = useState(false);
    const [reviewError, setReviewError] = useState('');

    const now = useNow();

    const fetchProduct = async () => {
        try {
            const { data } = await axios.get(`/api/v1/products/${id}`);
            setProduct(data.product);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching product:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (product) {
            dispatch(addToCart({ product, quantity: qty }));
            alert("Item added to cart!");
        }
    };

    const handleBuyNow = () => {
        if (product) {
            dispatch(addToCart({ product, quantity: qty }));
            navigate('/checkout');
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        setReviewError('');
        setReviewLoading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            await axios.post(
                `/api/v1/products/${id}/reviews`,
                { rating, comment },
                config
            );

            setReviewSuccess(true);
            setReviewLoading(false);
            setComment('');
            fetchProduct(); // Refresh reviews

            setTimeout(() => setReviewSuccess(false), 3000);

        } catch (error) {
            setReviewError(error.response?.data?.message || 'Failed to submit review');
            setReviewLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center" style={{ background: 'var(--brand-dark)' }}>
                <Loader2 className="animate-spin text-indigo-500" size={48} />
            </div>
        );
    }

    if (!product) {
        return <div className="text-center py-20 font-bold text-slate-400" style={{ background: 'var(--brand-dark)' }}>Product not found</div>;
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {/* Breadcrumb */}
            <div className="text-sm text-slate-500 mb-6 flex gap-2 font-medium">
                <span>Home</span> <span className="text-slate-700">/</span> <span>{product.category}</span> <span className="text-slate-700">/</span> <span className="text-white font-bold">{product.title}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                {/* Image Gallery */}
                <div className="space-y-4">
                    <div className="aspect-square bg-white/[0.01] rounded-2xl shadow-card overflow-hidden group cursor-zoom-in border border-white/5 backdrop-blur-md">
                        <ImageWithFallback
                            src={product.images[activeImage] || 'https://via.placeholder.com/600'}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                        {product.images.map((img, i) => (
                            <div
                                key={i}
                                onClick={() => setActiveImage(i)}
                                className={`w-20 h-20 border-2 rounded-xl cursor-pointer p-1 bg-white/[0.02] flex items-center justify-center transition-all ${activeImage === i ? 'border-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.25)]' : 'border-white/5 hover:border-white/20'}`}
                            >
                                <ImageWithFallback src={img} alt="" className="max-w-full max-h-full object-contain rounded-lg" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight leading-tight fontFamily-space">{product.title}</h1>
                        <div className="flex items-center gap-4 mt-3">
                            <div className="flex text-yellow-400 text-sm">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill={i < Math.round(product.rating || 0) ? "currentColor" : "none"} color="currentColor" />
                                ))}
                            </div>
                            <span className="text-sm text-indigo-400 font-bold hover:underline cursor-pointer">{product.numReviews} Ratings</span>
                            <span className="text-slate-700">|</span>
                            <span className="text-sm text-[#10b981] font-bold flex items-center gap-1"><CheckCircle size={14} /> In Stock</span>
                        </div>
                    </div>

                    <div className="border-t border-b border-white/5 py-6 space-y-2">
                        <h2 className="text-4xl font-bold text-[#10b981] tracking-tight fontFamily-space">Rs. {product.price.toLocaleString()}</h2>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest line-through">Rs. {(product.price * 1.2).toLocaleString()}</p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Quantity</h3>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center border border-white/5 bg-white/[0.01] rounded-xl overflow-hidden">
                                <button
                                    onClick={() => setQty(Math.max(1, qty - 1))}
                                    className="p-3 hover:bg-white/5 text-white transition-colors"
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="w-12 text-center font-bold text-white">{qty}</span>
                                <button
                                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                                    className="p-3 hover:bg-white/5 text-white transition-colors"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                            <span className="text-xs text-slate-500 font-bold">{product.stock} items left</span>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={handleAddToCart}
                            className="flex-1 bg-white/[0.02] border border-white/8 text-white py-4 font-bold uppercase tracking-wider rounded-xl hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                        >
                            <ShoppingCart size={18} /> Add to Cart
                        </button>
                        <button
                            onClick={handleBuyNow}
                            className="flex-1 bg-linear-gradient(135deg, #6366f1 0%, #4f46e5 100%) bg-indigo-600 text-white py-4 font-bold uppercase tracking-wider rounded-xl hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 shadow-xl"
                        >
                            Buy Now
                        </button>
                        <button className="w-14 bg-white/[0.02] border border-white/5 text-slate-400 rounded-xl flex items-center justify-center hover:bg-white/5 hover:text-white transition-colors"
                            onClick={() => dispatch(toggleWishlist(product))}
                        >
                            <Heart size={20} className={isInWishlist ? "fill-rose-500 text-rose-500" : ""} />
                        </button>
                    </div>

                    <div className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl space-y-3 text-sm text-slate-400">
                        <p className="flex justify-between"><span>Delivery:</span> <span className="font-bold text-white">Standard Delivery (3-5 Days)</span></p>
                        <p className="flex justify-between"><span>Service:</span> <span className="font-bold text-white">7 Days Returns</span></p>
                        <p className="flex justify-between"><span>Warranty:</span> <span className="font-bold text-white">1 Year Brand Warranty</span></p>
                    </div>
                </div>
            </div>

            {/* Product Details & Reviews Tabs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Description */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="ss-card p-8">
                        <h3 className="text-lg font-bold text-white uppercase mb-4 border-b border-white/5 pb-3 fontFamily-space">Product Description</h3>
                        <p className="leading-relaxed text-slate-300">{product.description}</p>
                    </div>

                    {/* Reviews Section */}
                    <div className="ss-card p-8" id="reviews">
                        <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                            <h3 className="text-lg font-bold text-white uppercase fontFamily-space">Ratings & Reviews ({product.numReviews})</h3>
                            <button
                                onClick={() => document.getElementById('write-review').scrollIntoView({ behavior: 'smooth' })}
                                className="text-xs font-bold text-[#818cf8] uppercase hover:text-white transition-colors"
                            >
                                Write a Review
                            </button>
                        </div>

                        {product.reviews.length === 0 ? (
                            <div className="text-center py-12 bg-white/[0.01] rounded-2xl border border-dashed border-white/10">
                                <Star className="mx-auto text-slate-600 mb-2" size={32} />
                                <p className="text-slate-500 font-bold text-sm">No reviews yet. Be the first!</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {product.reviews.map((review) => (
                                    <div key={review._id} className="border-b border-white/5 pb-6 last:border-0 last:pb-0">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center justify-center text-xs font-bold text-indigo-400">
                                                    {review.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white">{review.name}</p>
                                                    <div className="flex text-yellow-400 text-xs mt-0.5">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} color="currentColor" />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-xs text-slate-500">{formatRelativeWithTime(review.createdAt, now)}</span>
                                        </div>
                                        <p className="text-sm text-slate-300 ml-11">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Write Review Sidebar */}
                <div className="lg:col-span-1">
                    <div className="ss-card p-6 sticky top-24" id="write-review">
                        <h3 className="text-md font-bold text-white uppercase mb-4 fontFamily-space">Write a Review</h3>

                        {userInfo ? (
                            <form onSubmit={handleSubmitReview} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Rating</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((val) => (
                                            <button
                                                key={val}
                                                type="button"
                                                onClick={() => setRating(val)}
                                                className={`p-1 transition-transform hover:scale-110 ${val <= rating ? 'text-yellow-400' : 'text-slate-600'}`}
                                            >
                                                <Star size={24} fill="currentColor" color="currentColor" />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Review</label>
                                    <textarea
                                        className="w-full p-3 bg-[#0c0c14] border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 h-32 resize-none transition-all"
                                        placeholder="What did you like or dislike?"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        required
                                    ></textarea>
                                </div>

                                {reviewError && <p className="text-xs text-rose-500 font-bold">{reviewError}</p>}
                                {reviewSuccess && <p className="text-xs text-[#10b981] font-bold">Review submitted successfully!</p>}

                                <button
                                    type="submit"
                                    disabled={reviewLoading}
                                    className="w-full bg-linear-gradient(135deg, #6366f1 0%, #4f46e5 100%) bg-indigo-600 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all disabled:opacity-50"
                                >
                                    {reviewLoading ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </form>
                        ) : (
                            <div className="text-center py-6 bg-white/[0.01] border border-white/5 rounded-xl">
                                <p className="text-sm text-slate-400 mb-4">Please login to write a review</p>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-500 transition-colors"
                                >
                                    Login Now
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;
