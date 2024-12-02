import { useContext, useEffect, useState } from "react";

import { Col, Row } from "react-bootstrap";
import { Link} from "react-router-dom"
import { AuthContext } from "../context/AuthContext";
import PostCard from "../components/PostCard";

const HomePage = () => {
    const {authTokens} = useContext(AuthContext);

    const [posts, setPosts] = useState([]);
    const [error,setError] = useState(null);
    const [loading,setLoading] = useState(true);
    
    const getPosts = async () => {
        try{
            let response = await fetch('http://127.0.0.1:8000/api/posts/',{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authTokens.access}`,
                }
            })
            const data = await response.json()
            if(response.status === 200){
                setPosts(data)
            }
        }catch{
            setError(error);
        }finally{
            setLoading(false);
        }
    }

    useEffect(()=> {
        getPosts()
    },[])

    if (loading) {
        return <div className="mx-auto container" 
                    style={{maxWidth:"935px"}}>Loading...</div>; // Show loading message
    }

    if (error) {
        return <div className="mx-auto container" 
                    style={{maxWidth:"935px"}}>Error: {error}</div>; // Show error message
    }

    return (
        <section className="container-fluid " style={{maxWidth:"935px"}}>
            <Link to="/addpost/">
                <button className="mb-2 btn btn-success">
                    Add Post
                </button>
            </Link>
            <Row>
                <Col>
                    {posts.map(post =>(
                    <PostCard key={post.id} post={post} getPosts={getPosts}/>
                ))}
                </Col>
            </Row>
        </section>
    )
}

export default HomePage;
