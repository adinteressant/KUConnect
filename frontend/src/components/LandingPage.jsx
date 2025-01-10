import React, { useEffect } from 'react';
import { useNavigate, useOutletContext } from "react-router-dom";

export default function LandingPage() {
  
  const navigate = useNavigate();
  const { setIsSidebarVisible } = useOutletContext();
  const {userProfile} = useOutletContext();

  useEffect(()=>{
    function changeVal(){
      setIsSidebarVisible(false);
    }
    changeVal();
  } 
,[]);

  const redirectToLogin = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  const redirectToRegister = (e) => {
    e.preventDefault();
    navigate('/register');
  };

  //if(userProfile) {
  //  navigate('/home')
  //}

  return (
    <div className="relative h-full w-full overflow-hidden bg-white">
      {/* Expanded set of blobs with more random positions */}
      {[
        { color: "#4F46E5", position: "left-0 top-0 -translate-x-1/3 -translate-y-1/3", size: "h-64 w-64" },
        { color: "#67E8F9", position: "right-0 top-0 translate-x-1/3 -translate-y-1/3", size: "h-72 w-72" },
        { color: "#34D399", position: "left-0 bottom-0 -translate-x-1/3 translate-y-1/3", size: "h-80 w-80" },
        { color: "#A78BFA", position: "right-0 bottom-0 translate-x-1/3 translate-y-1/3", size: "h-56 w-56" },
        { color: "#F472B6", position: "left-1/4 top-1/4 -translate-x-1/2 -translate-y-1/2", size: "h-48 w-48" },
        { color: "#FCD34D", position: "right-1/4 top-3/4 translate-x-1/2 translate-y-1/2", size: "h-96 w-96" },
        { color: "#4ADE80", position: "left-2/3 top-1/3 -translate-x-1/2 -translate-y-1/2", size: "h-40 w-40" },
        { color: "#F87171", position: "right-1/3 bottom-1/4 translate-x-1/2 translate-y-1/2", size: "h-60 w-60" },
        { color: "#60A5FA", position: "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2", size: "h-52 w-52" },
        { color: "#C084FC", position: "right-2/3 top-2/3 translate-x-1/2 translate-y-1/2", size: "h-44 w-44" },
        { color: "#FB923C", position: "left-1/3 bottom-1/3 -translate-x-1/2 translate-y-1/2", size: "h-72 w-72" },
        { color: "#94A3B8", position: "right-1/2 bottom-1/2 translate-x-1/2 -translate-y-1/2", size: "h-64 w-64" },
        { color: "#2DD4BF", position: "left-3/4 top-1/4 -translate-x-1/2 -translate-y-1/2", size: "h-56 w-56" },
        { color: "#F472B6", position: "right-1/4 bottom-3/4 translate-x-1/2 translate-y-1/2", size: "h-48 w-48" },
        { color: "#818CF8", position: "left-1/6 top-2/3 -translate-x-1/2 -translate-y-1/2", size: "h-80 w-80" }
      ].map((blob, index) => (
        <div
          key={index}
          className={`absolute opacity-10 animate-[bounce_12s_infinite] ${blob.position} ${blob.size}`}
          style={{ 
            animationDelay: `${index * 400}ms`,
            animationDuration: `${20 + (index % 10)}s`
          }}
        >
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path
              fill={blob.color}
              d="M45.7,-77.8C58.9,-69.3,69.3,-55.3,76.4,-40C83.5,-24.7,87.3,-8.1,85.8,8.1C84.3,24.3,77.6,40.1,67.1,52.7C56.6,65.3,42.3,74.7,26.8,78.9C11.3,83.1,-5.4,82.1,-20.8,77.1C-36.2,72.1,-50.3,63.2,-62.1,51.1C-73.9,39,-83.4,23.7,-85.5,7.2C-87.6,-9.3,-82.3,-27,-72.6,-41.8C-62.9,-56.6,-48.8,-68.5,-33.9,-76.1C-19,-83.7,-3.3,-87,11.8,-84.7C26.9,-82.4,32.5,-86.3,45.7,-77.8Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>
      ))}

      {/* Main content */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
    <div>
        <div className="text-center">
          <h1 className="mb-16 text-6xl font-medium text-slate-800 font-serif">
            KUConnect
          </h1>
          
          <div className="mb-16 space-x-6">
            <button
              onClick={redirectToLogin}
              className="rounded-md bg-gray-100 px-8 py-3 font-serif text-gray-800 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Login
            </button>
            <button
              onClick={redirectToRegister}
              className="rounded-md bg-cyan-400 px-8 py-3 font-serif text-gray-800 transition-colors hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              Register
            </button>
          </div>
    </div>

        </div>
      </main>
    </div>
  );
}
