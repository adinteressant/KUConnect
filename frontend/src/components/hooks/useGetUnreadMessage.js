import { useState,useEffect } from 'react'

export const useGetUnreadMessage = () => {
  const [newMessages,setNewMessages] = useState([])
  useEffect(()=>{
    fetch(`/api/get-message-status/`)
    .then(response => response.json())
    .then(data => {
      setNewMessages(data.newMessages)
    })
    .catch(e => {
      console.log(e)
    })
  },[])
  return newMessages
}