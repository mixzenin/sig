var bitcore = require('bitcore-lib'); // bitcore-lib = bitcore
// var BigNumber = require('bignumber.js');
var Insight = require("bitcore-explorers").Insight;
var insight = new Insight("https://testnet.blockexplorer.com:443");
// var ethereum = require('./ethereum/ethereum');
// var bitcoin = require('./bitcoin/bitcoin');
// var litecoin = require('./litecoin/litecoin');
// var bch = require('./bch/bch');

bitcore.Networks.defaultNetwork = bitcore.Networks.testnet;
//temporally hardcode
var privateBtcKey = "5d80af65ef465f588f79e773ae7883b7cab7ccb395f2852f423f6b6040bac25e"; // btc
var privateEthKey = '0x58119bfb40684e2c406ee0bee58db934d09346ae91ae43caeedf1211174c9b08'; // eth
var privateBchKey = "94d0436da5438925218cd19e5da595b26811448c9c68bc52d391d3537450f235"; // bch
var privateLtcKey = '164f3db7aee8068ffdfce7366a8bd454b87f94831be7d1bf097bcd6cd12ff17b'; // ltc
// var publicKey = "027d67e3f3d67dd5f7bc069b10d6dd612510e669888162a3d6d60f66e0722e974a";

var sourceBtcAddress = "myQvxnnsNyeiQM9pL9jK1AoMbnNX5jqqh6";
var sourceEthAddress = "0x18878fF5939FCDE208228408B725c838eCFA0F7A";
var sourceBchAddress = "mfrpa4yhfxhezzt45w9popj2AFjfnrVtuw";
var sourceLtcAddress = "miM1sPFs6Y5a3V3yG6BgQ1Sb54HbWpJhXN";

var commissionBtcAddress = "msTnmdhHkN5nDS4czQ71rvZbVdtxVtvGHK";
var commissionEthAddress = "0xfa1251199511D5e25e80c76D0614fE10f0522485";
var commissionBchAddress = "mt11xsNSJ1geR3NjUbBERytJ6Au8WyL9UR";
var commissionLtcAddress = "n4ni4Wz3SjGGu7HCvQpwPxqcZYvNUusJtd";

var targetBtcAddress = "2NDVVTfexpe1fwnq1f9SKeaJj3ayi8tdmm4";
var targetEthAddress = "0xE08124b56919F6DFaa5855681Ad5d1e4B3a90321";
var targetBchAddress = "mtQKfUss4224bRPij9JWC9cCr9Gc49YVgf";
var targetLtcAddress = "mk4mDN51Wpc1kea2QccdbwZZQtfQGb7fqc";

// --------------------------------------------------- ETH --------------------------------------------------------------------------------------
// const ethOptions = {
//   targetAddress: targetEthAddress,
//   sourceAddress: sourceEthAddress,
//   amount: '150000000000000000',
//   gasPrice: '21000000000',
//   privateKey: privateEthKey
// };

// ethereum.generateEthTransaction(ethOptions)
//   .then(console.log("Transfer ETH successfull"));

// --------------------------------------------------- BTC --------------------------------------------------------------------------------------
generateBtcTransaction(targetBtcAddress,
                       sourceBtcAddress,
                       '5000000',
                       '10000', //tx fee
                       privateBtcKey
                     )
  .then(console.log("Transfer BTC successfull"));

// --------------------------------------------------- BCH --------------------------------------------------------------------------------------
// const bchOptions = {
//   targetAddress : targetBchAddress,
//   sourceAddress : sourceBchAddress,
//   returnableAddress : sourceBchAddress, // address for return excess funds or revert trade
//   commissionAddress: commissionBchAddress,
//   commission: '0',
//   amount : '3000000',
//   fee : '30000', // tx fee
//   privateKey : privateBchKey
// };
// bch.generateBchTransaction(bchOptions)
//   .then(console.log("Transfer BCH successfull"));

// --------------------------------------------------- LTC --------------------------------------------------------------------------------------
// const ltcOptions = {
//   targetAddress: targetLtcAddress,
//   sourceAddress: sourceLtcAddress,
//   returnableAddress: sourceLtcAddress,
//   commissionAddress: commissionLtcAddress,
//   commission: '0',
//   amount: '3000000',
//   fee: '100000',
//   privateKey: privateLtcKey
// };
// litecoin.generateLtcTransaction(ltcOptions)
//   .then(console.log("Transfer LTC successfull"));
// ethereum.ethBalance("0x18878fF5939FCDE208228408B725c838eCFA0F7A")
// .then(console.log);







async function generateBtcTransaction(targetAddress,
                                      sourceAddress,
                                      amount,
                                      fee, // tx fee
                                      privateKey
                                      ) {
  insight.getUnspentUtxos(sourceAddress, function(error, utxos) { // get information about UTXOS
    if (error) {
      return error;
    } else {
      let _amount = parseInt(amount, 10);
      let _fee = parseInt(fee, 10);
      let tx = new bitcore.Transaction()
        .from(utxos)
        .to(targetAddress, _amount)
        .fee(_fee)
        .change(sourceAddress)
        .sign(privateKey)
        .serialize();
      insight.broadcast(tx, function(error, transactionId) {
      if (error) {
        return error;
      } else {
        return transactionId;
      }
      });
    }
  });
}



// bitcoin.generateBtcTransaction(targetBtcAddress,
//                                commissionBtcAddress,
//                                sourceBtcAddress,
//                                '2000000',
//                                '10000',
//                                '20000', //tx fee
//                                privateBtcKey
//                              )
//   .then(console.log);
