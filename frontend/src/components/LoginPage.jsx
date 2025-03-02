import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Link } from 'react-router-dom'
import {Modal} from '../components/Settings.jsx'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState(""); // Add state for displaying errors
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailModalOpen,setIsEmailModalOpen] = useState(false)
  const [modalEmail,setModalEmail] = useState('')
  
  const [isOTPModalOpen,setIsOTPModalOpen] = useState(false)
  const [modalOTP,setModalOTP] = useState('')
  const [emailOTP,setEmailOTP] = useState('')

  const [isNewPassModalOpen,setIsNewPassModalOpen] = useState(false)
  const [newPass,setNewPass] = useState('')
  const [confirmPass,setConfirmPass] = useState('')

  const [validationString,setValidationString] = useState({message:'Enter your Email.',colorClass:''})

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

  const handleEnter = async () => {
    if(!modalEmail){
      setValidationString({message:'Can not be empty.',colorClass:'text-red-500'})
      return 
    }
    if(!modalEmail.includes('ku.edu.np')){
      setValidationString({message:'Must be a KU domain.',colorClass:'text-red-500'})
      return
    }
    try{
      const response = await fetch(`/api/forgot-password?email=${modalEmail}`)
      const data = await response.json()
      setEmailOTP(data.otp)
    }catch(err){
      console.log(err)
    }
    setIsOTPModalOpen(true)
  }

  const handleEnterOTP = () => {
    if(modalOTP == emailOTP){
      setIsNewPassModalOpen(true)
    }else{
      alert('OTP does not match.')
    }
  }

  const handleEnterNewPass = async () => {
    if(!newPass || newPass.length<8){
      alert('Password should be at least 8 characters long.')
      return
    }
    if(newPass === confirmPass ){
      try{
        const response = await fetch(`/api/set-new-password`,{
          method:'POST',
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify({email:modalEmail,newPassword:newPass})
        })
        if(!response.ok){
          alert('Something went wrong.')
          return
        }
      }catch(err){
        console.log(err)
      }finally{
        alert('Password reset successfully.')
        setIsNewPassModalOpen(false)
        setIsOTPModalOpen(false)
        setIsEmailModalOpen(false)
      }
    }else{
      alert('Passwords do not match.')
    }
  }

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
              className="w-full px-4 py-3 rounded-md text-base dark:bg-slate-900 dark:text-gray-200 dark:border-slate-800 transition-colors bg-gray-100 focus:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
              className="w-full px-4 py-3 rounded-md text-base transition-colors dark:bg-slate-900 dark:text-gray-200 dark:border-slate-800 bg-gray-100 focus:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
              <div className= "dark:text-[#e5e7eb]"><span className="hover:text-cyan-600 cursor-pointer"
              onClick={()=>{setIsEmailModalOpen(true)}}>Forgot Password?</span></div>
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
          <div className="flex justify-center">
            <div
            className="dark:text-[#e5e7eb]"
            >New here? <Link to={'/register'}
            className="hover:text-cyan-600">Create an account</Link></div>
          </div>
        </form>
      </div>
      <Modal
        isOpen={isEmailModalOpen}
        onClose={() => {setIsEmailModalOpen(false);setValidationString({message:'Enter your Email.',colorClass:''})}}
        title="Forgot Password"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            <span className={validationString.colorClass}>{validationString.message}</span>
            <input
              type="email"
              placeholder="Email"
              value={modalEmail}
              onChange={(e) => setModalEmail(e.target.value)}
              className="mt-2 w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
              required
            />

         </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {setIsEmailModalOpen(false);setValidationString({message:'Enter your Email.',colorClass:''})}}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleEnter}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
            >
             Enter 
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={isOTPModalOpen}
        onClose={() => setIsOTPModalOpen(false)}
        title="Forgot Password"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Enter the OTP sent to your Email.
            <input
              type="text"
              placeholder="OTP"
              value={modalOTP}
              onChange={(e) => setModalOTP(e.target.value)}
              className="mt-2 w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
              required
            />
         </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsOTPModalOpen(false)}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleEnterOTP}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
            >
             Enter 
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={isNewPassModalOpen}
        onClose={() => setIsNewPassModalOpen(false)}
        title="Forgot Password"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Enter new password.
            <input
              type="password"
              placeholder="New Password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value.trim())}
              className="mt-2 w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
              required
            />
          </p>
           <p className="text-gray-600 dark:text-gray-300">
            Confirm password.
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value.trim())}
              className="mt-2 w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
              required
            />
         </p>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsNewPassModalOpen(false)}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleEnterNewPass}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
            >
             Enter 
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
