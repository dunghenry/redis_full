const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const port = process.env.PORTSUB || 5000;
const app = express();
const client = require('./configs/connectRedis');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());

(async () => {
    const subscriber = client.duplicate();
    await subscriber.connect();
    await subscriber.subscribe('chat', (msg) => {
        console.log(msg);
    });
    // or
    await subscriber.pSubscribe('c*', (msg) => {
        console.log(msg);
    });
    //unsubscribe
    // await subscriber.unsubscribe('chat');
    // await subscriber.pUnsubscribe('ch*');
})();

app.listen(port, () =>
    console.log(`Server listening on http://localhost:${port}`),
);
