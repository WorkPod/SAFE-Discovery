import { BigNumber } from "ethers";

export enum NetworkEnum {
  SEPOLIA = 11155111,
  GOERLI = 80001,
  POLYGON = 137,
}

export type IToken = {
  name: string;
  address: `0x${string}`;
  symbol: string;
  decimals: number;
  minimumTransactionAmount?: BigNumber;
};

export type ITokenFormattedValues = {
  roundedValue: string;
  exactValue: string;
};
