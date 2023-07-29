function SwitchChains() {
    const { switchNetwork, chainId, chain, account } = useChain();
    return (
      <>
        <button onClick={() => switchNetwork("0x13881")}>Switch to Mumbai</button>
        <p>Current chainId: {chainId}</p>
      </>
    );
  }