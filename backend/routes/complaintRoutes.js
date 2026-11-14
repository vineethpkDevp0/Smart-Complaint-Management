const express = require("express")
const router = express.Router()
const Complaint = require("../models/Complaint")
const mongoose = require('mongoose');
const { authMiddleware, authorizeRole } = require("../middleware/authMiddleware")


router.post('/', authMiddleware, async (req, res) => {
    try {

        const { title, description } = req.body

        // Check required fields
        if (!title || !description) {
            return res.status(400).json({
                message: 'Title and description are required'
            });
        }

        // Check empty spaces
        if (!title.trim() || !description.trim()) {
            return res.status(400).json({
                message: 'Title and description cannot be empty'
            });
        }

        const complCreate = await Complaint.create({
            title,
            description,
            user: req.user.id
        })

        res.status(201).json({
            message: "Complaint registerd succesfully",
            complCreate
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
})

router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const complaint = await Complaint.findById(
            req.params.id
        ).populate('user', 'name email role');
        if (!complaint) {
            return res.status(404).json({
                message: 'Complaint not found'
            });
        }
        const isOwner = (complaint.user?._id ? complaint.user._id.toString() : complaint.user?.toString()) === req.user.id;
        const isAdmin = req.user.role === 'admin';

        if (!isAdmin && !isOwner) {
            return res.status(403).json({
                message: 'Access denied'
            });
        }

        res.status(200).json({
            message: "Complaint Data retrieved succesfully",
            data: complaint
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
})

// POST - Add Comment to Complaint
router.post('/:id/comments', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({ message: 'Comment text cannot be empty' });
        }

        const complaint = await Complaint.findById(id);
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        const User = require('../models/User');
        const author = await User.findById(req.user.id).select('name');

        const newComment = {
            user: req.user.id,
            name: author?.name || 'User',
            text: text.trim(),
            createdAt: new Date()
        };

        complaint.comments = complaint.comments || [];
        complaint.comments.push(newComment);
        await complaint.save();

        const updated = await Complaint.findById(id).populate('user', 'name email role');

        res.status(201).json({
            message: 'Comment added successfully',
            complaint: updated
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT - Update complaint status (Admin only)
router.put(
    '/:id/status',
    authMiddleware,
    authorizeRole('admin'),
    async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            // Check valid complaint ID
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    message: 'Invalid complaint ID'
                });
            }

            // Check valid status
            const allowedStatuses = [
                'Pending',
                'In Progress',
                'Resolved'
            ];

            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({
                    message: 'Invalid status'
                });
            }

            // Find and update complaint
            const complaint = await Complaint.findByIdAndUpdate(
                id,
                { status },
                { new: true, runValidators: true }
            );

            if (!complaint) {
                return res.status(404).json({
                    message: 'Complaint not found'
                });
            }

            res.status(200).json({
                message: 'Complaint status updated successfully',
                complaint
            });

        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }
);

// DELETE - Delete complaint
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        // Validate complaint ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Invalid complaint ID'
            });
        }

        // Find complaint
        const complaint = await Complaint.findById(id);

        if (!complaint) {
            return res.status(404).json({
                message: 'Complaint not found'
            });
        }

        // Check ownership or admin role
        const isAdmin = req.user.role === 'admin';
        const isOwner = complaint.user.toString() === req.user.id;

        if (!isAdmin && !isOwner) {
            return res.status(403).json({
                message: 'Access denied'
            });
        }

        // Delete complaint
        await complaint.deleteOne();

        res.status(200).json({
            message: 'Complaint deleted successfully'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// PUT - Update complaint details
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Invalid complaint ID'
            });
        }

        // Find complaint
        const complaint = await Complaint.findById(id);

        if (!complaint) {
            return res.status(404).json({
                message: 'Complaint not found'
            });
        }

        // Check ownership or admin
        const isAdmin = req.user.role === 'admin';
        const isOwner = complaint.user.toString() === req.user.id;

        if (!isAdmin && !isOwner) {
            return res.status(403).json({
                message: 'Access denied'
            });
        }

        // Update details
        complaint.title = title || complaint.title;
        complaint.description = description || complaint.description;

        await complaint.save();

        res.status(200).json({
            message: 'Complaint updated successfully',
            complaint
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// GET - Search and filter complaints
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { status, search } = req.query;
        const searchText = search?.trim();
        console.log("hitting.........................................................................................................");

        let filter = {};

        // Role-based filtering
        if (req.user.role !== 'admin') {
            filter.user = req.user.id;
        }

        // Status filtering
        if (status) {
            filter.status = status;
        }
        console.log('MongoDB Filter:', JSON.stringify(filter, null, 2));
        // Search by title or description
        if (searchText) {
            filter.$or = [
                { title: { $regex: searchText, $options: 'i' } },
                { description: { $regex: searchText, $options: 'i' } }
            ];
        }



        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = 5;

        const skip = (page - 1) * limit;

        const complaints = await Complaint.find(filter)
            .populate('user', 'name email role')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Complaint.countDocuments(filter);

        res.status(200).json({
            message: "Complaints Data retrieved succesfully",
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: complaints,
        });



    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router