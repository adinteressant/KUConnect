import { useState } from "react";

export default function RegisterPage() {

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    rePassword: "",
    password: ""
  })

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    rePassword: "",
    password: ""
  })

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(`http://localhost:6969/v1/api/user-register/`, {
      method: 'POST',
      headers: {
        "Content-type": 'application/json',
      },
      body: JSON.stringify({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      }),
    });

    // Ensure the response is properly parsed
    const context = await response.json();

    if (!response.ok) {
      console.error('Error:', context);
      alert(context.message || 'Failed to register.');
      return;
    }

    console.log('Success:', context);
    alert('Registration successful!');
  } catch (error) {
    console.error('Unexpected error:', error);
    alert('Something went wrong. Please try again later.');
  }
};

  const handleGoogleLogin = () => {
    //logic to be added
    console.log("Attempting to log in with Google")
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md mt-8">
        <h1 className="text-4xl font-serif mb-8 text-center text-gray-800">Signup</h1>
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="w-full space-y-2">
            <input
              type="username"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-3 rounded-md text-base transition-colors bg-gray-100 focus:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
            {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
          </div>

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
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 rounded-md text-base transition-colors bg-gray-100 focus:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          </div>
          <div className="w-full space-y-2">
            <input
              type="password"
              placeholder="Re-enter your Password"
              value={formData.rePassword}
              onChange={(e) => setFormData({ ...formData, rePassword: e.target.value })}
              className="w-full px-4 py-3 rounded-md text-base transition-colors bg-gray-100 focus:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
            {errors.rePassword && <p className="text-sm text-red-500">{errors.rePassword}</p>}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full px-4 py-3 rounded-md text-base font-medium transition-colors bg-cyan-600 hover:bg--700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
            >
              Signup
            </button>
          </div>
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full px-4 py-3 rounded-md text-base font-medium transition-colors bg-gray-200 hover:bg-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Signup with Google
          </button>
        </form>
      </div>
    </div>
  )
}
