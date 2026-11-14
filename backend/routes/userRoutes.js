
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authMiddleware, authorizeRole } = require('../middleware/authMiddleware');
const User = require('../models/User');


router.get(
    '/admin',
    authMiddleware,
    authorizeRole('admin'),
    async (req, res) => {
        try {
            const users = await User.find().select('-password');

            res.status(200).json({
                message: 'Admin access successful',
                users
            });

        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }
);

// POST - Login User
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid password'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Login successful',
            token
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: 'Email already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        })
        const userData = user.toObject();
        delete userData.password;

        res.status(201).json({
            message: "User Registerd Successfully",
            userData
        })

    }
    catch (error) {
        res.status(500).json({
            message: error.message
        });

    }

})


// GET - Protected User Profile
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password');

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.status(200).json({
            message: 'Profile fetched successfully',
            user
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// PUT - Update User Profile
router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (name) user.name = name;
        if (email) {
            const existing = await User.findOne({ email, _id: { $ne: user._id } });
            if (existing) {
                return res.status(400).json({ message: 'Email is already in use' });
            }
            user.email = email;
        }
        await user.save();
        const userData = user.toObject();
        delete userData.password;
        res.status(200).json({
            message: 'Profile updated successfully',
            user: userData
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT - Change Password
router.put('/change-password', authMiddleware, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect current password' });
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST - Create user (Admin)
router.post('/', authMiddleware, authorizeRole('admin'), async (req, res) => {
    try {
        const { name, email, password, role, status } = req.body;
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password || 'password123', 10);
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'user',
            status: status || 'Active'
        });
        const userData = newUser.toObject();
        delete userData.password;
        res.status(201).json({
            message: 'User created successfully',
            user: userData
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/', authMiddleware, authorizeRole('admin'), async (req, res) => {
    try {
        const { search } = req.query;
        let filter = {};
        if (search && search.trim()) {
            filter = {
                $or: [
                    { name: { $regex: search.trim(), $options: 'i' } },
                    { email: { $regex: search.trim(), $options: 'i' } }
                ]
            };
        }
        const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
        res.status(200).json({
            message: "User list fetched successfully",
            users
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

router.get('/:id', async (req, res) => {
    try {

        const userId = await User.findById(req.params.id);
        if (!userId) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        res.status(201).json({
            message: "User data fetched succesfully",
            userId
        })
    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
})

router.put('/:id', async (req, res) => {
    try {

        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }


        res.status(201).json({
            message: "User data Updated succesfully",
            user
        })
    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(
            req.params.id
        );

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.status(201).json({
            message: "User Deleted succesfully",
            user
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
})

module.exports = router