import React, { useState } from "react";
import { useMoralis } from "react-moralis";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { useWeb3ExecuteFunction, useNewMoralisObject, useMoralisFile } from "react-moralis";

const CreateCollection = () => {
    const { Moralis } = useMoralis();
    const { chainId, marketAddress, contractABI, walletAddress } = useMoralisDapp();

    const [name, setName] = useState();
    const [description, setDescription] = useState();
    const [selectedFile, setSelectedFile] = useState();

    
    const uploadImageToMoralis = async () => {
        if (!selectedFile){
            alert("no thumbnail")
            return
        }
        const file = new Moralis.File(selectedFile.name, selectedFile)
        file.save().then(() => {console.log("file saved correctly")},(error)=> {console.log(error)}
          );
        return file
    }
    

    const handleCreateCollection = async () =>{
        const image = await uploadImageToMoralis()
        const newCollection = new Moralis.Object("Collection");
        newCollection.set("Name", name);
        newCollection.set("Description", description);
        newCollection.set("Thumbnail",image)
        newCollection.save();
        alert("collection created")
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
                        <input onChange={handleNameChange} value={name || ""} className="form-control" type="text" id="input_name" name="name" placeholder="Collection name"/>
                    </div>
                    <div class="form_element">
                        <input onChange={handleDescriptionChange} value={description || ""} className="form-control"  type="text" id="input_description" name="description" placeholder="Description"/>
                    </div>
                    <div class="form_element">
                        <input onChange={handleFileChange} className="form-control" type="file" id="input_image" name="image" accept="image/png, image/jpeg"/>
                    </div>
                    <div class="form_element">
                        <button onClick={handleCreateCollection} className="btn btn-primary btn-lg btn-block" id="submit_button">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
    }

export default CreateCollection;