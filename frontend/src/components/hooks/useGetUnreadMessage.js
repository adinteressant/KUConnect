import { useEffect } from 'react'
import useNewMessages from '../../zustand/useNewMessages'

export const useGetUnreadMessage = () => {
  const {newMessages,setNewMessages} = useNewMessages()
  useEffect(()=>{
    console.log('called the function')
    fetch(`/api/get-message-status/`)
    .then(response => response.json())
    .then(data => { 
      setNewMessages(data.newMessages)
    })
    .catch(e => {
      console.log(e)
    })
  },[newMessages.length]) 
  // return newMessages
}