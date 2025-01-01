import useGetMessage from '../hooks/useGetMessage.js'
import Message from './Message.jsx'
import {Loader2 } from 'lucide-react' 


export default function Messages(){
  const {loading,messages} = useGetMessage()
  
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
        </div>
      ) : messages.length > 0 ? (
        messages.map((message) => (
          <Message key={message._id} message={message} /> 
        ))
      ) : (
        <div className="flex items-center overflow-y-auto justify-center h-full text-gray-500">
          Start a conversation
        </div>
      )}
    </div>
  );
}