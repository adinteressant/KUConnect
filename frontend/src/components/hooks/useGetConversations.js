import { useEffect, useState } from 'react'

export const useGetConversations = () => {
  const [loading,setLoading] = useState(false)
  const [conversations,setConversations] = useState([])

  useEffect(()=>{
    const user_id = JSON.parse(localStorage.getItem('authUser')?localStorage.getItem('authUser'):'')
    const getConversations = async () => {
      setLoading(true)
      try{
        const res = await fetch(`/api/view-friends?user_id=${user_id}`)
        const data = await res.json()
        if(data.error){
          throw new Error(data.error)
        }
        setConversations(data.friends)

      }catch(e){
        console.log(e)
      }finally{
        setLoading(false)
      }
    }
    getConversations()
  },[])

  return {loading,conversations}
}

export const useGetConversationsWithDate = () => {
  const [conversations,setConversations] = useState([])
  useEffect(()=>{
    const getConversations = async () => {
      try{
        const res = await fetch(`/api/conversations`)
        const data = await res.json()
        if(data.error){
          throw new Error(data.error)
        }
        
        const updatedConversations = data.map(conversation=>{
          const givenId = conversation._id
          const givenParticipants = conversation.participants
          const givenDate = new Date(conversation.updatedAt)
  
          const epoch = new Date("2000-01-01T00:00:00.000+00:00")
          const latestMessageDate = Math.floor((givenDate - epoch) / 1000)
  
          return {givenId,givenParticipants,latestMessageDate}
        })
        setConversations(updatedConversations)

      }catch(e){
        console.log(e)
      }
    }
    getConversations()
  },[])
  return conversations
}
