import React from "react";
import { useMoralis } from "react-moralis";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";

const Offer = ({tokenOwner, offer}) => {

    const { Moralis, isAuthenticated } = useMoralis();
    const { marketplaceABI,marketplaceAddress, nftABI } = useMoralisDapp();
    
    const handleAcceptOffer = async () =>{
        const options = {
            abi: marketplaceABI,
            contractAddress: marketplaceAddress,
            functionName: "acceptOffer",
            params: {
                NFTCollectionAddress:offer.NFTCollectionAddress,
                tokenId: offer.tokenId
            }    
        }
        const message = await Moralis.executeFunction(options)
        .then(async (message) => {
            alert("Offer accepted")
        })
        .catch((e) => {
            if (e.data){
                alert(e.data.message)
            }
        });
    }   
    
    const handleCancelOffer = async () =>{
        const options = {
            abi: marketplaceABI,
            contractAddress: marketplaceAddress,
            functionName: "cancelOffer",
            params: {
                NFTCollectionAddress:offer.NFTCollectionAddress,
                tokenId: offer.tokenId
            }    
        }
        const message = await Moralis.executeFunction(options)
        .then(async (message) => {
            alert("Offer canceled")
        })
        .catch((e) => {
            if (e.data){
                alert(e.data.message)
            }
        });
    }   

    const isOwnerCurrentAddress = () =>{
        if (!isAuthenticated){
            return false
        }
        return tokenOwner === Moralis.User.current().attributes.ethAddress
    }

    const isOffererCurrentAddress = () => {
        if (!isAuthenticated){
            return false
        }
        return offer.bidder === Moralis.User.current().attributes.ethAddress
    }

    return (
        <div style={{border:'solid'}}>
            <p>{Moralis.Units.FromWei(offer.amount)} MATIC</p> 

            { isOwnerCurrentAddress() && offer.active &&
                <button onClick={handleAcceptOffer} className="btn btn-primary btn-lg btn-block" id="submit_button">Accept</button>
            }
            { isOffererCurrentAddress() && offer.active &&
                <button onClick={handleCancelOffer} className="btn btn-primary btn-lg btn-block" id="submit_button">Cancel</button>
            }
        </div>
    );
    }

export default Offer;
