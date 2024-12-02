import { useContext, useEffect } from "react";
import { FollowContext } from "../context/FollowContext";

const FollowButton = (props) => {
    const { followedUsers, toggleFollow,getFollowed} = useContext(FollowContext)
    const userId = props.userId
    const isFollowed = followedUsers.includes(props.userId);

    const handleFollowToggle = () => {
        toggleFollow(userId);
        if(props.updateTotalFollowers){
            if(isFollowed) {
            props.updateTotalFollowers(props.totalFollowers-1)
            }else{
                props.updateTotalFollowers(props.totalFollowers+1)  
            }
        }
      };

    useEffect(()=>{    
        getFollowed(userId)
    },[])

    return (<>
        <button
          className={isFollowed?"btn btn-outline-danger btn-sm float-end mb-1":"btn btn-outline-primary btn-sm float-end mb-1"}
          
          onClick={handleFollowToggle}>
          {isFollowed ? "Unfollow": 'Follow'} 
        </button>
        </>
      );
}
export default FollowButton;
