import { create } from 'zustand'

const useVideoCallId = create((set)=>({
  videoCallId:null,
  setVideoCallId: (videoCallId) => set({videoCallId})
}))

export default useVideoCallId
