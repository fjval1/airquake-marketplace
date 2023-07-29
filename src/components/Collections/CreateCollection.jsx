import React, { useState } from "react";
import { useMoralis } from "react-moralis";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";

const CreateCollection = () => {
    const { Moralis, isAuthenticated, isUnauthenticated } = useMoralis();
    const { marketplaceAddress, marketplaceABI} = useMoralisDapp();

    const [name, setName] = useState();
    const [symbol, setSymbol] = useState();
    const [description, setDescription] = useState();
    const [selectedFile, setSelectedFile] = useState();

    //TODO: DRY
    const uploadImageToMoralis = async () => {
        if (!selectedFile){
            alert("no thumbnail")
            return
        }
        const file = new Moralis.File(selectedFile.name, selectedFile)
        let fileUrl;
        file.save().then(
            (fileInfo) => {
                fileUrl = fileInfo.url();
                console.log(fileUrl)
                console.log("File saved correctly")},
            (error)=> {console.log(error)}
          );
        return file
    }

    const handleCreateCollection = async () =>{
        if (!name || !symbol){
            alert("Missing data necessary to mint your NFT")
            return
        }

        const thumbnail = await uploadImageToMoralis();

        const options = {
            abi: marketplaceABI,
            contractAddress: marketplaceAddress,
            functionName: "createNFTCollection",
            params: {
              name: name,
              symbol: symbol
            },
        }
        const message = await Moralis.executeFunction(options)
        .then(async (message) => {
            alert("NFT Collection Created --- tx_hash:" + message.hash)
            const CollectionExtraData = Moralis.Object.extend("CollectionExtraData");
            const collectionExtraData = new CollectionExtraData();

            collectionExtraData.save({hash: message.hash, thumbnail: thumbnail.url()})
            .then(
                (success) => {console.log(success)},
                (error) => {console.log(error)}
            );
        })
        .catch((e) => alert(e));
    }  

    
    const handleFileChange = (e) =>{
        setSelectedFile(e.target.files[0])
    }
    
    const handleNameChange = (e) => {setName(e.target.value)}

    const handleSymbolChange = (e) => {setSymbol(e.target.value)}

    const handleDescriptionChange = (e) => {setDescription(e.target.value)}

    return (
        <>
        {isAuthenticated &&
            <div className="container">
                <div className="row">
                    <div className="title">Create Collection</div>
                    <div id="app" className="col-md-6 offset-md-3">
                        <div className="form_element">
                            <input onChange={handleNameChange} value={name || ""} className="form-control" type="text" id="input_name" name="name" placeholder="Collection name"/>
                        </div>
                        <div className="form_element">
                            <input onChange={handleDescriptionChange} value={description || ""} className="form-control"  type="text" id="input_description" name="description" placeholder="Description"/>
                        </div>
                        <div className="form_element">
                            <input onChange={handleSymbolChange} value={symbol || ""} className="form-control"  type="text" id="input_symbol" name="symbol" placeholder="Symbol"/>
                        </div>
                        <div className="form_element">
                            <div>
                                Thumbnail
                            </div>
                            <input onChange={handleFileChange} className="form-control" 
                            type="file" id="input_image" name="image" accept="image/png, image/jpeg"/>
                        </div>
                        <div className="form_element">
                            <button onClick={handleCreateCollection} className="btn btn-primary btn-lg btn-block" id="submit_button">Create</button>
                        </div>
                    </div>
                </div>
            </div>
        }
        {isUnauthenticated && 
            <div> 
                Unauthenticated
            </div>
        }
        </>
    );
    }

export default CreateCollection;