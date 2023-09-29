const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Client, LocalAuth,se } = require('whatsapp-web.js');
const dotenv=require('dotenv')
const qrcode = require('qrcode-terminal');
const messageRouter = require('./routes/message');
const user=require('./routes/login')

dotenv.config()


const app = express();


app.use(bodyParser.json());

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
  args: ['--no-sandbox','--disable-setuid-sandbox'],
}
});
client.initialize();

client.on('loading_screen', (percent, message) => {
    console.log('LOADING SCREEN', percent, message);
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});


client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
});


mongoose.connect(process.env.mongo, { useNewUrlParser: true, useUnifiedTopology: true });

// Create a function that takes the client object as an argument and returns the message router middleware
const getMessageRouter = (client) => {
  const router = express.Router();

  router.post('/', async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const number = req.body.number;
    const message = req.body.message;
    const num="91"+number

    try {
      const response = await client.sendMessage(`${num}@c.us`, message);
      console.log('Message sent successfully!');

      // const newMessage = new Message({ name, email, number, message });
      // const savedMessage = await newMessage.save();
      // console.log('Message saved to database', savedMessage);

      res.send('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message', error);
      res.status(500).send('Error sending message');
    }
  });

  return router;
};



app.use("/auth",user)
app.use('/message', getMessageRouter(client));


PORT=process.env.PORT||3000
app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
