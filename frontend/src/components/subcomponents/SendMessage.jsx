import { useState } from 'react'
import useSendMessage from '../hooks/useSendMessage'

export default function SendMessage(){

  const [message,setMessage] = useState('')
  const {loading,sendMessage} = useSendMessage()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if(!message) return
    await sendMessage(message)
    setMessage('')
  }

  return <form className="" onSubmit={handleSubmit}>
    <div className="flex gap-2 py-4">
      <input type="text" placeholder="Enter the text" className="w-full"
          value={message}
        onChange={(e)=>{setMessage(e.target.value)}}
      />
      <button type="submit">
        {loading ? `...`: `Send`}
        
      </button>
    </div>
    </form>
}