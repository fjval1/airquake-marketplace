export const networkConfigs = {
  /*"0x1": {
    currencySymbol: "ETH",
    blockExplorerUrl: "https://etherscan.io/",
  },*/
  /*
  "0x4": {
    currencySymbol: "ETH",
    currencyName: "ETH",
    blockExplorerUrl: "https://rinkeby.etherscan.io/",
    
  },*/
  
  "0x7A69": {
    chainName: "Local Chain",
    currencyName: "ETH",
    currencySymbol: "ETH",
    rpcUrl: "http://localhost:8545",
  },
  
  "0x13881" : {
    currencySymbol: "MATIC",
    currencyName: "Polygon Mumbai",
    blockExplorerUrl: "https://mumbai.polygonscan.com/",
  }
};

export const getNativeByChain = (chain) =>
  networkConfigs[chain]?.currencySymbol || "NATIVE";

export const getChainById = (chain) => networkConfigs[chain]?.chainId || null;

export const getExplorer = (chain) => networkConfigs[chain]?.blockExplorerUrl;

export const getWrappedNative = (chain) =>
  networkConfigs[chain]?.wrapped || null;
