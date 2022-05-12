import React, { useEffect, useState, useContext } from "react";
import { useMoralis } from "react-moralis";
import MoralisDappContext from "./context";
import AirQuakeCollectionABI from '../../artifacts/contracts/airQuakeV1.sol/AirQuake.json'

function MoralisDappProvider({ children }) {
  const { web3, Moralis, user, enableWeb3, isWeb3Enabled, isInitialized } = useMoralis();
  const [walletAddress, setWalletAddress] = useState();
  const [chainId, setChainId] = useState("0x13881");       
  const [contractABI, setContractABI] = useState(AirQuakeCollectionABI.abi);
  const [marketAddress, setMarketAddress] = useState("0xc3FfAF46dDa00219846A0832f576414EC568E2ee");

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
    <MoralisDappContext.Provider value={{ walletAddress, chainId, marketAddress, setMarketAddress, contractABI, setContractABI }}>
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
