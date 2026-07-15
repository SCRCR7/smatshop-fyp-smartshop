const { GoogleGenerativeAI } = require('@google/generative-ai');
const logger = require('../utils/logger');

let genAI, model;
const initAI = () => {
    if (!genAI) {
        genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    }
    return model;
};

// Full keyword-based intent parser — instant, no API needed
const parseWithKeywords = (text) => {
    const t = text.toLowerCase().trim();

    // ── NAVIGATE ──────────────────────────────────────────────
    const routes = [
        { keys: ['go home', 'home page', 'homepage', 'main page', 'back to home', 'wapas jao', 'ghar', 'ghar jao', 'mukhya page'], path: '/' },
        { keys: ['my cart', 'open cart', 'view cart', 'go to cart', 'cart dekho', 'cart page', 'cart mein jao', 'mera cart', 'cart dikhao'], path: '/cart' },
        { keys: ['checkout', 'check out', 'go to checkout', 'place order page', 'checkout par jao', 'order dena', 'order dein'], path: '/checkout' },
        { keys: ['my profile', 'my account', 'profile page', 'my orders', 'order history', 'account', 'mera account', 'mere orders', 'meri orders'], path: '/profile' },
        { keys: ['login', 'sign in', 'log in', 'log on', 'login karo'], path: '/login' },
        { keys: ['sign up', 'signup', 'register', 'create account', 'sign up karo', 'account banao'], path: '/signup' },
        { keys: ['electronics', 'electronic', 'gadgets', 'mobiles section', 'phones section', 'laptops section', 'electronics kholo', 'electronics dikhao'], path: '/category/electronics' },
        { keys: ['fashion', 'clothes', 'clothing', 'shirts', 'shoes section', 'kapre', 'kapray', 'fashion dikhao'], path: '/category/fashion' },
        { keys: ['home decor', 'furniture', 'home section', 'home living', 'home category', 'ghar ki cheezain', 'furniture dikhao'], path: '/category/home' },
        { keys: ['beauty', 'makeup', 'skincare', 'cosmetics', 'beauty products', 'beauty dikhao', 'makeup dikhao'], path: '/category/beauty' },
        { keys: ['sports', 'sport', 'fitness', 'gym equipment', 'khel', 'sports dikhao', 'fitness products'], path: '/category/sports' },
        { keys: ['books', 'book section', 'book category', 'kitabein', 'kitab', 'books dikhao'], path: '/category/books' },
        { keys: ['search page', 'search all', 'all products', 'browse all', 'sab dikhao', 'sab products'], path: '/search/all' },
        { keys: ['wishlist', 'favorites', 'saved items', 'wish list', 'pasandida', 'meri list'], path: '/profile' },
        { keys: ['track order', 'track my order', 'where is my order', 'order status', 'order track karo', 'order kahan hai'], path: '/track-order' },
        { keys: ['sell', 'become a seller', 'sell on smartshop', 'seller', 'bechna hai', 'seller bano'], path: '/sell' },
    ];

    for (const r of routes) {
        if (r.keys.some(k => t === k || t.includes(k))) {
            const name = r.path === '/' ? 'home' : r.path.replace('/category/', '').replace('/', '');
            return { intent: 'NAVIGATE', slots: { product: r.path, adjectives: [], price_constraint: null, sort: null, quantity: 1 }, meta: { detected_lang: 'en', response_speech: `Taking you to ${name}.`, response_speech_ur: `${name} par ja raha hoon.` } };
        }
    }

    // ── CART_ACTION ───────────────────────────────────────────
    const cartAdd = ['add to cart', 'add', 'put in cart', 'cart mein dalo', 'cart me dalo', 'buy this', 'i want to buy', 'kharidna hai', 'kharidna chahta', 'khareedna hai'];
    const cartRemove = ['remove from cart', 'delete from cart', 'remove', 'delete', 'cart se hatao', 'hatao'];
    const isAdd = cartAdd.some(p => t.startsWith(p) || t.includes(p));
    const isRemove = cartRemove.some(p => t.includes(p));

    if (isAdd || isRemove) {
        let product = t;
        [...cartAdd, ...cartRemove].forEach(p => { product = product.replace(p, ''); });
        product = product.replace(/please|to my cart|from my cart|from cart/gi, '').trim();
        return {
            intent: 'CART_ACTION',
            slots: { product, adjectives: [], price_constraint: null, sort: null, quantity: 1, action: isRemove ? 'remove' : 'add' },
            meta: { detected_lang: 'en', response_speech: isRemove ? `Removing ${product} from cart.` : `Looking for ${product} to add to your cart.` }
        };
    }

    // ── WISHLIST_ACTION ───────────────────────────────────────
    if (t.includes('wishlist') || t.includes('save') || t.includes('favorite')) {
        const product = t.replace(/add|to|wishlist|save|favorite|my/gi, '').trim();
        return { intent: 'WISHLIST_ACTION', slots: { product, adjectives: [], price_constraint: null, sort: null, quantity: 1 }, meta: { detected_lang: 'en', response_speech: `Adding ${product} to your wishlist.` } };
    }

    // ── ORDER ─────────────────────────────────────────────────
    if (t.includes('place order') || t.includes('confirm order') || t.includes('order lagao')) {
        return { intent: 'ORDER', slots: { product: '', adjectives: [], price_constraint: null, sort: null, quantity: 1 }, meta: { detected_lang: 'en', response_speech: 'Placing your order now.' } };
    }

    // ── SEARCH ────────────────────────────────────────────────
    let price_constraint = null;
    const underM = t.match(/(?:under|below|less than|se kam|se kum|kam mein|se sasta|se kami)\s*(?:rs\.?\s*)?(\d[\d,]*)/i);
    const overM = t.match(/(?:over|above|more than|se zyada|se upar|se mehnga|se bada)\s*(?:rs\.?\s*)?(\d[\d,]*)/i);
    if (underM) price_constraint = { operator: 'lt', value: parseInt(underM[1].replace(/,/g, '')) };
    else if (overM) price_constraint = { operator: 'gt', value: parseInt(overM[1].replace(/,/g, '')) };

    let sort = null;
    if (/cheap|sasta|saste|lowest price|affordable|budget|kam qeemat|arzaan/.test(t)) sort = 'price_asc';
    else if (/expensive|premium|highest|luxury|mehnga|mehnge|zyada qeemat/.test(t)) sort = 'price_desc';
    else if (/new|latest|newest|recent/.test(t)) sort = 'newest';

    // Strip all filler/command words from product keyword
    const product = t
        .replace(/\b(show|find|search for|search|look for|get me|display|dikha|dikhao|dikhaye|dikhayein|dhundo|dhundho|dhund|dhunde|dhundhein|mujhe|de do|chahiye|give me|bring me|i want|i need|can you|please|me|us|all|some|any|the|a|an|i|want|need|looking|for|that|which|are|is|with|about|in|of|some)\b/gi, '')
        .replace(/\b(under|below|above|over|less than|more than|se kam|se kum|se zyada|se upar|starting|starting from|starting at|from|upto|up to|within)\b/gi, '')
        .replace(/rs\.?\s*\d[\d,]*/gi, '')
        .replace(/\b(cheap|sasta|expensive|premium|new|latest|affordable|budget|good|best|top|popular|rated|discount|sale|offer)\b/gi, '')
        .replace(/\d+/g, '')
        .replace(/\s{2,}/g, ' ')
        .trim();

    const speech = price_constraint
        ? `Searching for ${product || 'products'} ${price_constraint.operator === 'lt' ? 'under' : 'over'} Rs. ${price_constraint.value.toLocaleString()}.`
        : `Searching for ${product || 'products'}.`;

    return { intent: 'SEARCH', slots: { product, adjectives: [], price_constraint, sort, quantity: 1 }, meta: { detected_lang: 'en', response_speech: speech } };
};

class VoiceIntentService {
    async processUserCommand(text, lang = 'en') {
        const keyword = parseWithKeywords(text);
        // Navigation & order — instant, no Gemini needed
        if (['NAVIGATE', 'ORDER'].includes(keyword.intent)) return keyword;

        // Try Gemini for smarter multilingual understanding
        try {
            const aiModel = initAI();
            const isUrdu = lang === 'ur';
            const prompt = `You are a bilingual e-commerce voice assistant for SmartShop Pakistan.
The user spoke in ${isUrdu ? 'Roman Urdu (Urdu written in English letters)' : 'English'}.
Output ONLY valid JSON, no markdown, no explanation.

INTENTS: SEARCH, NAVIGATE, CART_ACTION, WISHLIST_ACTION, ORDER
SCHEMA: {"intent":"SEARCH","slots":{"product":"string (ALWAYS in English)","adjectives":[],"price_constraint":{"operator":"lt","value":0},"sort":"price_asc","quantity":1},"meta":{"detected_lang":"${isUrdu ? 'ur' : 'en'}","response_speech":"string"}}

RULES:
- product slot MUST be in English regardless of input language (for database search)
- Roman Urdu mappings: joote/joota=shoes, fon/mobile=phone, laptop=laptop, kitab=books, kapre=clothes, headphones=headphones
- price: "se kam"=under, "se zyada"=above, "hazar"=thousand (e.g. "80 hazar"=80000, "ek lakh"=100000)
- sort: "sasta/saste"=price_asc, "mehnga/mehnge"=price_desc
- response_speech: ${isUrdu
    ? 'MUST be in Roman Urdu ONLY (no Urdu script, no English). Examples: "Mil gaye 5 joote, sab se sasta Rs. 7,499 ka hai." or "Electronics page par ja raha hoon." or "Sony headphones cart mein dal diye!"'
    : 'reply in friendly English'}

COMMAND: "${text}"
JSON:`;
            const result = await aiModel.generateContent(prompt);
            let raw = result.response.text().trim().replace(/^```json?\n?/, '').replace(/\n?```$/, '');
            const parsed = JSON.parse(raw);
            if (parsed.intent && parsed.slots && parsed.meta) return parsed;
        } catch (err) {
            logger.warn(`Gemini fallback: ${err.message}`);
        }

        return keyword;
    }
}

module.exports = new VoiceIntentService();
