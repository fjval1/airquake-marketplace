import React, {useState,useEffect} from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import NFTHistoryEvent from "./NFTHistoryEvent";

const NFTHistory = ({collectionAddress, tokenId}) => {

    const { Moralis, isAuthenticated } = useMoralis();
    const { marketplaceABI,marketplaceAddress, nftABI } = useMoralisDapp();
    const [historyEvents,setHistoryEvents] = useState();

    const {data:listingsPlaced } = useMoralisQuery("PlacedListings", query => query.
        equalTo("NFTCollectionAddress", collectionAddress)
        .equalTo("confirmed",true)
        .equalTo("tokenId",tokenId.toString()));

    const {data:listingsCanceled } = useMoralisQuery("CanceledListings", query => query.
        equalTo("NFTCollectionAddress", collectionAddress)
        .equalTo("confirmed",true)
        .equalTo("tokenId",tokenId.toString()));

    const {data:listingsSold } = useMoralisQuery("SoldListings", query => query.
        equalTo("NFTCollectionAddress", collectionAddress)
        .equalTo("confirmed",true)
        .equalTo("tokenId",tokenId.toString()));

    const {data:offersPlaced } = useMoralisQuery("PlacedOffers", query => query.
        equalTo("NFTCollectionAddress", collectionAddress)
        .equalTo("confirmed",true)
        .equalTo("tokenId",tokenId.toString()));

    const {data:offersCanceled } = useMoralisQuery("CanceledOffers", query => query.
        equalTo("NFTCollectionAddress", collectionAddress)
        .equalTo("confirmed",true)
        .equalTo("tokenId",tokenId.toString()));
     
    const {data:offersAccepted } = useMoralisQuery("AcceptedOffers", query => query.
        equalTo("NFTCollectionAddress", collectionAddress)
        .equalTo("confirmed",true)
        .equalTo("tokenId",tokenId.toString()));   

    const {data:mint} = useMoralisQuery("PolygonNFTTransfers", query => query.
    equalTo("token_address", collectionAddress)
    .equalTo("confirmed",true)
    .equalTo("from_address","0x0000000000000000000000000000000000000000")
    .equalTo("token_id",tokenId.toString()));   
        
    useEffect(()=>{
        if ([listingsPlaced,listingsSold,listingsCanceled,offersPlaced,offersCanceled,offersAccepted].includes(undefined)){
            return
        }
        //console.log([listingsPlaced,listingsSold,listingsCanceled,offersPlaced,offersCanceled,offersAccepted])
        const allHistoryEvents = listingsPlaced.concat(listingsCanceled,listingsSold,offersPlaced,offersCanceled,offersAccepted);
        allHistoryEvents.sort((a,b)=>{
            if (a.attributes.createdAt > b.attributes.createdAt) {
                return -1;
            }
            else if (a.attributes.createdAt < b.attributes.createdAt) {
                return 1;
            }
            else{
                return 0
            }
        })
        setHistoryEvents(allHistoryEvents)
    },[listingsPlaced,listingsCanceled,listingsSold,offersPlaced,offersCanceled,offersAccepted])

    const explorerUrl = "https://mumbai.polygonscan.com/tx/";
    return (
        <div style={{border:'solid'}}>
            HISTORY
            {historyEvents && historyEvents.map((historyEvent,index)=>
                <NFTHistoryEvent historyEvent={historyEvent} key={index}/>
            )}
            {mint.length ?
                <div>
                    <div>
                        Minted by {mint[0].attributes.to_address}
                    </div>
                    <div>
                        <a href={explorerUrl+mint[0].attributes.transaction_hash} 
                        target="_blank"
                        >
                        TX
                        </a>
                    </div>
                    <div>
                        {mint[0].attributes.createdAt.toString()}
                    </div>
                </div> 
                : null
            }
        </div>
    );
    }

export default NFTHistory;
