import { useState,useEffect } from 'react'

export default function useGetFriends(id){
  const [userProfilesLoading, setUserProfilesLoading] = useState(true)
   const [friendsInfo,setFriendsInfo] = useState([])
    useEffect(()=>{
      fetch(`/api/view-friends?user_id=${id}`)
      .then(response => response.json())
      .then(data => {
        setFriendsInfo(data.friends)
      })
      .catch((e)=>{
        console.log(e)
      }).finally(() => {
        setUserProfilesLoading(false)
      })
    },[])
    return {userProfilesLoading , userProfiles: friendsInfo}
}