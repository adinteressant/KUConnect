import {  useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function LandingPage(){
  
  const {setIsSidebarVisible} = useOutletContext();
  const navigate = useNavigate();
  const redirectToLogin = async(e)=>{
     e.preventDefault(); 
     navigate('/login')
  }


return( 
  <div className="font-serif whitespace">
  <div className="top-page-wrapper h-screen">
      <div className="text-6xl text-center mt-32  w-full inline-block"><div className="text-cyan-600 inline">Connect</div> yourself in the <div className="text-cyan-600 inline">KU</div> community!</div>
  <div className="text-center mt-20">

  <button onClick={redirectToLogin} className="bg-gray-600 hover:bg-cyan-700 text-white  py-2 px-4 mx-5 my-5 rounded">
    Login
  </button>
  <button className="bg-cyan-500 hover:bg-cyan-700 text-white  py-2 px-4 rounded">
    Register
  </button>
  </div>
  </div> 

  <div className="px-4 py-2 text-center text-4xl">Make friends and give reviews!</div>

  </div>
);
}
