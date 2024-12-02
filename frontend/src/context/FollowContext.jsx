import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';

// Create a FollowContext
export const FollowContext = createContext();

export function FollowProvider({ children }) {
    const [followedUsers, setFollowedUsers] = useState([]);
    const {authTokens} = useContext(AuthContext);
    const [loading,setLoading]=useState(true)

    const getFollowed = async (userId) =>{
        try{
            const response = await fetch(
                `http://127.0.0.1:8000/api/users/${userId}/profile/follow/`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokens.access}`,
            }
          })
            const data = await response.json()
            if (data.detail === "Followed"){
              setFollowedUsers((prevFollowedUsers)=>[...prevFollowedUsers,userId]);
            }
        }catch(error){
            console.log(error);
        }finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        if(loading){
            setLoading(false);
        }
    },[])

    const toggleFollow = async (userId) => {
        const isFollowing = followedUsers.includes(userId);
        try {
            // Call the appropriate API endpoint based on the current follow state
            const response = await fetch(
                `http://localhost:8000/api/users/${userId}/profile/follow/`, {
            method: isFollowing ? 'DELETE' : 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokens.access}`,
                },
            });

            if (response.ok) {
                // Update the follow state in the context
                setFollowedUsers((prev) =>
                isFollowing ? prev.filter(id => id !== userId) : [...prev, userId]
                );
            } 
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    if(loading){
        return<p>Loading...</p>
    }

        const contextData = {
        followedUsers:followedUsers, 
        toggleFollow:toggleFollow,
        getFollowed:getFollowed,
    }


    return (
        <FollowContext.Provider value={contextData}>
            {loading?null:children}
        </FollowContext.Provider>
    );
}
