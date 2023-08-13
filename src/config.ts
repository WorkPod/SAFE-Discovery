import { ethers } from "ethers";
import { IToken, NetworkEnum } from "./types";

export type Config = {
  networkId: NetworkEnum;
  subgraphUrl: string;
  contracts: { [key: string]: `0x${string}` };
  tokens: { [key: string]: IToken };
};

export const maxDecimals = {
  ETH: 2,
};
