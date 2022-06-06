import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useMoralis, useMoralisQuery } from "react-moralis";
import { Card, Image, Tooltip, Badge } from "antd";
import { FileSearchOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import NFTMinter from './NFTMinter'
import {
  BrowserRouter as Router,
  NavLink,
} from "react-router-dom";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";

const { Meta } = Card;
const styles = {
  NFTs: {
    display: "flex",
    flexWrap: "wrap",
    WebkitBoxPack: "start",
    justifyContent: "flex-start",
    margin: "0 auto",
    maxWidth: "1000px",
    gap: "10px",
  },
};

const Collection = () => {
  let params = useParams();
  const [nfts,setNFTs] = useState();
  const [thumbnail, setThumbnail] = useState();
  const { Moralis, isInitialized, isAuthenticated } = useMoralis();
  const collectionId = params.collectionId

  useEffect(() => {
    const getData = async () => {
      const options = {
        chain: "0x13881",
        address: collectionId,
      };
      const nftData = await Moralis.Web3API.token.getAllTokenIds(options);
      const jsonNFTs = nftData.result.map((nft)=>{return {token_id:nft.token_id, metadata:JSON.parse(nft.metadata)}})
      setNFTs(jsonNFTs);
      /*
      const readOptions = {
        contractAddress: collectionId,
        functionName: "authorAddress",
        abi: nftABI,
      };
      */
      //const author = await Moralis.executeFunction(readOptions);
      //setCollectionAuthor(author)
    }
    if (isInitialized){
      getData()
    }

  },[isInitialized]);
  
  const {data:forSaleItems, error, isLoading } = useMoralisQuery("Listings", query => 
        query.equalTo("NFTCollectionAddress", collectionId)
             .equalTo("confirmed",true)
             .equalTo("active",true));
          
  const {data } = useMoralisQuery("NFTCollections", query => 
    query.equalTo("contractAddr", collectionId)
    .equalTo("confirmed",true));
  const collectionAuthor = data.length && data[0].attributes.author                

  const isForSale = (nft) => {
    return forSaleItems.find(
      (item) => 
        item.attributes.tokenId === nft.token_id
    )
  }

  const isCollectionAuthor = () => {
    if (!isAuthenticated){
      return false
    }
    if (collectionAuthor){
      return collectionAuthor.toLowerCase() === Moralis.User.current().attributes.ethAddress
    }
  }
  
  const handleThumbnailChange = (e) => {
    setThumbnail(e.target.files[0])
  }

  const handleSetThumbnail = () => {
    alert("changing collection thumbnail")
  }

  const thumbnailEditor = 
  <div className="container">
    <div className="row">
      <div className="title">Collection Thumbnail</div>
      <div id="app" className="col-md-6 offset-md-3">
          <div className="form_element">
              <input onChange={handleThumbnailChange} className="form-control" type="file" id="input_image" name="image" accept="image/png, image/jpeg"/>
          </div>
          <div className="form_element">
              <button onClick={handleSetThumbnail} className="btn btn-primary btn-lg btn-block" id="submit_button">Edit</button>
          </div>
      </div>
    </div>
  </div> 
  return (
    <>
      { isCollectionAuthor() && <NFTMinter collectionId={collectionId}/>}
      { isCollectionAuthor() && thumbnailEditor}
      {collectionAuthor && <div>
        Collection Author: {collectionAuthor}
      </div>
      }
      <div style={styles.NFTs}>
        {nfts &&
          nfts.map((nft, index) => (
            <Card
              hoverable
              actions={[
                <Tooltip title="View On Blockexplorer">
                  <FileSearchOutlined
                    onClick={() =>console.log("")}
                  />
                </Tooltip>,
                <Tooltip title="List NFT for sale">
                  <ShoppingCartOutlined onClick={() => alert("Not implemented here yet")} />
                </Tooltip>,
              ]}
              style={{ width: 240, border: "2px solid #e7eaf3" }}
              cover={
                <NavLink to={`/collections/${collectionId}/${nft.token_id}`}>
                  <Image
                    preview={false}
                    src={"https://gateway.ipfs.io/ipfs/"+nft.metadata.image.split("//")[1] }
                    fallback="data:image/png;base64,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"
                    alt=""
                    style={{ height: "240px" }}
                  />
                </NavLink>
              }
              key={index}
            >
              {isForSale(nft) && <Badge.Ribbon text="Buy now" color="green"></Badge.Ribbon>}
              <Meta title={nft.metadata.name} description={nft.metadata.description} />
            </Card>
          ))}
          {nfts != undefined && !nfts.length && 
          <h2>No NFTs have been minted yet</h2>}
      </div>
    </>
  );
}


export default Collection;
