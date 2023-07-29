import React, {useState,useEffect} from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";
import {
    BrowserRouter as Router,
//    Routes,
//    Route,
    NavLink,
//    Redirect,
  } from "react-router-dom";
//import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";

const NFTHistoryEvent = ({historyEvent}) => {
    const { Moralis, isAuthenticated } = useMoralis();
    let text;
    let userLink;
    const explorerUrl = "https://mumbai.polygonscan.com/tx/";
    switch (historyEvent.className) {
        case "PlacedListings":
            userLink= <NavLink to={"/users/"+historyEvent.attributes.seller }>{historyEvent.attributes.seller }</NavLink>
            text = <div>Listed for sale by {userLink}</div>
            break;
        case "CanceledListings":
            userLink= <NavLink to={"/users/"+historyEvent.attributes.caller }>{historyEvent.attributes.caller }</NavLink>
            text = <div>Listing Canceled by {userLink} </div>
            break;
        case "SoldListings":
            text = "Bought by "
            break;
        case "PlacedOffers":
            userLink= <NavLink to={"/users/"+historyEvent.attributes.bidder }>{historyEvent.attributes.bidder }</NavLink>
            text = <div>{userLink} offered {Moralis.Units.FromWei(historyEvent.attributes.amount)} MATIC</div>
            break;
        case "CanceledOffers":
            userLink= <NavLink to={"/users/"+historyEvent.attributes.bidder }>{historyEvent.attributes.bidder }</NavLink>
            text = <div>{userLink} canceled his offer of {Moralis.Units.FromWei(historyEvent.attributes.amount)} MATIC</div>
            break;
        case "AcceptedOffers":
            text = historyEvent.attributes.seller+" accepted "+ historyEvent.attributes.buyer+"'s offer"
            break;    
        default:
            text = historyEvent.id  
    }
    return (
        <div style={{border:'solid'}}>
            <div>
                {text}        
            </div>
            <div>
                <a href={explorerUrl+historyEvent.attributes.transaction_hash} 
                target="_blank"
                >
                    TX
                </a>
            </div>
            <div>
                {historyEvent.attributes.createdAt.toString()}
            </div>
        </div>
    );
    }

export default NFTHistoryEvent;
