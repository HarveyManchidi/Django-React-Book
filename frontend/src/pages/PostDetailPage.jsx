import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Button, ButtonGroup, Card, Modal } from "react-bootstrap";
import LikeUnlike from "../components/LikeUnlike";
import FollowButton from "../components/FollowButton";
import PostComment from "../components/PostComment";

const PostDetailPage = ()=>{
    const {postId} = useParams();
    const {authTokens,user} = useContext(AuthContext);
    const navigate = useNavigate();

    const [post,setPost] = useState([]);
    const [authorized,setAuthorized] = useState(false);
    const [loading,setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [show, setShow] = useState(false);
    const [commentValue, setCommentValue] = useState("")

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const onChangeComment = (e) => {
        e.preventDefault()
        setCommentValue(e.target.value)
    }

    // Request Get current Post and Its comments
    const getPost = async (postId) => { 
        try{
            const response = await fetch(`http://127.0.0.1:8000/api/posts/${postId}/`,{
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
            setPost(data);
            setAuthorized(user.user_id===data.author);
        }catch(err){
            setError(err.message);
        }finally{
            setLoading(false);
            
        }
    }

    // Request Post comments to current post
    const handleSubmitComment = async (e) => {
        e.preventDefault();
        try{
            const response = await fetch(`http://127.0.0.1:8000/api/posts/comments/`,{
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authTokens.access}`, 
                },
                body: JSON.stringify(
                  {"author":user.user_id,"post":postId,comment:e.target.comment.value})
            })

            if(!response.ok){
                throw new Error('Could not add post');
            }
            setCommentValue("")
            getPost(postId)
        }catch(error){
            console.log(error);
        }        
    }

    // Request Delete current Post
        const handleCloseDelete = async (postId) =>{
            try {
                let response = await fetch(`http://127.0.0.1:8000/api/posts/${postId}/`,{
                    method: 'DELETE',
                    headers: { 
                        'Authorization': `Bearer ${authTokens.access}`,
                    },
                })
                if(!response.ok){
                    throw new Error('Could not delete post');
                }
                
            } catch (error) {
                setError(error);
            } finally{
                navigate('/')
            }
            setShow(false);
        }
    
    useEffect(()=>{
        getPost(postId);
    },[])


    if (loading) {
        return <div className="mx-auto container" 
                  style={{maxWidth:"935px"}}>
                  Loading...
               </div>; // Show loading message
        
    }
    
    if (error) {
        return <div className="mx-auto container" 
                  style={{maxWidth:"935px"}}>
                  Error: {error}
             </div>; // Show error message
    }
   
    return(
       <section className="mx-auto container" style={{maxWidth:"935px"}}>
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
                        <FollowButton userId={post.author}/>
                    )
                    }
                </Card.Title>
                <Card.Img src={post.image}></Card.Img>
                <span className="mt-5">
                    <Link 
                        className="text-dark text-decoration-none fw-bold"
                        to={`/users/${post.author}/profile/`}>
                        {post.author_username}
                    </Link> {post.body} 
                </span>
            </Card.Body>
            <Card.Footer>
                {/*Like Buttons*/}
                <LikeUnlike postId={post.id} post={post}/>
                
                {/*Edit/Delete Buttons*/}
                <div className="btn-group float-end">
                    {authorized&&
                    <>
                        {/*Edit Buttons*/}
                        <ButtonGroup>
                            <Button variant="primary"> 
                                <Link 
                                    to={`/posts/${post.id}/edit/`} 
                                    className="text-decoration-none text-white">
                                    Edit
                                </Link>
                            </Button>
                            <Button variant="danger" onClick={handleShow}>Delete</Button>
                        </ButtonGroup>

                        {/*Delete Buttons*/} 
                        <Modal show={show} onHide={handleClose}>

                            <Modal.Header closeButton>
                                <Modal.Title>Delete</Modal.Title>
                            </Modal.Header>

                            <Modal.Body>Are you sure you want to delete 
                                 "{post.body}"?
                            </Modal.Body>

                            <Modal.Footer>
                                <Button variant="secondary" 
                                    onClick={handleClose}>
                                    Close
                                </Button>
                                <Button variant="danger" 
                                    onClick={()=>handleCloseDelete(post.id)}>
                                    Delete
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </>}
                </div>
                {/*End Edit/Delete Buttons*/}
            </Card.Footer>
        </Card>

    <section >
        <div className="container my-1 py-5">
            <div className="row d-flex justify-content-center">
                <div className="col-md-12 col-lg-10 col-xl-8">
                    <div className="card">
                        <div className="card-body py-3 border-0" 
                             style={{backgroundColor: "#f8f9fa"}}>

                            <form onSubmit={handleSubmitComment}>
                                <div className="w-100">
                                    <div data-mdb-input-init 
                                         className="form-outline w-100">
                                        <textarea onChange={onChangeComment} 
                                            value={commentValue} 
                                            className="form-control" 
                                            id="textAreaExample" 
                                            rows="4"
                                        style={{background: "#fff"}} name="comment">    
                                        </textarea>
                                    </div>
                                </div>
                                <div className="float-end mt-2 pt-1">
                                    <button className="btn btn-primary btn-sm">
                                       Post comment
                                    </button>
                                    
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

            <section className="mb-1 p-1 mx-auto" style={{maxWidth:"600px"}}>
                <div className="container my-1 py-5">
                    <div className="row d-flex justify-content-center">
                        <div className="col-md-12 col-lg-10">
                            <div className="card">
                                <div className="card-body p-4">
                                    <h4 className="mb-0">Recent comments</h4>
                                    <p className="fw-light mb-4 pb-2">Latest Comments   
                                        section by users</p>
                                    {post.comments.map(comment=>(
                                        <div key={comment.id}>
                                            <PostComment 
                                                comment={comment} 
                                                postId={postId} 
                                                getPost={getPost}/>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </section>
    )
}
export default PostDetailPage;
