import { useState } from 'react'
import { useLocation } from 'react-router-dom'

export default function VerifyOtp(){

  const [otp,setOtp] = useState('')
  const location = useLocation()

  const queryParams = new URLSearchParams(location.search)

  const handleSubmit = (e) => {
    e.preventDefault()

    
    const unregisteredEmail = queryParams.get('email')
   
    fetch('/api/verify-otp/',{
      method: 'POST',
      headers: {
        "Content-type": 'application/json',
      },
      body: JSON.stringify({
        unregisteredEmail: unregisteredEmail,
        otp: otp
      }),
    })
    .then(response => response.json())
    .then((data)=>{
      console.log('Success:', data);
      alert('Registration successful!');
      window.location.href = `/login`
    })
    .catch((e)=>{
      console.log(e)
      alert('Registration failed!')
    })
    
  }

  return <div className="flex flex-col">
    <div>
      Enter the OTP that is sent to your email address
    </div>
    <div className="flex flex-col">
      <form onSubmit={handleSubmit} >
        <div>
          <input type="text" placeholder="Enter the OTP" required
          onChange={(e)=>{setOtp(e.target.value)}}/>
        </div>
        <div>
          <button className="border border-cyan-700 hover:bg-cyan-400"
          type="submit">Enter</button>
        </div>
      </form>
    </div>
    
  </div>
}