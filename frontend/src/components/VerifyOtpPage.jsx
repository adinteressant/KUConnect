import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useTheme } from './context/themeContext';

export default function VerifyOtp(){

  const {theme, toggleTheme} = useTheme();
useEffect(() => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, [theme]);
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
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="w-full max-w-md p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-serif mb-8 text-center text-gray-800">Verify OTP</h1>
        <p className="text-center text-gray-600 mb-6">
          Enter the OTP sent to {queryParams.get('email')}
        </p>
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="w-full space-y-2">
            <input
              type="text"
              placeholder="Enter 4-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 rounded-md text-base transition-colors bg-gray-100 focus:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
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