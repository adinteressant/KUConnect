import { create } from 'zustand'

const useTime = create((set)=>({
  zustandDD:'',
  zustandMM:'',
  setZustandDD: (zustandDD) => set({zustandDD}),
  setZustandMM:(zustandMM)=>{set({zustandMM})}
}))

export default useTime