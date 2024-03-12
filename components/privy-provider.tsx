import React from "react";
import { PrivyProvider as Provider } from "@privy-io/expo";
import { base, sepolia } from "viem/chains";

export default function PrivyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider
      appId={process.env.EXPO_PUBLIC_PRIVY_APP_ID!}
      supportedChains={[sepolia]}
    >
      {children}
    </Provider>
  );
}
