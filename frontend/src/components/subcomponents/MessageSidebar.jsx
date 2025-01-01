import { useState } from 'react'
import Conversations from './Conversations.jsx'
import { useGetConversations } from '../hooks/useGetConversations.js'
export default function MessageSidebar(){
  const  {loading,conversations} = useGetConversations()
  const [convos,setConvos] = useState([])
  const [searchValue,setSearchValue] = useState('')
  const [initValue,setInitValue] = useState(0)

  const handleChange = (e) => {
    setSearchValue(e.target.value)
    if(!e.target.value){
      setConvos(conversations)
    }else{
      const convos = conversations.filter((conversation) => {
        return conversation.username.toLowerCase().includes(searchValue.toLowerCase())
      })
      setInitValue(1)
      setConvos(convos)
    }
  }

  return <div className="border border-cyan-600 h-screen p-3 fixed bottom-0 top-14">
      <div className="flex gap-2">
        <input placeholder="Search" onChange={handleChange} value={searchValue}/>
      </div>  

    <Conversations conversations={initValue ? convos : conversations} loading={loading}/>

  </div>
}