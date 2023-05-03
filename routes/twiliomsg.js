const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('whatsapp-web.js');
const mongoose = require('mongoose');

const app = express();
const client = new Client();
const port = 3000;

app.use(bodyParser.json());

// Define the database schema
const messageSchema = new mongoose.Schema({
    name: String,
    email: String,
    number: String,
    message: String
});

// Create a model based on the schema
const Message = mongoose.model('Message', messageSchema);

// Connect to the MongoDB database
mongoose.connect('mongodb://localhost:27017/mydb', { useNewUrlParser: true, useUnifiedTopology: true });

// Handle the POST request to send a message
app.post('/send-message', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const number = req.body.number;
    const message = req.body.message;

    client.on('qr', (qr) => {
        // Generate and display QR code for authentication
    });

    client.on('ready', () => {
        console.log('Client is ready!');

        client.sendMessage(`${number}@c.us`, message).then((response) => {
            console.log('Message sent successfully!', response);
            // Save the message to the database
            const newMessage = new Message({ name, email, number, message });
            newMessage.save((err, savedMessage) => {
                if (err) {
                    console.error('Error saving message to database', err);
                    res.status(500).send('Error saving message to database');
                } else {
                    console.log('Message saved to database', savedMessage);
                    res.send('Message sent successfully!');
                }
                client.destroy();
            });
        }).catch((error) => {
            console.error('Error sending message', error);
            res.status(500).send('Error sending message');
            client.destroy();
        });
    });

    client.initialize();
});

// Start the server
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
