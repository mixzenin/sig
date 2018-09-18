const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bitcore = require('bitcore-lib');
const explorers = require('bitcore-explorers');
const insight = new explorers.Insight("https://testnet-bitcore3.trezor.io");
const cors = require('cors');
const USER1 = "mq9zoRB1cCw7W42am6eNoxpefRemxPPnAo";
const USER1_PUBKEY = "03ba66e200914b9d5b866206fd4f0e2c263c752af91d4809119c7b63cff871768b";
const PK_USER1 = "100dcc938d66f99cd0a23f39a782ccb8b59fd28ab6e840ee0f5dbaeceac80795";
const USER2 = "n11n3jKiqJDBmHZd7fbUouN8mgathiqhv7";
const USER2_PUBKEY = "034f7974c6b44867337a73d68b6c63fa73c160d4425f84d6bf6084bcfe85179edc";
const PK_USER2 = "9ad0c1e422ae4bee51f8c7f262b5a379989d8265445c276ae8ebd4778a510d36";
const USER3 = "n19h79hALSxeGCvnZ8haFgoh2xQTtZeg6T";
const USER3_PUBKEY = "02c61cd44b8cdf160bd08e289f12231cfc27872e19ee848c6ea4be0b32e5a4e803";
const PK_USER3 = "9a67c9f058ec0346dc935a68d6b96dca4ca17fa718ebdd1d7d2d9359a20ac955";
const PUB_KEYS = [USER1_PUBKEY, USER2_PUBKEY, USER3_PUBKEY];
const REQUIRED_SIGNATURES = 2;

let msigTx = '';
let msigAddress = '';
let pubKeys = [];

bitcore.Networks.defaultNetwork = bitcore.Networks.testnet;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/create', (req, res) => {
    if (pubKeys.length == 2) {
        pubKeys.push(USER3_PUBKEY);
        msigAddress = createMsig();
        res.send({address: msigAddress});
    } else {
        res.send({address: false});
    }
    
});

app.get('/tx', async (req, res) => {
    msigTx = await createMsigTx();
    if (msigTx == undefined){
        console.log("Balance null");
        res.send({result: 'Balance null'});
    }
    else {
        res.send({result: msigTx});
    }
});

app.post('/signed', (req, res) => {
    console.log(req.body);
    let signedTx = new bitcore.Transaction(req.body.sig);
    msigTx = signedTx.toObject();
    console.log(signedTx.toString());    
    res.send({status: true});
});


//-----------------------------------------------------------------------------------------------------------------------------

app.get('/utxo', (req, res) => {
    insight.getUnspentUtxos(req.query.address, (error, utxos) => {
        res.send({utxos: utxos});
    });
});

app.get('/gettx', (req, res) => {
    if (msigTx) {
        let transaction = new bitcore.Transaction(msigTx);
        res.send({tx: transaction.toObject(), msig: msigAddress});
    } else {
        res.send({tx: false});
    }
});

app.get('/getpubkey', async (req, res) => {
    let pubkey = req.query.pubkey;
    pubKeys.push(pubkey);
    console.log(pubKeys);
    if (pubKeys.length == 2) {
        pubKeys.push(USER3_PUBKEY);
        msigAddress = createMsig();
        msigTx = await createMsigTx();
        console.log(msigTx.toString());
    }
    res.send({status: true});
});

app.get('/issigner', (req, res) => {
    let signer = false;
    if (req.query.address == USER1 || req.query.address == USER2) {
        signer = true;
    }
    console.log(req.query.address, signer);
    res.send({signer: signer});
});

app.listen(3000, function () {
    console.log('STARTED AT 3000');
  });
  
let createMsig = () => {
    let address = new bitcore.Address(pubKeys, REQUIRED_SIGNATURES);
    address = address.toString();
    return address;
}

let createMsigTx = () => {
    return new Promise((resolve, reject) => {
        let msigTx = new bitcore.Transaction();
        insight.getUnspentUtxos(msigAddress, (err, utxos) => {
            if (utxos == undefined) {
                reejct("Balance null");
            }
            msigTx.from(utxos, pubKeys, REQUIRED_SIGNATURES)
                .to(USER1, 50000)
                .change(msigAddress);
            resolve(msigTx.toObject());
        });
    })
    
}

// let privateKey = new bitcore.PrivateKey();
//   let publicKey = bitcore.PublicKey(privateKey);
//   let address = privateKey.toAddress();
//   privateKey = privateKey.toString();
//   publicKey = publicKey.toString();
//   address = address.toString();
//   console.log(address, publicKey, privateKey);


// let msigAddress = createMsig();
// createMsigTx()
//     .then(tx => {
        
//         let msigTx = new bitcore.Transaction(tx);
//         console.log("\nCREATED:", msigTx.toString());
//         let createdTx = msigTx.toObject();

//         msigTx = new bitcore.Transaction(createdTx);
//         msigTx.sign('a5ec4c8b7c6d7c3fb7cbd3a72cfa69baa559b250531844d134a4b892a60c7f67');
//         let signedTx = msigTx.toObject();
//         console.log("\nUSER1 SIGNED", msigTx.toString());

//         msigTx = new bitcore.Transaction(signedTx);
//         msigTx.sign('9ad0c1e422ae4bee51f8c7f262b5a379989d8265445c276ae8ebd4778a510d36');
//         let fullySigned = msigTx.toObject();
//         console.log("\nUSER2 SIGNED", msigTx.toString());
//     });
