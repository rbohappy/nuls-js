import * as NULS from '../src';

// import { TransferTransaction, nulsToNa } from '../src/index';
// import { AliasTransaction } from '../src/index';
// import { UTXO, Utxo, ContractCallTransaction } from '../src/index';

const this_is_secret: string = '002313549d166b9d6e4781504dfa8b4bd5a03056f226dca3c5d1e21783e4e0d1ee';

async function run() {

  testContract2();
  // testContract();
  // testTransfer();
  // testAlias();

}

run();


async function testContract2() {

  const contractAddress = 'TTbB8VocYddVHeCwBvXsgRE11G6BSG5c';
  const fromAddress: string = 'TTarN3iszzfkh2j4doWHsMw3LxJJrq25';
  const privateKey: string = this_is_secret;

  const contractConfig: NULS.ContractConfig = {
    api: {
      host: 'https://testnet.nuls.world'
    }
  };

  const lotteryContract: any = await NULS.Contract.at(contractAddress, contractConfig);

  // console.log(lotteryContract.info());

  // const response: any = await lotteryContract
  //   .account(fromAddress, privateKey)
  //   .buyTickets('1', { value: NULS.nulsToNa(2.5) });

  const response: any = await lotteryContract
    .account(fromAddress, privateKey)
    .viewLotteryDetails('1');

  console.log(response);

}

// async function testContract() {

//   const contractAddress = 'TTbA9N6GHNz9fitD7a3HCWjh1KZJNueg';
//   const fromAddress: string = 'TTarN3iszzfkh2j4doWHsMw3LxJJrq25';
//   const privateKey: string = this_is_secret;

//   const transactionConfig: TransactionConfig = {
//     api: {
//       host: 'https://testnet.nuls.world'
//     }
//   };

//   const api = new ContractApi(transactionConfig.api);

//   // getMethods
//   const methods = await api.getMethods(contractAddress);

//   console.log(methods[0]);

//   // call
//   const utxos: UTXO[] = await Utxo.getUtxos(fromAddress, transactionConfig.api);

//   const tx: ContractCallTransaction = ContractCallTransaction
//     .fromUtxos(utxos)
//     .config(transactionConfig)
//     .contractAddress(contractAddress)
//     .sender(fromAddress)
//     .call('buyTickets', '', '1')
//     .value(nulsToNa(2))
//     .remark('contract call :3')
//     .change(fromAddress)
//     .sign(privateKey);

//   const txHash: TransactionHash = await tx.send();
//   console.log(txHash);


//   // view
//   const result = await api.view(contractAddress, 'viewTicketListByOwner', '', '1', fromAddress);
//   console.log(result);

// }

// async function testTransfer() {

//   const fromAddress: string = 'TTarN3iszzfkh2j4doWHsMw3LxJJrq25';
//   const toAddress: string = 'TTattJmAz28RNH95VsRqnGNRhvKAV5Fj';
//   const privateKey: string = this_is_secret;

//   const transactionConfig: TransactionConfig = {
//     api: {
//       host: 'https://testnet.nuls.world'
//     }
//   };

//   const utxos: UTXO[] = await Utxo.getUtxos(fromAddress, transactionConfig.api);

//   const tx: TransferTransaction = TransferTransaction
//     .fromUtxos(utxos)
//     .config(transactionConfig)
//     .to(toAddress, nulsToNa(1))
//     .remark('test transfer :)')
//     .change(fromAddress)
//     .sign(privateKey);

//   const txHash: TransactionHash = await tx.send();
//   console.log(txHash);

// }

// async function testAlias() {

//   const fromAddress: string = 'TTarN3iszzfkh2j4doWHsMw3LxJJrq25';
//   const privateKey: string = this_is_secret;

//   const transactionConfig: TransactionConfig = {
//     api: {
//       host: 'https://testnet.nuls.world'
//     }
//   };

//   const utxos: UTXO[] = await Utxo.getUtxos(fromAddress, transactionConfig.api);

//   const tx: AliasTransaction = AliasTransaction
//     .fromUtxos(utxos)
//     .config(transactionConfig)
//     .alias(fromAddress, 'testnet_account_1')
//     .remark('changing alias 0_o')
//     .sign(privateKey);

//   const txHash: TransactionHash = await tx.send();
//   console.log(txHash);

// }