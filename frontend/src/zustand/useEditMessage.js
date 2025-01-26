import { create } from 'zustand'

const useEditMessage = create((set)=>({
  edit:false,
  editMessage:'',
  editMessageId:'',
  setEdit: (edit) => set({edit}),
  setEditMessage:(editMessage)=>{set({editMessage})},
  setEditMessageId:(editMessageId)=>{set({editMessageId})}
}))

export default useEditMessage