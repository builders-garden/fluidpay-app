import { BigNumber, constants } from "ethers";
import { encodeFunctionData, erc20Abi } from "viem";
import { erc20FeeProxyAbi } from "./erc20_fee_proxy_abi";

export const allowanceERC20TxData = (
  owner: `0x${string}`,
  spender: `0x${string}`
) => {
  return encodeFunctionData({
    abi: erc20Abi,
    functionName: "allowance",
    args: [owner, spender],
  });
};

export const approveERC20TxData = (spender: `0x${string}`, amount: number) => {
  return encodeFunctionData({
    abi: erc20Abi,
    functionName: "approve",
    args: [spender, BigInt(amount * 10 ** 6)],
  });
};

export const payERC20FeeRequestTxData = (
  token: {
    address: string;
    decimals: number;
  },
  paymentAddress: string,
  amount: number,
  paymentReference: string
) => {
  return encodeFunctionData({
    abi: erc20FeeProxyAbi,
    functionName: "transferFromWithReferenceAndFee",
    args: [
      token.address,
      paymentAddress,
      BigInt(amount * 10 ** token.decimals),
      `0x${paymentReference}`,
      BigNumber.from(0),
      constants.AddressZero,
    ],
  });
};
