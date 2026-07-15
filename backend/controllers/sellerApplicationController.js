const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Apply to become a seller
// @route   POST /api/v1/seller-applications/apply
// @access  Private (buyers only)
exports.applyToBecomeSeller = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    // Check if already applied or is seller/admin
    if (user.role === 'seller' || user.role === 'admin') {
        res.status(400);
        throw new Error('You are already a seller or admin');
    }

    if (user.sellerApplicationStatus === 'pending') {
        res.status(400);
        throw new Error('Your seller application is already under review');
    }

    if (user.sellerApplicationStatus === 'approved') {
        res.status(400);
        throw new Error('You are already an approved seller');
    }

    // Update user to seller_pending
    user.role = 'seller_pending';
    user.sellerApplicationStatus = 'pending';
    user.sellerApplicationDate = new Date();
    user.sellerRejectionReason = null;

    await user.save();

    res.status(200).json({
        success: true,
        message: 'Seller application submitted successfully. Please wait for admin approval.',
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            sellerApplicationStatus: user.sellerApplicationStatus,
            sellerApplicationDate: user.sellerApplicationDate
        }
    });
});

// @desc    Get seller application status
// @route   GET /api/v1/seller-applications/status
// @access  Private
exports.getSellerApplicationStatus = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        sellerApplicationStatus: user.sellerApplicationStatus,
        role: user.role,
        sellerApplicationDate: user.sellerApplicationDate,
        sellerApprovedDate: user.sellerApprovedDate,
        sellerRejectionReason: user.sellerRejectionReason
    });
});

// @desc    Get all pending seller applications (ADMIN ONLY)
// @route   GET /api/v1/seller-applications
// @access  Private/Admin
exports.getPendingSellerApplications = asyncHandler(async (req, res) => {
    const applications = await User.find({ sellerApplicationStatus: 'pending' })
        .select('-password')
        .sort({ sellerApplicationDate: -1 });

    res.status(200).json({
        success: true,
        count: applications.length,
        applications
    });
});

// @desc    Approve seller application (ADMIN ONLY)
// @route   PUT /api/v1/seller-applications/:userId/approve
// @access  Private/Admin
exports.approveSellerApplication = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.userId);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (user.sellerApplicationStatus !== 'pending') {
        res.status(400);
        throw new Error('This application is not pending');
    }

    // Approve the seller
    user.role = 'seller';
    user.sellerApplicationStatus = 'approved';
    user.sellerApprovedDate = new Date();
    user.sellerRejectionReason = null;

    await user.save();

    res.status(200).json({
        success: true,
        message: `${user.name} has been approved as a seller`,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            sellerApplicationStatus: user.sellerApplicationStatus,
            sellerApprovedDate: user.sellerApprovedDate
        }
    });
});

// @desc    Reject seller application (ADMIN ONLY)
// @route   PUT /api/v1/seller-applications/:userId/reject
// @access  Private/Admin
exports.rejectSellerApplication = asyncHandler(async (req, res) => {
    const { reason } = req.body;

    if (!reason || reason.trim() === '') {
        res.status(400);
        throw new Error('Please provide a rejection reason');
    }

    const user = await User.findById(req.params.userId);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (user.sellerApplicationStatus !== 'pending') {
        res.status(400);
        throw new Error('This application is not pending');
    }

    // Reject the seller
    user.role = 'buyer';
    user.sellerApplicationStatus = 'rejected';
    user.sellerRejectionReason = reason;

    await user.save();

    res.status(200).json({
        success: true,
        message: `${user.name}'s seller application has been rejected`,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            sellerApplicationStatus: user.sellerApplicationStatus,
            sellerRejectionReason: user.sellerRejectionReason
        }
    });
});

// @desc    Reapply after rejection
// @route   POST /api/v1/seller-applications/reapply
// @access  Private (rejected sellers only)
exports.reapplyToBecomeSeller = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (user.sellerApplicationStatus !== 'rejected') {
        res.status(400);
        throw new Error('You can only reapply if your previous application was rejected');
    }

    // Reapply
    user.role = 'seller_pending';
    user.sellerApplicationStatus = 'pending';
    user.sellerApplicationDate = new Date();
    user.sellerRejectionReason = null;

    await user.save();

    res.status(200).json({
        success: true,
        message: 'Seller application resubmitted successfully. Please wait for admin approval.',
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            sellerApplicationStatus: user.sellerApplicationStatus,
            sellerApplicationDate: user.sellerApplicationDate
        }
    });
});
