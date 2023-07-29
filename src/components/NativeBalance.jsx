//import { n4 } from "helpers/formatters";
import { useNativeBalance, useMoralis } from "react-moralis";


function NativeBalance(props) {
  
  const { Moralis } = useMoralis();
  const { getBalances, data, nativeToken, error, isLoading } = useNativeBalance({chain:"0x13881"}); 
  if (data && data.balance){
    return <div>{Moralis.Units.FromWei(data.balance)}</div>
  }
  else{
    return null
  }
}

export default NativeBalance;
