import { useState } from 'react'

export default function MessageContainer(){

  const [message,setMessage] = useState('')
  
  const [messages,setMessages] = useState([
    'My mustache is more feared than your entire military.',
    'At least I didn’t need to invade half of Europe to get noticed.',
   'I prefer expansion, you know, something you might try instead of just talking.',
   'I’ll expand... right after I figure out how to win a battle.'
  ])

  const handleSend = (e) => {
    e.preventDefault()
    console.log('hi')
    if (message.trim() === '') return
    setMessages((prevMessages) => [...prevMessages, message])
    setMessage('')
  }
  
  return <div className="flex flex-col gap-4 p-3 border border-cyan-400">
    {
      messages.map((message, index) => (

        <div key={index}
          className={` border border-cyan-400 ${(index+1)%2===0 ? `text-right`:`text-left`}`}
        >
          {message}
        </div>

      ))  
    }
    <div>
      <form onSubmit={handleSend} className="flex flex-row gap-4">
        <input type="text" placeholder="Enter the text" className="w-full"
        onChange={(e)=>{setMessage(e.target.value)}}/>
        <button type="submit" className="border border-cyan-400 hover:bg-slate-500">
          Send
        </button>
      </form>
    </div>
  </div>
}