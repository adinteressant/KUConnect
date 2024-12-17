import { useEffect, useState } from 'react'

export const useGetConversations = () => {
  const [loading,setLoading] = useState(false)
  const [conversations,setConversations] = useState([])

  useEffect(()=>{
    const getConversations = async () => {
      setLoading(true)
      try{
        const res = await fetch('/api/users-message')
        const data = await res.json()
        if(data.error){
          throw new Error(data.error)
        }
        setConversations(data)

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