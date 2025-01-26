import { useEffect } from 'react'
import {X} from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import useEditMessage from '../../zustand/useEditMessage'

export default function EditMessageBlock(){
  const {edit,editMessage,setEdit,setEditMessage,setEditMessageId}
  = useEditMessage()
  const [searchParams] = useSearchParams()
  const editMessageValue = editMessage

  useEffect(()=>{
    setEditMessage('')
    setEdit(false)
  },[searchParams.get('userId')])

  if(edit){
  return <div className="flex justify-between px-4 py-2
  bg-gray-100 dark:bg-slate-900 dark:text-gray-200">
    <div>
      Editing To: {editMessageValue}
    </div>
    <div onClick={()=>{setEditMessage('');setEdit(false);setEditMessageId('')}}
    className="cursor-pointer">
    <X/>
    </div>
  </div>
  }
}