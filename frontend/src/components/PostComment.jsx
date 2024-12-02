import { Link, useNavigate } from "react-router-dom";
import React, { useContext, useState } from 'react'
import ReactTimeAgo from 'react-time-ago'
import { Button, Modal } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

const PostComment =  (props) => {
    const date = new Date(props.comment.created_on)
    const {authTokens,user} = useContext(AuthContext);
    const navigate = useNavigate()

    const [show, setShow] = useState(false);
    const [error, setError] = useState(null);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleCloseDelete = async (commentId) =>{
        try {
            let response = await fetch(
                `http://127.0.0.1:8000/api/posts/comments/${commentId}/`,{
                method: 'DELETE',
                headers: { 
                    'Authorization': `Bearer ${authTokens.access}`,
                },
            })
            if(!response.ok){
                throw new Error('Could not delete post');
            }
            navigate(`/posts/${props.postId}/`)
        } catch (error) {
            setError(error);
        } finally{
            navigate(`/posts/${props.postId}/`)
            props.getPost(props.postId)
        }
        setShow(false);
    }
    return ( 
        <>
            <div className="">

                <div className="d-flex flex-start align-items-center">
                    <img className="rounded-circle shadow-1-strong me-3"
                        src={props.comment.comment_profile_image} alt="avatar" width="50"
                        height="50" />
                    <h6 className="fw-bold mb-1">
                        <Link to={`/users/${props.comment.author}/profile/`} 
                             className="text-dark text-decoration-none">
                                {props.comment.author_username}
                        </Link>
                    </h6>
                    <small className="fw-light ms-2">
                        <ReactTimeAgo date={date} locale="en-US" />
                    </small>
                </div>

                <div>
                    
                    <p className="mb-1 bg-light p-2 w-75 mx-auto">
                        {props.comment.comment}
                    </p>



                    <div className="mx-auto w-75 d-flex justify-content-end">
                        {props.comment.author === user.user_id? (
                             <>
                                <Button variant="danger" size="sm" onClick={handleShow}>    
                                     Delete
                                </Button>
                                <Modal show={show} onHide={handleClose}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Delete</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>Are you sure you want to delete this 
                                          comment?
                                                        </Modal.Body>
                                    <Modal.Footer>
                                       <Button 
                                           variant="secondary" size="sm" 
                                           onClick={handleClose}>
                                           Close
                                       </Button>
                                       <Button variant="danger"         
                                         onClick={()=>handleCloseDelete(props.comment.id)}>
                                         Delete
                                       </Button>
                                     </Modal.Footer>
                                    </Modal>
                                </>
                            ):(
                                <></>)
                        }
                    </div>
                </div>
            </div>

            <hr className="my-2" />  
            
      </>
    )
}
export default PostComment;
