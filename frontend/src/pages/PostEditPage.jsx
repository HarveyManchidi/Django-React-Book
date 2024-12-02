import { jwtDecode } from "jwt-decode";
import { useContext, useEffect, useState } from "react";
import {  useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PostEditPage = () => {
    const {authTokens,user} = useContext(AuthContext);

    const navigate = useNavigate();
    const {postId} = useParams();

    const [description,setDescription] = useState("");
    const [postImage,setPostImage] = useState("");
    const [error,setError] = useState(null);
    const [loading,setLoading] = useState(true);
    const [authorized,setAuthorized] = useState(false);

    useEffect(()=>{
        const getPost = async () => {
            try{
                const response = await fetch(
                    `http://127.0.0.1:8000/api/posts/${postId}/`,{
                    method: 'GET',
                    headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authTokens.access}`,   
                    }
                })
                if(!response.ok){
                    throw new Error('Could not retrieve post');
                }
                const data = await response.json();
                setDescription(data.body);
                setPostImage(data.image);
                setAuthorized(user.user_id===data.author);
            }catch(err){
                setError(err.message);
            }finally{
                setLoading(false);
            }
        }
        getPost();
    },[])

    const onChangeDescription = (e) => {
        e.preventDefault()
        setDescription(e.target.value)
    }

    const onChangePostImage = (e) => {
        e.preventDefault()
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () =>{
            setPostImage(reader.result);
        };
        reader.readAsDataURL(file);  
    }

    const onPostSubmit =async (e)=> {
        e.preventDefault();
        const formData=new FormData();
        formData.append('author',user.user_id)
        formData.append('username',user.username);
        formData.append('body',e.target.description.value)
        if (e.target.postImage.files[0]){
            formData.append('image',e.target.postImage.files[0]);
            setPostImage(e.target.postImage.files[0])
        }
        
        try {
            let response = await fetch(`http://127.0.0.1:8000/api/posts/${postId}/`,{
                method: 'PATCH',
                headers: { 
                    'Authorization': `Bearer ${authTokens.access}`,
                },
                body: formData
            })
            if(!response.ok){
                throw new Error('Could not add post');
            }
            
        } catch (error) {
            setError(error);
        } finally{
            navigate(`/posts/${postId}/`)
        }
    }
    if(loading){
        return<h5>Loading...</h5>
    }

    if(authorized){
        return (
            <>
                <section className="container-fluid" style={{maxWidth:"935px"}}>
                    <p className="text-center">Update Page</p>

                    <form onSubmit={onPostSubmit} encType="multipart/form-data">

                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <input type="text" className="form-control" 
                               id="postDescription" 
                               name="description" 
                               value={description} 
                               onChange={onChangeDescription}/>
                            <div className="form-text">share your thoughts.</div>
                        </div>

                        <div className="mb-3">
                            <label  className="form-label">Image</label>
                            <input type="file"
                               className="form-control" 
                               id="postImage"  
                               onChange={onChangePostImage}/>
                            <img src={postImage}/>
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
                    request by an unauthorized user
                </h5>
            </section>
        </>
        )
    }
}

export default PostEditPage;
