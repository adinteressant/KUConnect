import { useEffect, useState } from 'react'

const useGetProfile = () => {
  const [publicInfo,setPublicInfo] = useState([])
  useEffect(()=>{
    fetch(`/api/get-profile`)
    .then(response => response.json())
    .then(data => {
      setPublicInfo(data)
    })
    .catch((e)=>{
      console.log(e)
    })
  },[])
  return publicInfo
}
export default useGetProfile