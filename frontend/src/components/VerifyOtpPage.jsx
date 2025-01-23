import { useState, useEffect } from 'react'
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

  return (
    <div className="min-h-screen w-full flex dark:bg-slate-900 items-center justify-center">
      <div className="w-full max-w-md p-8 rounded-lg dark:bg-slate-800 shadow-md">
        <h1 className="text-4xl font-serif mb-8 text-center dark:text-gray-200 text-gray-800">Verify OTP</h1>
        <p className="text-center dark:text-gray-300 text-gray-600 mb-6">
          Enter the OTP sent to {queryParams.get('email')}
        </p>
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="w-full space-y-2">
            <input
              type="text"
              placeholder="Enter 4-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 rounded-md text-base border dark:bg-slate-900 dark:text-gray-200 dark:border-slate-800 transition-colors bg-gray-100 focus:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
              maxLength="4"
              pattern="\d{4}"
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className="w-full px-4 py-3 rounded-md text-base font-medium transition-colors bg-cyan-600 hover:bg-cyan-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
            >
              Verify OTP
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}