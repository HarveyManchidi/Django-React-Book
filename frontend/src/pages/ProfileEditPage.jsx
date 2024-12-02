import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProfileEditPage = () => {
    const {authTokens,user} = useContext(AuthContext);

    const navigate = useNavigate();
    const {userId} = useParams();

    const [bio,setBio] = useState("");
    const [profileImage,setProfileImage] = useState("");
    const [profile,setProfile] = useState(null);
    const [error,setError] = useState(null);
    const [loading,setLoading] = useState(true);
    const [authorized,setAuthorized] = useState(false);

    useEffect(()=>{
        const getProfile = async () => {
            try{
                const response = await fetch(
                    `http://127.0.0.1:8000/api/users/${userId}/profile/edit/`,{
                    method: 'GET',
                    headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authTokens.access}`,   
                    }
                })
                if(!response.ok){
                    throw new Error('Could not retrieve profile');
                }
                const data = await response.json();
                setBio(data.profile.bio);
                setProfileImage(data.profile.profile_image);
                setProfile(data.profile)
                setAuthorized(user.user_id===data.id);
                
            }catch(err){
                setError(err.message);
            }finally{
                setLoading(false);
            }
        }
        getProfile();
    },[])

    const onChangeBio = (e) => {
        e.preventDefault()
        setBio(e.target.value)
    }

    const onChangeProfileImage = (e) => {
        e.preventDefault()
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () =>{
            setProfileImage(reader.result);
        };
        reader.readAsDataURL(file);  
    }

    const onProfileSubmit =async (e)=> {
        e.preventDefault();
        const formData=new FormData();
        formData.append('user',user.user_id)
        formData.append('username',user.username);

        formData.append('profile.bio',e.target.bio.value)        
        if (e.target.profileImage.files[0]){
            formData.append('profile.profile_image',e.target.profileImage.files[0]);
            setProfileImage(e.target.profileImage.files[0])
        }
        
        try {
            let response = await fetch(
                `http://127.0.0.1:8000/api/users/${userId}/profile/edit/`,{
                method: 'PATCH',
                headers: { 
                    'Authorization': `Bearer ${authTokens.access}`,
                },
                body: formData
            })
            if(!response.ok){
                throw new Error('Could not add post');
            }
            console.log(await response.json())
        } catch (error) {
            setError(error);
        } finally{
            navigate(`/users/${userId}/profile/`)
        }
    }

    if(authorized){
        return (
            <>
                <section className="container-fluid" style={{maxWidth:"935px"}}>
                    <p className="text-center">Update Page</p>

                    <form onSubmit={onProfileSubmit} encType="multipart/form-data">

                        <div className="mb-3">
                            <label className="form-label">Bio</label>
                            <input type="text" 
                                className="form-control" 
                                id="postDescription" 
                                name="bio" 
                                value={bio} 
                                onChange={onChangeBio}/>
                            <div className="form-text">share your thoughts.</div>
                        </div>

                        <div className="mb-3">
                            <label  className="form-label">Image</label>
                            <input type="file" 
                                className="form-control" 
                                id="profileImage"  
                                onChange={onChangeProfileImage}/>
                               <img src={profileImage} width="200" className="mt-3"/>
                        </div>

                        <button className="btn btn-primary">Submit</button>
                    </form>
                </section>            
            </>
        )
    }

    if(!authorized){
        return(
        <>  
            <section>
                <h5 className="container-fluid" style={{maxWidth:"935px"}}>Forbidden 
                    request by an unauthorized user.
                </h5>
            </section>
        </>
        )
    }
}

export default ProfileEditPage;
