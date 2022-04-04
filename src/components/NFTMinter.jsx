import React, { useState } from "react";
import { useMoralis } from "react-moralis";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { useWeb3ExecuteFunction } from "react-moralis";

const NFTMinter = () => {
    const { Moralis } = useMoralis();
    const { chainId, marketAddress, contractABI, walletAddress } = useMoralisDapp();

    const [name, setName] = useState();
    const [description, setDescription] = useState();
    const [selectedFile, setSelectedFile] = useState();

    const uploadImageToIPFS = async () => {
        const file = new Moralis.File(selectedFile.name, selectedFile)
        await file.saveIPFS();
        return "ipfs://" + file.hash()
    }

    const handleSubmitNFT = async () =>{
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
            abi: contractABI,
            contractAddress: marketAddress,
            functionName: "createItem",
            params: {
              tokenURI: tokenURI,
            },
        }
        const { data, error, fetch, isFetching, isLoading } = Moralis.executeFunction(options);
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
                    <div class="form_element">
                        <input onChange={handleNameChange} value={name || ""} className="form-control" type="text" id="input_name" name="name" placeholder="Token name"/>
                    </div>
                    <div class="form_element">
                        <input onChange={handleDescriptionChange} value={description || ""} className="form-control"  type="text" id="input_description" name="description" placeholder="Description"/>
                    </div>
                    <div class="form_element">
                        <input onChange={handleFileChange} className="form-control" type="file" id="input_image" name="image" accept="image/png, image/jpeg"/>
                    </div>
                    <div class="form_element">
                        <button onClick={handleSubmitNFT} className="btn btn-primary btn-lg btn-block" id="submit_button">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
    }

export default NFTMinter;
