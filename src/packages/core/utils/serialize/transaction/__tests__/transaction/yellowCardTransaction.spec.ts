import { ITransactionData, TransactionSerializer } from '../../transaction';
import { yellowCardTxSerializedExample, yellowCardTxReadExample } from '../../__mocks__/examples/yellowCardTx';
import { TransactionType } from '../../../../../common';
import { ITxDataYellowCardData } from '../../txData/txDataYellowCard';
import { checkAssertsCoins } from '../../__mocks__/common';

describe('TransactionSerializer integration tests', () => {

  describe('YellowCard Transaction', () => {

    const aliasTxBytes = Buffer.from(yellowCardTxSerializedExample, 'base64');

    it('should read a serialized transaction and return an ITransactionData object', () => {

      const tx: ITransactionData = TransactionSerializer.read(aliasTxBytes, 0).data;

      expect(tx.type).toEqual(yellowCardTxReadExample.type);
      expect(tx.type).toEqual(TransactionType.YellowCard);
      expect(tx.time).toEqual(yellowCardTxReadExample.time);
      expect(tx.remark).toEqual(yellowCardTxReadExample.remark);
      expect(tx.scriptSign).toEqual(yellowCardTxReadExample.scriptSign);
      expect((tx.txData as ITxDataYellowCardData)).toEqual(yellowCardTxReadExample.txData);

      expect(tx.coinData.inputs.length).toBe(yellowCardTxReadExample.coinData.inputs.length);
      expect(tx.coinData.outputs.length).toBe(yellowCardTxReadExample.coinData.outputs.length);

      checkAssertsCoins(tx.coinData.inputs, yellowCardTxReadExample.coinData.inputs);
      checkAssertsCoins(tx.coinData.outputs, yellowCardTxReadExample.coinData.outputs);

    });

    it('should serialize an example of read transaction', () => {

      let buf = Buffer.alloc(100000);
      const offset = TransactionSerializer.write(yellowCardTxReadExample, buf, 0);
      const tx: string = buf.slice(0, offset).toString('base64');

      expect(tx).toEqual(yellowCardTxSerializedExample);

    });

  });

});