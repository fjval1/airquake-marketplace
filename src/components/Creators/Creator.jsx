import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useMoralis, useMoralisQuery } from "react-moralis";
import { Card, Image, Tooltip, Badge } from "antd";
import { FileSearchOutlined, ShoppingCartOutlined } from "@ant-design/icons";
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

const Creator = () => {
  let params = useParams();
  const [nfts,setNFTs] = useState();
  const [thumbnail, setThumbnail] = useState();
  const { Moralis, isInitialized, isAuthenticated } = useMoralis();
  const creatorAddress = params.creatorId

  const {data, error, isLoading } = useMoralisQuery("WhitelistedCreators", query => 
        query.equalTo("creator", creatorAddress)
             .equalTo("confirmed",true));
  let creator;
  if (data.length){
      creator = data[0]
  }
          

  
  const handleThumbnailChange = (e) => {
    setThumbnail(e.target.files[0])
  }

  const handleSetThumbnail = () => {
    alert("changing collection thumbnail")
  }

  const ProfilePicEditor = 
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

      {creator && 
      <div>
        <div>
            Name: {creator.attributes.name}
        </div>
        <div>
            Address: {creator.attributes.creator}
        </div>
        
      </div>
      }

    </>
  );
}


export default Creator;