const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const port = process.env.PORT || 4000;
const app = express();
const client = require('./configs/connectRedis');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());

//! caching data
app.use('/', async (req, res) => {
    try {
        const data = await client.get('data');
        if (data) {
            return res.status(200).json(JSON.parse(data));
        } else {
            const res = await axios(
                'https://jsonplaceholder.typicode.com/todos?_limit=5',
            );
            await client.set('data', JSON.stringify(res.data));
            return res.status(200).json(res.data);
        }
    } catch (error) {
        console.log(error);
    }
});

//! test redis
(async () => {
    //basic
    await client.set('name', 'TranDung', {
        EX: 100,
        NX: true,
    });
    const data = await client.get('name');
    console.log(data);
    // hSet

    await client.hSet('user', 'fullname', 'TranVanDung');
    console.log(await client.hGetAll('user')); //{ fullname: 'TranVanDung' }
    console.log(await client.hVals('user')); //[ 'TranVanDung' ];

    //multiple exec
    const [setKeyReply, otherKeyValue] = await client
        .multi()
        .set('key', 'value')
        .get('name')
        .exec(); // ['OK', 'another-value']
    console.log(setKeyReply); //Oke
    console.log(otherKeyValue); //TranDung
})();

(async () => {
    const subscriber = client.duplicate();
    await subscriber.connect();

    //Export message on a channel
    await subscriber.publish('chat', 'Hello world!');
})();
app.listen(port, () =>
    console.log(`Server listening on http://localhost:${port}`),
);
