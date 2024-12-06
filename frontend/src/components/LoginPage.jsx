import { useState } from "react"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const [errors, setErrors] = useState({
    email: "",
    password: ""
  })

  const handleSubmit = async (e) => {
    try
    {
      e.preventDefault()

      const response = await fetch(`/v1/api/user-login/`,{
        method:'POST',
        headers:{
          "Content-type":'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
  
      const context = await response.json(); // This is the response you get from the backend
  
      if (!response.ok) {
        throw new Error(context.message || 'Login failed');
      }
  
      // Only storing the JWT token in sessionStorage
      sessionStorage.setItem('jwtToken', context.token); // Store JWT token
  
      console.log('Login successful:', context);
    } catch (error) {
      console.error('Login error:', error.message);
    }
  };
  

  const handleGoogleLogin = () => {
    const backendUrl = 'http://localhost:4000'
    window.location.href = `${backendUrl}/api/auth/google`
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-serif mb-8 text-center text-gray-800">Login</h1>
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="w-full space-y-2">
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-md text-base transition-colors bg-gray-100 focus:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>
          <div className="w-full space-y-2">
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 rounded-md text-base transition-colors bg-gray-100 focus:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className="w-full px-4 py-3 rounded-md text-base font-medium transition-colors bg-cyan-600 hover:bg--700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
            >
              Login
            </button>
          </div>
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full px-4 py-3 rounded-md text-base font-medium transition-colors bg-gray-200 hover:bg-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Login with Google
          </button>
        </form>
      </div>
    </div>
  )
}

