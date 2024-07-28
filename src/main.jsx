import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthersExtension } from "@dynamic-labs/ethers-v5";
import { ZeroDevSmartWalletConnectors } from "@dynamic-labs/ethereum-aa";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const evmNetworks = [
  {
    blockExplorerUrls: ["https://scan.test.btcs.network"],
    chainId: 1115,
    chainName: "Core Blockchain Testnet",
    iconUrls: ["https://scan.test.btcs.network/images/icon.png"],
    name: "Tcore",
    nativeCurrency: {
      decimals: 18,
      name: "tCORE",
      symbol: "tCORE",
    },
    networkId: 1115,

    rpcUrls: ["https://rpc.test.btcs.network"],
  },
];

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DynamicContextProvider
      settings={{
        environmentId: "5987b415-cf76-4c90-a4cc-f38d9f437434",
        walletConnectorExtensions: [EthersExtension],
        walletConnectors: [
          EthereumWalletConnectors,
          ZeroDevSmartWalletConnectors,
        ],
        overrides: { evmNetworks },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </DynamicContextProvider>
  </React.StrictMode>
);
