import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import FollowButton from "../components/FollowButton";
import { Button, Card, Col, Container, Row } from "react-bootstrap";

const ProfilePage = () => {
    const {authTokens,user} = useContext(AuthContext)
    const [totalFollowers,setTotalFollowers] = useState(0)
    const {userId} = useParams();
    
    const [profileDetails,setProfileDetails] = useState({});
    const [profilePosts,setProfilePosts] = useState([]);
    const [loading,setLoading] = useState(true)
    const [error, setError] = useState(null)
    
    
    const getProfilePosts = async () =>{
        try{
            const response = await fetch(
                `http://127.0.0.1:8000/api/users/${userId}/profile/posts/`,{
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
            setProfilePosts(data);
        } catch(err){
            setError(err.message);
        }
    }
    const getProfileDetails = async () =>{
        try{
            const response = await fetch(
            `http://127.0.0.1:8000/api/users/${userId}/profile/`,{
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
            
            setProfileDetails(data);
            setTotalFollowers(data.profile.total_followers);
        } catch(err){
            setError(err.message);
        }finally{
            setLoading(false);
        }
    }

    useEffect(()=> {
        getProfileDetails();
        getProfilePosts();
    },[userId])
    
    const updateTotalFollowers = (newCount) => {
        setTotalFollowers(newCount);
    };

    if (loading) {
        return <div className="mx-auto container" 
                    style={{maxWidth:"935px"}}>Loading...</div>; // Show loading message
    }
    
    if (error) {
        return <div className="mx-auto container" 
                    style={{maxWidth:"935px"}}>Error: {error}</div>; // Show error message
    }
    
    return(
        <section className="mx-auto container" style={{maxWidth:"935px"}}>
            <h1 className="text-center">Profile</h1>
            
            <div className="row">
                <div className="col-12 col-lg-3 text-center">
                    <img src={profileDetails.profile.profile_image} 
                         className="rounded-circle shadow" style={{maxWidth:"200px"}}/>
                    <h5>{profileDetails.username}</h5>
                    <p>{profileDetails.profile.bio}</p>
                    <p>{totalFollowers} {totalFollowers<=1?"follower":"followers"}</p>
                    {profileDetails.profile.user===user.user_id?(
                        <Button variant="secondary me-2">
                            <Link to={`/users/${userId}/profile/edit/`} 
                               className="text-white text-decoration-none 
                                          fw-semibold">    
                                Edit Profile
                            </Link>
                        </Button>
                    ):(
                        <div className="d-flex justify-content-center">
                            <FollowButton userId={profileDetails.profile.user} 
                                  totalFollowers={totalFollowers} 
                                  updateTotalFollowers={updateTotalFollowers} />
                        </div>
                    )}
                        <Button variant="dark">
                            <Link to={`/users/${userId}/profile/followers/`} 
                                  className="text-white text-decoration-none 
                                      fw-semibold">    
                                Followers
                            </Link>
                        </Button>
                    
                </div>
                <div className="col-12 col-lg-9 text-center bg-light" 
                     style={{minHeight:"400px"}}>
                    <h2>Posts</h2>
                    <Container className="mt-4">
                    <Row xs={1} sm={2} md={3} lg={4} className="g-1">
    {profilePosts.map((post) => ( 
        <Col key={post.id}>
            <Card className="shadow">
                <Link to={`/posts/${post.id}/`}>
                    <Card.Img variant="top" 
                              style={{minHeight:"230px"}}  
                              src={post.image}/>
                </Link>
             </Card>
         </Col>
    ))} 
</Row>

                    </Container>
                </div>
            </div>
        </section>
    )
}
export default ProfilePage;
