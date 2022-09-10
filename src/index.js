const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
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
app.get('/', (req, res) => {
    res.send('Oke');
});
(async () => {
    await client.set('name', 'TranDung', {
        EX: 100,
        NX: true,
    });
    const data = await client.get('name');
    console.log(data);
})();
app.listen(port, () =>
    console.log(`Server listening on http://localhost:${port}`),
);
