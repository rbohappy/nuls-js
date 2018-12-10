import { VarIntSerializer } from './../varInt';
import { ITransactionOutput } from './transaction';
import { VarByteSerializer } from '..';
import { TxDataSerializer, ITxDataData } from './txData/txData';
import { CoinDataSerializer, ICoinDataData } from './coinData/coinData';
import { IReadData, PLACE_HOLDER } from '../common';

/***
  * ### Transaction
  * http://dev.nuls.io/protocol/index.html#Transaction
  *
  * | Len  | Fields     | Data Type   | Remark            |
  * | ---- | ---------- | ----------- | ----------------- |
  * | 2    | type       | uint16      | Trasaction Type   |
  * | 6    | time       | uint48      | timestamp         |
  * | ??   | remark     | VarByte     | remark            |
  * | ??   | txData     | ??          | Transaction data  |
  * | ??   | coinData   | ??          | Token data        |
  * | ??   | scriptSign | VarByte     | P2PKHScriptSig    |
 */

export interface ITransactionData {
  type: number;
  time: number;
  remark: Buffer;
  txData: ITxDataData;
  coinData: ICoinDataData;
  scriptSign: Buffer;
}

export interface ITransactionOutput extends IReadData {
  readBytes: number;
  data: ITransactionData;
}

/**
 * Class to handle the protocol Transaction type
 * http://dev.nuls.io/protocol/index.html#Transaction
 */
export class TransactionSerializer {

  /**
   * Size of the serialized data
   * @returns the bytes size of a serialized transaction
   */
  public static size(data: ITransactionData): number {

    let size: number = 2 + 6;
    size += VarByteSerializer.size(data.remark);
    size += TxDataSerializer.size(data.txData, data.type);
    size += CoinDataSerializer.size(data.coinData);
    size += VarByteSerializer.size(data.scriptSign);

    return size;

  }

  /**
   * Reads a tx buf at the specified offset
   * @param buf Buffer object from where the transaction will be read
   * @param offset Number of bytes to skip before starting to read
   */
  public static read(buf: Buffer, offset: number): ITransactionOutput {

    const initialOffset = offset;

    const type = buf.readUInt16LE(offset);
    offset += 2;

    const time = buf.readUIntLE(offset, 6); // 48 bits
    offset += 6;

    const { data: remark, readBytes: bytes1 } = VarByteSerializer.read(buf, offset);
    offset += bytes1;

    const { data: txData, readBytes: bytes2 } = TxDataSerializer.read(buf, offset, type);
    offset += bytes2;

    const { data: coinData, readBytes: bytes3 } = CoinDataSerializer.read(buf, offset);
    offset += bytes3;

    const { data: scriptSign, readBytes: bytes4 } = VarByteSerializer.read(buf, offset);
    offset += bytes4;

    return {
      readBytes: offset - initialOffset,
      data: {
        type,
        time,
        remark,
        txData,
        coinData,
        scriptSign
      }
    };

  }

  /**
   * Writes data to buf at the specified offset
   * @param data Transaction data to be written to buffer
   * @param buf Buffer object where the transaction will be written
   * @param offset Number of bytes to skip before starting to write.
   * @returns Offset plus the number of bytes that has been written
   */
  public static write(data: ITransactionData, buf: Buffer, offset: number = 0): number {

    offset = buf.writeUInt16LE(data.type, offset);
    offset = buf.writeUIntLE(data.time, offset, 6); // 48 bits
    offset = VarByteSerializer.write(data.remark, buf, offset);
    offset = TxDataSerializer.write(data.txData, buf, offset, data.type);
    offset = CoinDataSerializer.write(data.coinData, buf, offset);

    if (data.scriptSign) {
      offset = VarByteSerializer.write(data.scriptSign, buf, offset);
    }

    return offset;

  }

  public static sizeHash(data: ITransactionData): number {
    return TransactionSerializer.size(data) - VarByteSerializer.size(data.scriptSign);
  }

  // https://github.com/nuls-io/nuls/blob/274204b748ed72fdac150637ee758037d64c7ce5/core-module/kernel/src/main/java/io/nuls/kernel/model/Transaction.java#L91  
  public static writeHash(data: ITransactionData, buf: Buffer, offset: number = 0, PROTOCOL_VERSION: number = 2): number {

    const size: number = TransactionSerializer.sizeHash(data);

    if (size === 0) {

      PLACE_HOLDER.copy(buf, offset);
      offset += PLACE_HOLDER.length;

    } else if (PROTOCOL_VERSION == 2) {

      offset = buf.writeUIntLE(data.type, offset, 2); // 16 bits
      offset = buf.writeUIntLE(data.time, offset, 6); // 48 bits

    } else {

      offset = VarIntSerializer.write(data.type, buf, offset);
      offset = VarIntSerializer.write(data.time, buf, offset);

    }

    if (size > 0) {

      offset = VarByteSerializer.write(data.remark, buf, offset);
      offset = TxDataSerializer.write(data.txData, buf, offset, data.type);
      offset = CoinDataSerializer.write(data.coinData, buf, offset);

    }

    return offset;

  }

}