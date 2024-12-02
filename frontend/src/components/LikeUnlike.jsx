import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const LikeUnlike = (props) =>{
    const postId=props.postId;
    const [liked,setLiked] = useState(false);
    const [likes,setLikes] = useState(props.post.total_likes);
    const {authTokens} = useContext(AuthContext);

    const getLikes= async (postId) =>{
        try{
            const response = await fetch(
                `http://127.0.0.1:8000/api/posts/${postId}/like/`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authTokens.access}`,
                }
            })
            const data = await response.json()
            if (data.detail === "Liked"){
                setLiked(true)
            }else{
                setLiked(false)
            }
        }catch(err){
            console.log(err)
        }
    }

    const likePost = async (postId) => {
        try{
            setLiked((prevLiked)=>!prevLiked);
            liked?setLikes(()=>likes - 1):setLikes(()=> likes + 1);
            fetch(`http://127.0.0.1:8000/api/posts/${postId}/like/`,{
                method: liked?'DELETE':'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authTokens.access}`,
                }
            })
        }catch(err){
            console.log(err)
        }
    }
    
    useEffect(()=>{
        getLikes(postId);
    },[])

        return(
            <>
              {liked?(
                <>
                    <button
                        className="btn btn-outline-danger btn-sm" 
                        onClick={()=>likePost(postId)}>Unlike
                    </button> {likes} likes
                </>
            ):(
                <>
                    <button 
                        className="btn btn-outline-primary btn-sm" 
                        onClick={()=>likePost(postId)}>Like
                    </button> {likes} likes
                </>
            )} 
            </>
        )
}
export default LikeUnlike;
