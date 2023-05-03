const { Client } = require('whatsapp-web.js');
const client = new Client();

client.on('qr', (qr) => {
    // Generate and display QR code for authentication
});

client.on('ready', () => {
    console.log('Client is ready!');
    const number = '1234567890'; // Enter the mobile number you want to send the message to
    const message = 'Hello, world!'; // Enter the message you want to send

    client.sendMessage(`${number}@c.us`, message).then((response) => {
        console.log('Message sent successfully!', response);
        client.destroy();
    }).catch((error) => {
        console.error('Error sending message', error);
        client.destroy();
    });
});

client.initialize();
