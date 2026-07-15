const fs = require('fs');
const VoiceIntentService = require('../services/VoiceIntentService');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Analyze text voice command
// @route   POST /api/v1/voice/analyze
// @access  Public
exports.handleAnalyzeText = asyncHandler(async (req, res) => {
    const { text, currentPath, lang } = req.body;
    if (!text) { res.status(400); throw new Error('No text provided'); }
    const isUrdu = lang === 'ur';

    const ai = await VoiceIntentService.processUserCommand(text, lang || 'en');

    // Pick Urdu response if available and user is in Urdu mode
    if (isUrdu && ai.meta?.response_speech_ur) {
        ai.meta.response_speech = ai.meta.response_speech_ur;
    }

    const responseData = {
        success: true,
        intent: ai.intent,
        redirect: null,
        products: [],
        cartProduct: null,
        cartQty: 1,
        action: ai.slots?.action || 'add',
        ai_meta: ai,
    };

    switch (ai.intent) {

        case 'SEARCH': {
            const query = {};
            const productKeyword = ai.slots.product?.trim();

            if (productKeyword) {
                // Expand synonyms so "phones" finds phone/smartphone/mobile etc.
                const synonymMap = {
                    'phones': ['phone', 'smartphone', 'mobile', 'iphone', 'samsung', 'android'],
                    'phone': ['phone', 'smartphone', 'mobile'],
                    'mobiles': ['phone', 'smartphone', 'mobile', 'android'],
                    'mobile': ['phone', 'smartphone', 'mobile'],
                    'smartphones': ['phone', 'smartphone', 'mobile'],
                    'smartphone': ['phone', 'smartphone', 'mobile'],
                    'shoes': ['shoe', 'shoes', 'sneaker', 'sneakers', 'footwear', 'boot', 'boots'],
                    'shoe': ['shoe', 'shoes', 'sneaker', 'sneakers', 'footwear'],
                    'sneakers': ['sneaker', 'sneakers', 'shoes', 'footwear'],
                    'sneaker': ['sneaker', 'sneakers', 'shoes', 'footwear'],
                    'laptops': ['laptop', 'notebook', 'macbook', 'computer'],
                    'laptop': ['laptop', 'notebook', 'macbook', 'computer'],
                    'notebooks': ['laptop', 'notebook'],
                    'headphones': ['headphone', 'headphones', 'earphone', 'earphones', 'earbuds', 'audio', 'wireless'],
                    'headphone': ['headphone', 'headphones', 'earphone', 'earphones', 'earbuds'],
                    'earphones': ['earphone', 'earphones', 'earbuds', 'headphones'],
                    'earbuds': ['earbuds', 'earphone', 'earphones', 'tws'],
                    'watches': ['watch', 'smartwatch', 'wearable'],
                    'watch': ['watch', 'smartwatch', 'wearable'],
                    'cameras': ['camera', 'dslr', 'mirrorless', 'photography'],
                    'camera': ['camera', 'dslr', 'mirrorless', 'photography'],
                    'tablets': ['tablet', 'ipad'],
                    'tablet': ['tablet', 'ipad'],
                    'tvs': ['tv', 'television', 'smart tv'],
                    'tv': ['tv', 'television', 'smart tv', 'qled'],
                    'speakers': ['speaker', 'bluetooth', 'portable', 'audio'],
                    'speaker': ['speaker', 'bluetooth', 'portable', 'audio'],
                    'shirts': ['shirt', 'polo', 'tshirt', 't-shirt', 'top'],
                    'shirt': ['shirt', 'polo', 'tshirt', 't-shirt'],
                    'jeans': ['jeans', 'denim', 'pants', 'trousers'],
                    'pants': ['pants', 'trousers', 'chinos', 'jeans'],
                    'dresses': ['dress', 'maxi', 'gown', 'clothing'],
                    'dress': ['dress', 'maxi', 'gown'],
                    'jackets': ['jacket', 'coat', 'hoodie', 'outerwear'],
                    'jacket': ['jacket', 'coat', 'hoodie'],
                    'hoodies': ['hoodie', 'sweatshirt', 'pullover'],
                    'hoodie': ['hoodie', 'sweatshirt', 'pullover'],
                    'sunglasses': ['sunglasses', 'eyewear', 'glasses'],
                    'sofas': ['sofa', 'couch', 'furniture'],
                    'sofa': ['sofa', 'couch', 'furniture'],
                    'books': ['book', 'novel', 'fiction', 'non-fiction'],
                    'book': ['book', 'novel', 'fiction'],
                    'skincare': ['skincare', 'serum', 'cream', 'moisturizer', 'beauty'],
                    'makeup': ['makeup', 'foundation', 'lipstick', 'beauty', 'cosmetics'],
                    'dumbbells': ['dumbbell', 'weights', 'gym', 'fitness'],
                    'dumbbell': ['dumbbell', 'weights', 'gym', 'fitness'],
                    'chargers': ['charger', 'charging', 'usb', 'accessories'],
                    'charger': ['charger', 'charging', 'usb', 'accessories'],
                };

                const kw = productKeyword.toLowerCase();
                const terms = synonymMap[kw] || [kw];

                // Use word-boundary for exact tag matching, substring for title/desc
                const orClauses = [];
                terms.forEach(term => {
                    orClauses.push({ title: { $regex: term, $options: 'i' } });
                    orClauses.push({ description: { $regex: term, $options: 'i' } });
                    orClauses.push({ tags: { $in: [new RegExp(`^${term}$`, 'i')] } });
                    orClauses.push({ category: { $regex: `^${term}$`, $options: 'i' } });
                });
                query.$or = orClauses;
            }

            if (ai.slots.price_constraint) {
                const { operator, value } = ai.slots.price_constraint;
                query.price = operator === 'lt' ? { $lte: value } : { $gte: value };
            }

            const sortOption = ai.slots.sort === 'price_asc' ? { price: 1 }
                : ai.slots.sort === 'price_desc' ? { price: -1 }
                : ai.slots.price_constraint?.operator === 'lt' ? { price: 1 }  // auto sort cheap-first for "under X" searches
                : { rating: -1 };

            const products = await Product.find(query).sort(sortOption).limit(20);
            responseData.products = products;

            if (products.length > 0) {
                const cheapest = [...products].sort((a, b) => a.price - b.price)[0];
                const label = productKeyword || 'products';
                const priceInfo = ai.slots.price_constraint
                    ? ` under Rs. ${ai.slots.price_constraint.value.toLocaleString()}`
                    : '';
                responseData.ai_meta.meta = {
                    ...ai.meta,
                    response_speech: isUrdu
                        ? `Mil gaye ${products.length} ${label}${priceInfo}. Sab se sasta Rs. ${cheapest.price.toLocaleString()} ka hai.`
                        : `Found ${products.length} ${label}${priceInfo}. Prices start from Rs. ${cheapest.price.toLocaleString()}.`
                };
            } else {
                responseData.ai_meta.meta = {
                    ...ai.meta,
                    response_speech: isUrdu
                        ? `Maafi, "${productKeyword || 'yeh cheez'}" nahi mili. Kuch aur try karein.`
                        : `Sorry, no products found for "${productKeyword || 'that search'}". Try a different keyword.`
                };
            }
            break;
        }

        case 'NAVIGATE': {
            // slot.product is already a full path like '/cart' or 'category/electronics'
            const dest = ai.slots.product || '/';
            responseData.redirect = dest.startsWith('/') ? dest : '/' + dest;
            responseData.ai_meta.meta = { ...ai.meta };
            break;
        }

        case 'CART_ACTION': {
            if (ai.slots.product) {
                const product = await Product.findOne({ title: { $regex: ai.slots.product, $options: 'i' } })
                    || await Product.findOne({ tags: { $in: [new RegExp(ai.slots.product, 'i')] } });
                if (product) {
                    responseData.cartProduct = product;
                    responseData.cartQty = ai.slots.quantity || 1;
                    responseData.ai_meta.meta = { ...ai.meta, response_speech: `Added ${product.title} to your cart!` };
                } else {
                    responseData.ai_meta.meta = { ...ai.meta, response_speech: `Could not find "${ai.slots.product}" in the store.` };
                }
            }
            break;
        }

        case 'WISHLIST_ACTION': {
            if (ai.slots.product) {
                const product = await Product.findOne({ title: { $regex: ai.slots.product, $options: 'i' } });
                if (product) {
                    responseData.cartProduct = product; // reuse field for wishlist too
                    responseData.ai_meta.meta = { ...ai.meta, response_speech: `Added ${product.title} to your wishlist!` };
                }
            }
            break;
        }

        case 'ORDER': {
            responseData.redirect = '/checkout';
            responseData.ai_meta.meta = { ...ai.meta };
            break;
        }

        case 'UNKNOWN': {
            responseData.ai_meta.meta = { ...ai.meta };
            break;
        }

        default:
            responseData.ai_meta.meta = { ...ai.meta };
    }

    res.json(responseData);
});

// Legacy audio command handler
exports.handleVoiceCommand = asyncHandler(async (req, res) => {
    if (!req.file) { res.status(400); throw new Error('No audio file uploaded'); }
    fs.unlinkSync(req.file.path);
    res.json({ success: false, message: 'Audio upload not supported. Use text analyze endpoint.' });
});
