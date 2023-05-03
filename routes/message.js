const express = require('express');
const Message = require('../modules/messageSchema');
const mongoose = require('mongoose');
const router = express.Router();

router.post('/', async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const number = req.body.number;
    const message = req.body.message;

    try {
        const response = await client.sendMessage(`${number}@c.us`, message);
        console.log('Message sent successfully!', response);

        const newMessage = new Message({ name, email, number, message });
        const savedMessage = await newMessage.save();
        console.log('Message saved to database', savedMessage);

        res.send('Message sent successfully!');
    } catch (error) {
        console.error('Error sending message', error);
        res.status(500).send('Error sending message');
    }
});

module.exports = router;
