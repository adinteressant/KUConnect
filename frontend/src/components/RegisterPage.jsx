import { useState, useEffect } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    rePassword: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    rePassword: "",
    password: "",
  });

  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    rePassword: false
  });

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Log the form data to verify it's correct
    console.log('Form Data:', formData);
  
   try {
      const response = await fetch(`/api/user-register/`, {
        method: 'POST',
        headers: {
          "Content-type": 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          rePassword: formData.rePassword,
        }),
      });
  
      const context = await response.json();
  
      if (!response.ok) {
        console.error('Error:', context);
        alert(context.message || 'Failed to register.');
        return;
      }
  
      console.log('Success:', context);
      window.location.href = `/verifyotp?email=${formData.email}`;
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('Something went wrong. Please try again later.');
    }
  };  

  const handleGoogleLogin = () => {
    const backendUrl = 'http://localhost:4000'
    const currentPort = window.location.port
    window.location.href = `${backendUrl}/api/auth/google?port=${currentPort}`
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center dark:bg-gray-900 text-gray-800 dark:text-white bg-gray-100">
      <div className="w-full max-w-md p-8 rounded-lg dark:bg-gray-800 bg-white shadow-md mt-8">
        <h1 className="text-4xl font-serif mb-8 text-center">Signup</h1>
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="w-full space-y-2">
            <input
              type="username"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-3 dark:bg-slate-900 dark:border-slate-800 rounded-md text-base transition-colors bg-gray-100 focus:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
              className="w-full px-4 py-3 rounded-md dark:bg-slate-900 dark:border-slate-800 text-base transition-colors bg-gray-100 focus:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>
          <div className="w-full space-y-2">
          <div className="relative">
            <input
              type={passwordVisibility.password ? "text" : "password"}
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 rounded-md text-base dark:bg-slate-900 dark:border-slate-800 transition-colors bg-gray-100 focus:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
             <button
                type="button"
                onClick={() => togglePasswordVisibility('password')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {passwordVisibility.password ? <EyeOffIcon className="w-5 h-5" /> :
                <EyeIcon className="w-5 h-5" />}
              </button>
              </div>
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          </div>
          <div className="w-full space-y-2">
          <div className="relative">
            <input
              type={passwordVisibility.rePassword ? "text" : "password"}
              placeholder="Re-enter your Password"
              value={formData.rePassword}
              onChange={(e) => setFormData({ ...formData, rePassword: e.target.value })}
              className="w-full px-4 py-3 rounded-md text-base transition-colors dark:bg-slate-900 dark:border-slate-800 bg-gray-100 focus:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
             <button
                type="button"
                onClick={() => togglePasswordVisibility('rePassword')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {passwordVisibility.rePassword ? <EyeOffIcon className="w-5 h-5" /> :
                <EyeIcon className="w-5 h-5" />}
              </button>
              </div>
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
            className="w-full flex items-center justify-center gap-4 px-4 py-3 rounded-md text-base font-medium transition-colors bg-gray-200 hover:bg-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <div className="w-8 h-8">
            <img src = "/images/googleLogo.png" alt = "google logo" />
            </div>
            <div>
            Signup with Google
            </div>
            </button>
        </form>
      </div>
    </div>
  )
}
