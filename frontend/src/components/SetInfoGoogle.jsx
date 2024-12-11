import { useLocation } from 'react-router-dom'
import { useState } from 'react'

export default function SetInfoGoogle(){

  const location = useLocation()

  const [username,setUsername] = useState('')
  const [role,setRole] = useState('')

  const queryParams = new URLSearchParams(location.search)

  const handleSubmit = (e) => {
    e.preventDefault()

    const gmail = queryParams.get('email')

    
    fetch('/api/set-user-info',{
      method: 'POST',
      headers: {
        "Content-type": 'application/json',
      },
      body: JSON.stringify({
        gmail: gmail,
        username: username,
        role:role
      }),
    })
    .then(response => response.json())
    .then((data)=>{
      console.log('Success:', data);
      alert('Setup successful!');
      window.location.href = `/`
    })
    .catch((e)=>{
      console.log(e)
      alert('Registration failed!')
    })
  }

  return <div>
    <form className="flex flex-col gap-2 m-6" onSubmit={handleSubmit}>
      <input type="text" placeholder="Username" required
        onChange={(e)=>{setUsername(e.target.value)}}
      />
      <div className="w-full space-y-2">
            Role:
            <select
              onChange={(e) => {setRole(e.target.value)}}
            >
              <option value="">Select Role (Student or Faculty)</option>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
            </select>
          </div>
      <button type="submit" className="border border-cyan-400 hover:bg-slate-300">
        Update
      </button>
    </form>
  </div>
}