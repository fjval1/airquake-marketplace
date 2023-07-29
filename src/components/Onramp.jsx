import { useEffect, useState} from "react";
import { useMoralis} from "react-moralis";
import OnramperWidget from "@onramper/widget";



function Onramp(props) {
    const { Moralis } = useMoralis();
    const [onRamperSrc, setOnRamperSrc] = useState("");
    
    
    useEffect(() => {
        async function getRamperUrl() {
            await Moralis.initPlugins();
            let response = await Moralis.Plugins.fiat.buy(
              {},
              { disableTriggers: true }
            );
            setOnRamperSrc(response.data);
        }
        getRamperUrl()
    },)
    

    return ( onRamperSrc && <div
        dangerouslySetInnerHTML={{
          __html: `<iframe src=${onRamperSrc} />`,
        }}
      />
      ) 
    
   return <p>TODO</p>
}
  
  export default Onramp;
  