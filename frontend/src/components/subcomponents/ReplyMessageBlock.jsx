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
  return <div className="flex justify-between px-4 py-2
  bg-gray-100 dark:bg-slate-900 dark:text-gray-200">
    <div>
      Replying to: {replyOf?.message || 'Post'}
    </div>
    <div onClick={()=>{setReplyOf({});setReply(false)}}
    className="cursor-pointer">
    <X/>
    </div>
  </div>
  }
}