import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react';
import axios from 'axios';

const AddProductPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector(state => state.auth);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: 'electronics',
        stock: '',
        images: []
    });

    const [imagePreviews, setImagePreviews] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const categories = [
        'electronics',
        'clothing',
        'home',
        'beauty',
        'sports',
        'books',
        'food',
        'toys',
        'furniture',
        'other'
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setUploading(true);

        // Create previews
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews(prev => [...prev, reader.result]);
            };
            reader.readAsDataURL(file);
        });

        // In a real app, upload to cloud storage
        // For now, we'll use data URLs
        setTimeout(() => {
            setUploading(false);
        }, 500);
    };

    const removeImage = (index) => {
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Product name is required';
        }
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }
        if (!formData.price || parseFloat(formData.price) <= 0) {
            newErrors.price = 'Valid price is required';
        }
        if (!formData.stock || parseInt(formData.stock) < 0) {
            newErrors.stock = 'Valid stock quantity is required';
        }
        if (imagePreviews.length === 0) {
            newErrors.images = 'At least one product image is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const payload = {
                title: formData.title,
                description: formData.description,
                price: parseFloat(formData.price),
                category: formData.category,
                stock: parseInt(formData.stock),
                images: imagePreviews
            };

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('vstore_token')}`
                }
            };

            await axios.post('/api/v1/products', payload, config);

            // Show success and redirect
            alert('Product added successfully!');
            navigate('/seller/dashboard');
        } catch (err) {
            console.error('Error creating product:', err);
            alert(err.response?.data?.message || 'Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
            {/* Header */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-brand-navy font-black text-sm uppercase tracking-widest mb-8 hover:text-brand-orange transition-colors"
            >
                <ArrowLeft size={18} />
                Back to Dashboard
            </button>

            <div className="mb-12">
                <h1 className="text-4xl font-black text-brand-navy uppercase italic tracking-tighter leading-none">
                    Add New Product
                </h1>
                <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.15em] leading-relaxed mt-2">
                    Fill in the details below to list your product on SmartShop
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Product Information */}
                <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 space-y-6">
                    <h2 className="text-lg font-black italic text-brand-navy uppercase mb-4 border-b border-gray-100 pb-4">Product Information</h2>

                    {/* Product Name */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-brand-navy uppercase tracking-widest pl-1">Product Name *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Enter product name"
                            className="w-full h-12 bg-gray-50 border border-gray-100 rounded-sm px-4 text-sm font-bold focus:bg-white focus:border-brand-orange/30 outline-none transition-all"
                        />
                        {errors.title && <p className="text-red-500 text-xs font-bold">{errors.title}</p>}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-brand-navy uppercase tracking-widest pl-1">Description *</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Describe your product in detail"
                            rows="4"
                            className="w-full bg-gray-50 border border-gray-100 rounded-sm px-4 py-3 text-sm font-bold focus:bg-white focus:border-brand-orange/30 outline-none transition-all resize-none"
                        />
                        {errors.description && <p className="text-red-500 text-xs font-bold">{errors.description}</p>}
                    </div>

                    {/* Price & Stock */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-brand-navy uppercase tracking-widest pl-1">Price (Rs.) *</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                className="w-full h-12 bg-gray-50 border border-gray-100 rounded-sm px-4 text-sm font-bold focus:bg-white focus:border-brand-orange/30 outline-none transition-all"
                            />
                            {errors.price && <p className="text-red-500 text-xs font-bold">{errors.price}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-brand-navy uppercase tracking-widest pl-1">Stock Quantity *</label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleInputChange}
                                placeholder="0"
                                min="0"
                                className="w-full h-12 bg-gray-50 border border-gray-100 rounded-sm px-4 text-sm font-bold focus:bg-white focus:border-brand-orange/30 outline-none transition-all"
                            />
                            {errors.stock && <p className="text-red-500 text-xs font-bold">{errors.stock}</p>}
                        </div>
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-brand-navy uppercase tracking-widest pl-1">Category *</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full h-12 bg-gray-50 border border-gray-100 rounded-sm px-4 text-sm font-bold focus:bg-white focus:border-brand-orange/30 outline-none transition-all"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat} className="capitalize">
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Product Images */}
                <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 space-y-6">
                    <h2 className="text-lg font-black italic text-brand-navy uppercase mb-4 border-b border-gray-100 pb-4">Product Images</h2>

                    <div className="space-y-4">
                        <label className="block">
                            <div className="border-2 border-dashed border-gray-200 rounded-sm p-8 text-center cursor-pointer hover:border-brand-orange hover:bg-orange-50/20 transition-all group">
                                <Upload className="mx-auto mb-3 text-gray-300 group-hover:text-brand-orange transition-colors" size={32} />
                                <p className="text-sm font-bold text-gray-600 group-hover:text-brand-orange transition-colors">
                                    {uploading ? 'Uploading...' : 'Click to upload images or drag and drop'}
                                </p>
                                <p className="text-xs text-gray-400 mt-2">PNG, JPG, GIF up to 5MB each</p>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                    className="hidden"
                                />
                            </div>
                        </label>

                        {errors.images && <p className="text-red-500 text-xs font-bold">{errors.images}</p>}

                        {/* Image Previews */}
                        {imagePreviews.length > 0 && (
                            <div className="space-y-4">
                                <p className="text-sm font-black text-gray-600 uppercase tracking-widest">{imagePreviews.length} Image(s) Selected</p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-32 rounded-sm object-cover border border-gray-200 group-hover:border-brand-orange transition-colors"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={16} />
                                            </button>
                                            <p className="text-[9px] text-gray-500 font-bold text-center mt-1">Image {index + 1}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 h-14 bg-brand-orange hover:bg-orange-600 disabled:opacity-50 text-white font-black text-xs uppercase tracking-[0.3em] rounded-sm shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={18} />
                                Adding Product...
                            </>
                        ) : (
                            'Add Product'
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/seller/dashboard')}
                        className="flex-1 h-14 bg-gray-100 hover:bg-gray-200 text-brand-navy font-black text-xs uppercase tracking-[0.3em] rounded-sm shadow-sm transition-all"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProductPage;
