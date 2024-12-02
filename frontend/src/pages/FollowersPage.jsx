import { useContext, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { ListGroup } from "react-bootstrap"

const FollowersPage = () => {
    const {userId} = useParams()
    const {authTokens} =useContext(AuthContext)
    const [followers,setFollowers] = useState([])

    const getProfileFollowers = async () => {
        try{
            const response = await fetch(
                `http://127.0.0.1:8000/api/users/${userId}/profile/followers/`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authTokens.access}`,
                    }
            })
            
             if(!response.ok){
                 throw new Error('Could not retrieve followers');
             }
            const data = await response.json()
            setFollowers(data)
            
        }catch(error){
            console.log(error)
        }
    }

    useEffect(()=>{
        getProfileFollowers()
    },[])
    return(
        <>
        <section className="container-fluid " style={{maxWidth:"935px"}}>
            <h1 className="text-center">Followers</h1>
            {followers.map(follower=>(
                <ListGroup key={follower.id}>
                    <Link to={`/users/${follower.follower}/profile/`} 
                          className="text-decoration-none text-dark">
                        <ListGroup.Item>
                            {follower.follower_username}
                        </ListGroup.Item>
                    </Link>
                </ListGroup>
            ))}
        </section>
        </>
    )

}

export default FollowersPage;
