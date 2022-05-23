import React, { useEffect, useState, useContext } from "react";
import { useMoralis } from "react-moralis";
import MoralisDappContext from "./context";
import MarketplaceABI from '../../artifacts/contracts/marketplace.sol/Marketplace.json'
import NFTABI from '../../artifacts/contracts/NFT.sol/NFT.json'

function MoralisDappProvider({ children }) {
  const { web3, Moralis, user, enableWeb3, isWeb3Enabled, isInitialized } = useMoralis();
  const [walletAddress, setWalletAddress] = useState();
  const [chainId, setChainId] = useState("0x13881");       
  const [marketplaceABI, setMarketplaceABI] = useState(MarketplaceABI.abi);
  const [nftABI, setNftABI] = useState(NFTABI.abi);
  const [marketplaceAddress, setMarketplaceAddress] = useState("0xC2c92BDE02C6AB25B156563B06e1085a69A98438");

  useEffect(() => {
    Moralis.onChainChanged(function (chain) {
      setChainId(chain);
    });

    Moralis.onAccountChanged(function (address) {
      setWalletAddress(address[0]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  //useEffect(() => setChainId(web3.givenProvider?.chainId));
  useEffect(() => setChainId("0x13881"));

  useEffect(
    () => setWalletAddress("" || user?.attributes.ethAddress),
    [web3, user]
  );

  return (
    <MoralisDappContext.Provider value={{ walletAddress, chainId, marketplaceAddress, setMarketplaceAddress, marketplaceABI, setMarketplaceABI, nftABI, setNftABI }}>
      {children}
    </MoralisDappContext.Provider>
  );
}

function useMoralisDapp() {
  const context = useContext(MoralisDappContext);
  if (context === undefined) {
    throw new Error("useMoralisDapp must be used within a MoralisDappProvider");
  }
  return context;
}

export { MoralisDappProvider, useMoralisDapp };
