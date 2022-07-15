import React,{useState, useEffect} from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { useParams } from "react-router-dom";

const UserProfile = ({}) => {
    
    const { Moralis, isAuthenticated } = useMoralis();
    const [newUsername, setNewUsername] = useState();
    const [newProfilePicture, setNewProfilePicture] = useState();
    const [profilePicturePreview, setProfilePicturePreview] = useState()
    let params = useParams();
    const userId = params.userId
    const {data, error, isLoading } = useMoralisQuery("_User", query => 
        query.equalTo("ethAddress", userId));
    const user = data.length && data[0]  
    useEffect(() => {
        if (!newProfilePicture) {
            setProfilePicturePreview(undefined)
            return
        }

        const objectUrl = URL.createObjectURL(newProfilePicture)
        setProfilePicturePreview(objectUrl)

        // free memory whenever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [newProfilePicture])

    
    //TODO: DRY
    const uploadImageToMoralis = async (fileName,fileToUpload) => { 
        const file = new Moralis.File(fileName, fileToUpload)
        let fileUrl;
        await file.save().then(
            (fileInfo) => {
                fileUrl = fileInfo.url();
                console.log("File saved correctly")},
            (error)=> {console.log(error)}
          );
        return fileUrl
    }

    const handleUsernameChange = (e) => {
        setNewUsername(e.target.value)
    }

    const handleProfilePictureChange = (e) =>{
        setNewProfilePicture(e.target.files[0])
    }

    const handleEditProfile = async () => {
        if (newUsername){
            user.set("username",newUsername);
        }
        if (newProfilePicture){
            const newProfilePicUrl = await uploadImageToMoralis(newProfilePicture.name,newProfilePicture);
            user.set("profile_picture",newProfilePicUrl)
        }    
        await user.save()
        alert("user profile edited")
    }
    console.log(data)
    return (
        <>  
            {user &&
                <div>
                    <div>
                        Username: {user.attributes.username}
                    </div>
                    <div>
                        Profile Picture: 
                        <img src={user.attributes.profile_picture} />
                    </div>
                </div>
            }
            {isAuthenticated &&
                <div>
                    <div className="form_element">
                        Username
                        <input onChange={handleUsernameChange} value={newUsername || ""} className="form-control" type="text" id="input_name" name="username" placeholder="Username"/>
                    </div>
                    <div className="form_element">
                        <div>
                            Profile Picture
                        </div>
                        {newProfilePicture &&  <img src={profilePicturePreview} /> }
                        <input onChange={handleProfilePictureChange} className="form-control" 
                            type="file" id="input_image" name="image" accept="image/png, image/jpeg"/>
                    </div>
                    <div className="form_element">
                        <button onClick={handleEditProfile} className="btn btn-primary btn-lg btn-block" id="submit_button">Save Changes</button>
                    </div>
                </div>
            }
        </>
    );
    }

export default UserProfile;
