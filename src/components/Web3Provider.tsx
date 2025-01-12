import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { ReactNode } from "react";
import { polygonAmoy } from "viem/chains";
import NetworkCheck from "./NetworkCheck";

export const config = createConfig(
  getDefaultConfig({
    chains: [polygonAmoy],
    transports: {
      [polygonAmoy.id]: http(
        `https://polygon-amoy.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`
      ),
    },

    // Required API Keys
    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",

    // Required App Info
    appName: "Web3 token transfer",

    // Optional App Info
    appDescription:
      "Web3 token transfer using Gemini API and ConnectKit. User can transfer tokens from one address to another by entering prompts to do so.",
    appUrl: "http://localhost:3000",
    appIcon: "http://localhost:3000/logo.png",
  })
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          {children}
          <NetworkCheck />
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
