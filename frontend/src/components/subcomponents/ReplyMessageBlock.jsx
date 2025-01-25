import { useEffect } from 'react'
import useReply from '../../zustand/useReply'
import {X} from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

export default function ReplyMessageBlock(){
  const {replyOf,reply,setReplyOf,setReply} = useReply()
  const [searchParams] = useSearchParams()

  useEffect(()=>{
    setReplyOf({})
    setReply(false)
  },[searchParams.get('userId')])

  if(reply){
  return <div className="flex justify-between px-4">
    <div>
      Replying to: {replyOf?.message}
    </div>
    <div onClick={()=>{setReplyOf({});setReply(false)}}
    className="cursor-pointer">
    <X/>
    </div>
  </div>
  }
}