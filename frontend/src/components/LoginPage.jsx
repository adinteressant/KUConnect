import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState(""); // Add state for displaying errors
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const response = await fetch(`/api/user-login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Login failed");
      }

      const data = await response.json();
      //const token = data.token;
      localStorage.setItem("isAuthenticated", true); // Save token to localStorage //BRO WHAT 
      sessionStorage.setItem('newLogin', 'true');
      localStorage.setItem('isLoggedIn',true)
      window.location.href='/home';
    } catch (error) {
      console.error("Login error:", error.message);
      setErrorMessage(error.message); // Display the error message to the user
    }
  };

  const handleGoogleLogin = () => {
    const currentPort = window.location.port;
    window.location.href = `/api/auth/google?port=${currentPort}`;
    localStorage.setItem('isLoggedIn',true)
    localStorage.setItem('isAuthenticated', false);
    sessionStorage.setItem('newGoogleLogin', 'true');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center dark:bg-gray-900 bg-gray-100">
      <div className="w-full max-w-md p-8 dark:bg-gray-800  bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-serif mb-8 text-center dark:text-gray-200 text-gray-800">Login</h1>
        {errorMessage && <p className="text-sm text-red-500 text-center">{errorMessage}</p>}
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="w-full space-y-2">
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-md text-base dark:bg-slate-900 dark:border-slate-800 transition-colors bg-gray-100 focus:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
          <div className="w-full space-y-2">
            <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 rounded-md text-base transition-colors dark:bg-slate-900 dark:border-slate-800 bg-gray-100 focus:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
             <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOffIcon className="w-5 h-5" /> :
                <EyeIcon className="w-5 h-5" />}
              </button>
              </div>
          </div>
          <div className="pt-2">
            <button
            
              type="submit"
              className="w-full px-4 py-3 rounded-md text-base font-medium transition-colors bg-cyan-600 hover:bg-cyan-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
            >
              Login
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
            Login with Google
            </div>
          </button>
        </form>
      </div>
    </div>
  );
}
