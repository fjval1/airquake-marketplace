import React, { useState } from "react";
import { useMoralis } from "react-moralis";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";

const CreateCollection = () => {
    const { Moralis } = useMoralis();
    const { marketplaceAddress, marketplaceABI} = useMoralisDapp();

    const [name, setName] = useState();
    const [symbol, setSymbol] = useState();
    const [description, setDescription] = useState();
    //const [selectedFile, setSelectedFile] = useState();

    /*
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
    */

    const handleCreateCollection = async () =>{
        //const image = await uploadImageToMoralis()
        const options = {
            abi: marketplaceABI,
            contractAddress: marketplaceAddress,
            functionName: "createNftContract",
            params: {
              _name: name,
              _symbol: symbol,
              _description: description
            },
        }
        const message = await Moralis.executeFunction(options);
        alert("collection created")
    }  

    /*
    const handleFileChange = (e) =>{
        setSelectedFile(e.target.files[0])
    }
    */
    const handleNameChange = (e) => {setName(e.target.value)}

    const handleSymbolChange = (e) => {setSymbol(e.target.value)}

    const handleDescriptionChange = (e) => {setDescription(e.target.value)}

    return (
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
                        <button onClick={handleCreateCollection} className="btn btn-primary btn-lg btn-block" id="submit_button">Create</button>
                    </div>
                </div>
            </div>
        </div>
    );
    }

export default CreateCollection;