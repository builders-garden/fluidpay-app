import { providers } from "ethers";

export interface SimpleUser {
  address: string;
  username: string;
}

export interface DBUser {
  address: string;
  avatarUrl: string | null;
  createdAt: string;
  displayName: string;
  id: number;
  isDiscoverable: boolean;
  subscription: string | null;
  updatedAt: string;
  username: string;
  token: string;
}

export interface DBTransaction {
  receipt: providers.TransactionReceipt | null;
  from: string;
  fromUsername: string;
  to: string;
  toUsername: string;
  amount: string;
  createdAt: string;
  txHash: string;
}
