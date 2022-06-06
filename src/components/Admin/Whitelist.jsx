import React, { useState } from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";

const WhitelistCreator = () => {

    const { Moralis, isAuthenticated, isUnauthenticated } = useMoralis();
    const { marketplaceAddress, marketplaceABI} = useMoralisDapp();
    const [creatorAddress, setCreatorAddress] = useState();
    const ethers = Moralis.web3Library;
    const {data: creators, error, isLoading } = useMoralisQuery("WhitelistedCreators", query => query.equalTo("confirmed",true));

    console.log(creators)

    const handleWhitelistCreator = async () =>{
        if (!creatorAddress ){
            alert("missing creator address")
            return
        }
        if (!ethers.utils.isAddress(creatorAddress)){
            alert("Please enter a correct Ethereum address")
            return 
        }

        const options = {
            abi: marketplaceABI,
            contractAddress: marketplaceAddress,
            functionName: "addCreatorToWhitelist",
            params: {
                creator: creatorAddress,
            },
        }
        const message = await Moralis.executeFunction(options)
        .then(async (message) => {
            alert("Creator Whitelisted")
        })
        .catch((e) => alert(e.data.message));
        
    }

    const handleCreatorAddressChange = (e) =>{
        setCreatorAddress(e.target.value)
    }

    
    return (
        <>
        { isAuthenticated &&
        <div className="container">
            <div className="row">
                <div className="title">Add Creator to Whitelist</div>
                <div id="app" className="col-md-6 offset-md-3">
                    <div className="form_element">
                        <input onChange={handleCreatorAddressChange} value={creatorAddress || ""} className="form-control" 
                        type="text" id="input_name" name="name" placeholder="Creator Address"/>
                    </div>
                </div>
                <div className="form_element">
                        <button onClick={handleWhitelistCreator} className="btn btn-primary btn-lg btn-block" id="submit_button">Add to Whitelist</button>
                </div>
            </div>
        </div>
        }
        {isUnauthenticated && 
            <div> 
                Unauthenticated
            </div>
        }
        <h2>Creators</h2>
        <div>
            {creators.map((creator)=>{
                return (
                <div>{creator.attributes.creator}</div>
                )
            })}
        </div>
        </>
    )
    
}

export default WhitelistCreator;
