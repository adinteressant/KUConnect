import { useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useTheme } from './context/themeContext'
export default function SetInfoGoogle(){
  const location = useLocation()

  const [username,setUsername] = useState('')

  const queryParams = new URLSearchParams(location.search)

  const handleSubmit = (e) => {
    e.preventDefault()

    const gmail = queryParams.get('email')
    console.log(gmail)
    
    fetch('/api/set-user-info',{
      method: 'POST',
      headers: {
        "Content-type": 'application/json',
      },
      body: JSON.stringify({
        gmail: gmail,
        username: username,
      }),
    })
    .then(response => response.json())
    .then((data)=>{
      console.log('Success:', data)
      window.location.href = `/`
    })
    .catch((e)=>{
      console.log(e)
      alert('Registration failed!')
    })
  }

  return (
    <div className="min-h-screen w-full flex dark:bg-gray-900 items-center justify-center">
      <div className="w-full max-w-md p-8 dark:bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-4xl font-serif mb-8 text-center  text-gray-800 dark:text-gray-200">Enter details</h1>
        <form className="w-full space-y-6" onSubmit={handleSubmit}>
          <div className="w-full space-y-2">
            <input 
              type="text" 
              placeholder="Enter username" 
              required
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-md text-base dark:bg-slate-900 dark:text-gray-200 dark:border-slate-800 transition-colors bg-gray-100 focus:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div className="pt-2">
            <button 
              type="submit" 
              className="w-full px-4 py-3 rounded-md text-base font-medium transition-colors bg-cyan-600 hover:bg-cyan-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}