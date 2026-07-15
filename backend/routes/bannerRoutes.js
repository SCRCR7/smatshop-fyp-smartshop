const express = require('express');
const router = express.Router();
const Banner = require('../models/Banner');
const { protect, admin } = require('../middleware/authMiddleware');
const asyncHandler = require('../middleware/asyncHandler');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads dir exists
const uploadDir = path.join(__dirname, '../../uploads/banners');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (_, __, cb) => cb(null, uploadDir),
    filename: (_, file, cb) => cb(null, `banner-${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// GET /api/banners — public
router.get('/', asyncHandler(async (req, res) => {
    const banners = await Banner.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json(banners);
}));

// GET /api/banners/all — admin
router.get('/all', protect, admin, asyncHandler(async (req, res) => {
    const banners = await Banner.find().sort({ order: 1, createdAt: -1 });
    res.json(banners);
}));

// POST /api/banners — admin upload
router.post('/', protect, admin, upload.single('image'), asyncHandler(async (req, res) => {
    if (!req.file) { res.status(400); throw new Error('Image required'); }
    const { title, subtitle, link, badgeText, order } = req.body;
    const imageUrl = `/uploads/banners/${req.file.filename}`;
    const banner = await Banner.create({ title, subtitle, imageUrl, link: link || '/', badgeText, order: order || 0 });
    res.status(201).json(banner);
}));

// PUT /api/banners/:id — admin update
router.put('/:id', protect, admin, asyncHandler(async (req, res) => {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!banner) { res.status(404); throw new Error('Banner not found'); }
    res.json(banner);
}));

// DELETE /api/banners/:id — admin delete
router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
    const banner = await Banner.findById(req.params.id);
    if (!banner) { res.status(404); throw new Error('Not found'); }
    // Remove file
    const filePath = path.join(__dirname, '../..', banner.imageUrl);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    await banner.deleteOne();
    res.json({ message: 'Deleted' });
}));

module.exports = router;
