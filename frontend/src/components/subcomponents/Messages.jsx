import useGetMessage from '../hooks/useGetMessage.js'
import Message from './Message.jsx'

export default function Messages(){
  const {loading,messages} = useGetMessage()
  console.log('messages areeeeeeeee')
  console.log(messages)
  return <div className="h-[484px] overflow-auto scrollbar-custom">
    {loading && 
      (
        <div>Loading... use loading skeleton please...</div>
      )
    }
    {
      !loading && messages.length>0 && 
      messages.map((message)=>(
        <Message key={message._id} message={message}/>
      ))
    }
    {!loading && messages.length === 0 &&
      (
        <div>Start the conversation</div>
      )
    }

  </div>
}