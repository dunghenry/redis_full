const { createClient } = require('redis');
const client = createClient();
// const client = createClient({
//     url: '',
// });

client.on('connect', () => {
    console.log('Redis plugged in.');
});
client.on('error', (err) => console.log('Redis Client Error', err));
client.on('ready', () => {
    console.log('Client create successfully!');
});
(async () => {
    await client.connect();
})();
module.exports = client;
