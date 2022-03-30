import Blockies from "react-blockies";
import { useMoralisDapp } from "../providers/MoralisDappProvider/MoralisDappProvider";


function Blockie(props) {
  const { walletAddress } = useMoralisDapp();
  if ((!props.address && !props.currentWallet) || !walletAddress) return null;

  return (
    <Blockies
      seed={props.currentWallet ? walletAddress.toLowerCase() : props.address.toLowerCase()}
      
      {...props}
    />
  );
}

export default Blockie;
