import { useState,useEffect } from 'react'

export default function useGetFriends(id){
   const [friendsInfo,setFriendsInfo] = useState([])
    useEffect(()=>{
      fetch(`/api/view-friends?user_id=${id}`)
      .then(response => response.json())
      .then(data => {
        setFriendsInfo(data.friends)
      })
      .catch((e)=>{
        console.log(e)
      })
    },[])
    return friendsInfo
}