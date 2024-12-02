import { Card } from "react-bootstrap";
import LikeUnlike from "./LikeUnlike";
import { Link } from "react-router-dom";
import { useContext,} from "react";
import { AuthContext } from "../context/AuthContext";
import FollowButton from "./FollowButton";

const PostCard = (props) =>{
    const {user} = useContext(AuthContext);
    const post = props.post;
    return(
        <Card className="mb-1 p-2 mx-auto" style={{maxWidth:"600px"}}>
            <Card.Body>
                <Card.Title >
                    <Link 
                        className="text-dark text-decoration-none fw-semibold"
                        to={`/users/${post.author}/profile/`}>
                        {post.author_username} 
                    </Link>
                    
                    {post.author === user.user_id?
                    (<></>):(
                        <>
                    <FollowButton 
                        userId={post.author}  
                        
                        getPosts={props.getPosts}/>
                    </>)
                    }
                    </Card.Title>
                    <Link to={`/posts/${post.id}/`}>
                        <Card.Img src={post.image}></Card.Img>
                    </Link>
                    <p>      
                    <Link 
                        className="text-dark text-decoration-none fw-bold"
                        to={`/users/${post.author}/profile/`} >
                        {post.author_username}
                    </Link> {post.body}</p>
                                
            </Card.Body>
            <Card.Footer>
                <LikeUnlike postId={post.id} post={post}/>
            </Card.Footer>
        </Card>
    )
}
export default PostCard;
