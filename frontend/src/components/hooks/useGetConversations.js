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
