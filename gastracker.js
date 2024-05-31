const axios = require('axios');
const fs = require('fs');

let lastBlockDecimal = null;
const apikey = fs.readFileSync('apikey.txt', 'utf8').trim();

const getOPGasPrice = async () => {
    try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const response = await axios.get(`https://api-optimistic.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=${apikey}`);
        const block_hex = response.data.result;
        const blockDecimal = parseInt(block_hex, 16);
        if (blockDecimal !== lastBlockDecimal) {
            const response2 = await axios.get(`https://api-optimistic.etherscan.io/api?module=proxy&action=eth_getBlockByNumber&tag=${block_hex}&boolean=true&apikey=${apikey}`);
            const gasHex = response2.data.result.baseFeePerGas;
            const gasParse = parseInt(gasHex, 16);
            const gasDecimal = gasParse / 1000000000;
            console.log(`${new Date().toLocaleString()} | Block: ${blockDecimal} | Gas: ${parseFloat(gasDecimal).toFixed(7)}`);
            lastBlockDecimal = blockDecimal;
        }
    } catch (error) {
        console.error(error);
    }
};

setInterval(getOPGasPrice, 500);
