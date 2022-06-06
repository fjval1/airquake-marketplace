import React, { useState, useEffect } from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";
import { useParams } from "react-router-dom";
import { Card, Image, Tooltip, Modal, Input, Alert, Button } from "antd";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import Offers from "./Offers";
const NFT = () => {

    const { Moralis, isInitialized, isAuthenticated } = useMoralis();
    const { marketplaceABI,marketplaceAddress, nftABI } = useMoralisDapp();
    const {collectionId: collectionAddress,tokenId} = useParams();
    const [metadata, setMetadata] = useState();
    const [owner, setOwner] = useState();
    const [price, setPrice] = useState();
    const [offer, setOffer] = useState();

    useEffect(() => {
        const getData = async () => {
            const options = {
                address: collectionAddress,
                token_id: tokenId,
                chain: "0x13881",
              };
            
            const tokenIdOwners = await Moralis.Web3API.token.getTokenIdOwners(options);
            setMetadata(JSON.parse(tokenIdOwners.result[0].metadata));
            setOwner(tokenIdOwners.result[0].owner_of)
        }
        if (isInitialized){
          getData()
        }
    
      },[isInitialized]);
    const {data:collection, error, isLoading } = useMoralisQuery("NFTCollections", query => query.equalTo("contractAddr", collectionAddress));
    const {data:forSaleItem } = useMoralisQuery("Listings", query => query.
        equalTo("NFTCollectionAddress", collectionAddress)
        .equalTo("confirmed",true)
        .equalTo("tokenId",tokenId)
        .equalTo("active",true)
        .notEqualTo("price", "0"));

    
    let listingPrice;
    if (forSaleItem.length){
        listingPrice = forSaleItem[0].attributes.price
    }

    const isForSale = (tokenId) => {
        const forSale = forSaleItem.find(
        (item) => 
            item.attributes.tokenId === tokenId
        )
        return forSale
    }           

    // TODO: maybe change owner for listing.seller from contract
    const isOwnerCurrentAddress = () =>{
        if (!isAuthenticated){
            return false
        }
        return owner === Moralis.User.current().attributes.ethAddress
    }

    const handlePutForSale = async () =>{
        if(!price){
            alert("You must set a price")
        }
        const options = {
            abi: marketplaceABI,
            contractAddress: marketplaceAddress,
            functionName: "setListing",
            params: {
                price: Moralis.Units.ETH(price), 
                NFTCollectionAddress:collectionAddress,
                tokenId: tokenId
            }    
        }
        const message = await Moralis.executeFunction(options)
        .then(async (message) => {
            alert("NFT listed for sale")
        })
        .catch((e) => {
            console.log(e)
            if(e.data){
                alert(e.data.message)
            }
        })
    }
    
    const handleCancelListing = async () =>{
        const options = {
            abi: marketplaceABI,
            contractAddress: marketplaceAddress,
            functionName: "cancelListing",
            params: {
                NFTCollectionAddress:collectionAddress,
                tokenId: tokenId
            }    
        }
        const message = await Moralis.executeFunction(options);
        alert("nft listing canceled")
    }      
    
    const handleBuy = async () =>{
        const options = {
            abi: marketplaceABI,
            contractAddress: marketplaceAddress,
            functionName: "buy",
            msgValue: listingPrice,
            params: {
                NFTCollectionAddress:collectionAddress,
                tokenId: tokenId
            }    
        }
        const message = await Moralis.executeFunction(options);
    }   
    
    const handleMakeOffer = async () =>{
        if (!offer){
            alert("Please input your offer");
            return
        }
        const options = {
            abi: marketplaceABI,
            contractAddress: marketplaceAddress,
            functionName: "offer",
            msgValue: Moralis.Units.ETH(offer),
            params: {
                NFTCollectionAddress:collectionAddress,
                tokenId: tokenId
            }    
        }
        const message = await Moralis.executeFunction(options)
        .then(async (message) => {
            alert("Offer made")
        })
        .catch((e) => {
            if (e.data){
                alert(e.data.message)
            }
        });
    }   

    const handleApproveMarketplaceAsOperator = async () =>{
        const options = {
            abi: nftABI,
            contractAddress: collectionAddress,
            functionName: "setApprovalForAll",
            params: {
                operator: marketplaceAddress, 
                approved:true
            }    
        }
        const message = await Moralis.executeFunction(options);
        alert("marketplace approved as operator for this contract")
    }        

    if (metadata && owner && collection.length ){
        return (
            <>
                <Image
                    preview={false}
                    src={"https://gateway.ipfs.io/ipfs/"+metadata.image.split("//")[1] || "error"}
                    fallback="data:image/png;base64,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"
                    alt=""
                    style={{ height: "240px" }}
                />
                <div></div>
                
                <div>
                    {isForSale(tokenId) && <h3>Listing price: {Moralis.Units.FromWei(listingPrice)} Matic</h3>}
                    <div>Name: {metadata.name}</div>
                    <div>Description: {metadata.description}</div>
                    <div>Current owner: {owner}</div>
                    <div>Original Author: {collection[0].attributes.author}</div>
                </div> 
                { !isForSale(tokenId) && isOwnerCurrentAddress() &&
                <div>
                    <Input
                        min="0"
                        autoFocus
                        placeholder="Listing Price in Matic"
                        onChange={(e) => setPrice(e.target.value)}
                        type="number"
                    />
                    <Button
                        size="large"
                        type="primary"
                        style={{
                            marginTop: "10px",
                            borderRadius: "0.5rem",
                            fontSize: "16px",
                            fontWeight: "500",
                        }}
                        onClick={handlePutForSale}
                        > List for Sale
                    </Button>
                </div>
                }
                { !isOwnerCurrentAddress() && isAuthenticated &&
                <div>
                    <Input
                        autoFocus
                        placeholder="Offer Price in Matic"
                        onChange={(e) => setOffer(e.target.value)}
                        type="number"
                        min="0"
                    />
                    <Button
                        size="large"
                        type="primary"
                        style={{
                            marginTop: "10px",
                            borderRadius: "0.5rem",
                            fontSize: "16px",
                            fontWeight: "500",
                        }}
                        onClick={handleMakeOffer}
                        > Make Offer
                    </Button>
                </div>
                }
                { isForSale(tokenId) && !isOwnerCurrentAddress() &&
                    <Button
                    size="large"
                    type="primary"
                    style={{
                        marginTop: "10px",
                        borderRadius: "0.5rem",
                        fontSize: "16px",
                        fontWeight: "500",
                    }}
                    onClick={handleBuy}
                    > Buy now!
                    </Button>
                }
                { isForSale(tokenId) && isOwnerCurrentAddress() &&
                    <Button
                    size="large"
                    type="primary"
                    style={{
                        marginTop: "10px",
                        borderRadius: "0.5rem",
                        fontSize: "16px",
                        fontWeight: "500",
                    }}
                    onClick={handleCancelListing}
                    > Cancel listing
                    </Button>

                }
                { isAuthenticated && isOwnerCurrentAddress() && 
                    <div>
                        <Button
                            size="large"
                            type="primary"
                            style={{
                                marginTop: "10px",
                                borderRadius: "0.5rem",
                                fontSize: "16px",
                                fontWeight: "500",
                            }}
                            onClick={handleApproveMarketplaceAsOperator}
                            > Approve marketplace
                        </Button>
                    </div>
                }
                
                <Offers owner={owner} collectionAddress={collectionAddress} tokenId={tokenId}/>
            </>
        )
    } else{
        return null
    }
}

export default NFT;
