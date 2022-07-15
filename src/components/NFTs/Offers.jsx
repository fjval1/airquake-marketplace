import React, { useState,useEffect } from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import Offer from "./Offer";

const Offers = ({owner, collectionAddress, tokenId}) => {

    const { Moralis } = useMoralis();
    const [offers, setOffers] = useState();
    //const {  } = useMoralisDapp();

    const {data} = useMoralisQuery("PlacedOffers", query => query.
        equalTo("NFTCollectionAddress", collectionAddress)
        .equalTo("confirmed",true)
        .equalTo("tokenId",tokenId));

    useEffect(()=>{
        const offersData = data.map((offer)=>{return offer.attributes});
        setOffers(offersData);
    },[data])
    
    

    return (
        <div className="container" >
            <h2>Offers</h2>
            {offers?.map((offer, index) => (
                <Offer tokenOwner={owner} offer={offer}/>
            ))}
        </div>
    );
    }

export default Offers;
