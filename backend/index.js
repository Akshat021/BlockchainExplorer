const express = require('express')
const app = express(); 
const Web3 = require("web3")
const cors = require('cors')

require('dotenv').config()
const port = process.env.PORT || 5000;

// web3 package
let provider = process.env.ETHEREUM_NODE_URL;
let web3Provider = new Web3.providers.HttpProvider(provider);
let web3 = new Web3(web3Provider);

app.use(cors())

app.get('/', (req, res) =>{
    res.send("Hello web3")
})

// same endpoint for both block number and block hash.
app.get('/block/:block', async (req, res) => {
    try {
        const data = await web3.eth.getBlock(req.params.block);
        res.json(data);
    } catch (error) {
        console.log(error);
        res.send("something went wrong..");
    }
})

app.get('/tx/:tx_hash', async (req, res) => {
    try {
        const data = await web3.eth.getTransaction(req.params.tx_hash);
        res.json(data);
    } catch (error) {
        console.log(error);
        res.send("something went wrong..");
    }
})

app.listen(port, () => {
    console.log(`server is listening at port ${port}`);
})