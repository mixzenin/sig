const bitcore = require('bitcore-lib');
const request = require('request');

let msigAddress = '';

let createMsig = () => {
    return new Promise((resolve, reject) => {
        request({
            uri: 'http://127.0.0.1:3000/create/',
            json: true,
          }, (err, res, body) => {
            if(err) reject(err);
            msigAddress = body.address;
            console.log(msigAddress);
            resolve(msigAddress);
          });
    });
}

let createTx = async () => {
    request({
        uri: 'http://127.0.0.1:3000/tx/',
        json: true,
    }, (err, res, body) => {
        if(err) reject(err);
        const tx = new bitcore.Transaction(body.result);
        document.getElementById('tx').value = tx.toString();
        console.log(tx.toString());
    });
}

let sign = async (PK) => {
    const unsignedMsigTx = await getTx();
    let msigTx = new bitcore.Transaction(unsignedMsigTx);
    console.log("DEFAULT:", msigTx.toString());
    msigTx.sign(PK);
    console.log("SIGNED:", msigTx.toString());
    request({
        method: 'POST',
        uri: 'http://127.0.0.1:3000/signed/',
        json: true,
        body: {
            sig: msigTx
        }
      }, (err, res, body) => {
        if(err) reject(err);
        console.log(body.status);
      });
}

//-----------------------------------------------------------------------------------------------------------------------------

let getUTXOs = (address) => {
    return new Promise((resolve, reject) => {
        request({
            uri: 'http://127.0.0.1:3000/utxo/',
            json: true,
            qs: {
                address: address
            }
          }, (err, res, body) => {
            if(err) reject(err);
            resolve(body.utxos);
          });
    });
}

let getTx = () => {
    return new Promise((resolve, reject) => {
        request({
            uri: 'http://127.0.0.1:3000/gettx/',
            json: true,
          }, (err, res, body) => {
            if(err) reject(err);
            resolve(body.tx);
          });
    });
}

exports.sign = sign;
exports.createTx = createTx;
exports.createMsig = createMsig;