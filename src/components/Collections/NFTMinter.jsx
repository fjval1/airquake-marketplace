import React, { useState, useEffect } from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import Select from 'react-select'

const NFTMinter = ({collectionId}) => {

    const { Moralis } = useMoralis();
    const { nftABI } = useMoralisDapp();

    const [name, setName] = useState();
    const [description, setDescription] = useState();
    const [selectedFile, setSelectedFile] = useState();
    const {data:collections, error, isLoading } = useMoralisQuery("Collection", query => query.equalTo("Creator", Moralis.User.current()));

    const uploadImageToIPFS = async () => {
        const file = new Moralis.File(selectedFile.name, selectedFile)
        await file.saveIPFS();
        return "ipfs://" + file.hash()
    }

    const handleSubmitNFT = async () =>{
        if (!name || !description || !selectedFile){
            alert("missing data necessary to mint your NFT")
            return
        }
        const imageURI = await uploadImageToIPFS()
        const object = {
            name : name,
            description: description,
            image: imageURI,
          }
        const btoa2 = (str) => Buffer.from(str).toString('base64');   
        const file = new Moralis.File("file.json", {base64 : btoa2(JSON.stringify(object))});
        await file.saveIPFS();
        const tokenURI = "ipfs://" + file.hash()
        const options = {
            abi: nftABI,
            contractAddress: collectionId,
            functionName: "mintNft",
            params: {
                _metadataUri: tokenURI,
            },
        }
        const message = await Moralis.executeFunction(options);
        alert("nft minted")
    }  

    const handleFileChange = (e) =>{
        setSelectedFile(e.target.files[0])
    }

    const handleNameChange = (e) => {
        setName(e.target.value)
    }

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value)
    }

    return (
        <div className="container">
            <div className="row">
                <div className="title">NFT Minter</div>
                <div id="app" className="col-md-6 offset-md-3">
                    <div className="form_element">
                        <input onChange={handleNameChange} value={name || ""} className="form-control" type="text" id="input_name" name="name" placeholder="Token name"/>
                    </div>
                    <div className="form_element">
                        <input onChange={handleDescriptionChange} value={description || ""} className="form-control"  type="text" id="input_description" name="description" placeholder="Description"/>
                    </div>
                    <div className="form_element">
                        <input onChange={handleFileChange} className="form-control" type="file" id="input_image" name="image" accept="image/png, image/jpeg"/>
                    </div>
                    <div className="form_element">
                        <button onClick={handleSubmitNFT} className="btn btn-primary btn-lg btn-block" id="submit_button">Mint</button>
                    </div>
                </div>
            </div>
        </div>
    );
    }

export default NFTMinter;
