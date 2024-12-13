import { useEffect,useState } from 'react'
import { useParams } from 'react-router-dom'

export default function ProfilePage(){

  const {username} = useParams()
  const [profileData,setProfileData] = useState({
    role:'',
  })

  useEffect(() => {
    fetch(`/api/get-profile?username=${username}`)
    .then(response => response.json())
    .then((profileData) => {setProfileData(profileData)})
    .catch((e) => {
      console.log(e)
    })
  },[])
 
  
  return <div>Name:{username} Role:{profileData?.role}</div>
}