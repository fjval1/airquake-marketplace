export const networkConfigs = {
  /*"0x1": {
    currencySymbol: "ETH",
    blockExplorerUrl: "https://etherscan.io/",
    wrapped: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  },*/
  "0x4": {
    currencySymbol: "ETH",
    currencyName: "ETH",
    blockExplorerUrl: "https://rinkeby.etherscan.io/",
    
  },
  /*
  "0x539": {
    chainName: "Local Chain",
    currencyName: "ETH",
    currencySymbol: "ETH",
    rpcUrl: "http://127.0.0.1:8545",
  },
  */
  "0x13881" : {
    currencySymbol: "MATIC",
    currencyName: "Polygon Mumbai",
    blockExplorerUrl: "https://polygon.etherscan.io/",
  }
};

export const getNativeByChain = (chain) =>
  networkConfigs[chain]?.currencySymbol || "NATIVE";

export const getChainById = (chain) => networkConfigs[chain]?.chainId || null;

export const getExplorer = (chain) => networkConfigs[chain]?.blockExplorerUrl;

export const getWrappedNative = (chain) =>
  networkConfigs[chain]?.wrapped || null;
