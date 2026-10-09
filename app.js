
const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());

const users = [];
let nextId = 1;
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Server is working!'
    });
});


app.get('/users', async (req, res) => {
    try {
        res.status(200).json({
            message: 'Users retrieved successfully.',
            count: users.length,
            users: users
        });
    } catch (error) {
        console.error('Get users error:', error);

        res.status(500).json({
            message: 'Internal server error.'
        });
    }
});


app.get('/users/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        // Validate the ID
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: 'User ID must be a positive integer.'
            });
        }

        // Find the user
        const user = users.find((u) => u.id === id);

        // Handle user not found
        if (!user) {
            return res.status(404).json({
                message: 'User not found.'
            });
        }

        // Return the user
        return res.status(200).json({
            message: 'User retrieved successfully.',
            user: user
        });

    } catch (error) {
        console.error('Get user by ID error:', error);

        return res.status(500).json({
            message: 'Internal server error.'
        });
    }
});

app.post('/users', (req, res) => {
    console.log('POST /users request received');
    console.log('Request body:', req.body);

    try {
        const name = req.body.name;
        const email = req.body.email;

        if (
            typeof name !== 'string' ||
            !name.trim() ||
            typeof email !== 'string' ||
            !email.trim()
        ) {
            return res.status(400).json({
                message: 'Name and email are required.'
            });
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email.trim())) {
            return res.status(400).json({
                message: 'Invalid email format.'
            });
        }

        const newUser = {
            id: nextId++,
            name: name.trim(),
            email: email.trim()
        };

        users.push(newUser);

        return res.status(201).json({
            message: 'User created successfully.',
            user: newUser
        });
    } catch (error) {
        console.error('REAL ERROR:', error.stack || error);

        return res.status(500).json({
            message: 'Internal server error.'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
