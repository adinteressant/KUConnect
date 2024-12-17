import { useEffect,useState } from 'react'
import { useParams } from 'react-router-dom'

export default function ProfilePage() {
  const { username } = useParams();
  const [profileData, setProfileData] = useState({
    pfp_id: null,
    role: '',
  });
  
  useEffect(() => {
    fetch(`/api/get-profile?username=${username}`)
      .then((response) => response.json())
      .then((data) => setProfileData(data))
      .catch((e) => {
        console.log(e);
      });
  }, [username]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        {/* Profile picture with hover effect */}
        <div
          className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-300
                     flex items-center justify-center mx-auto
                     relative group cursor-pointer"
        >
          {profileData.pfp_id ? (
            <img
              src={`/api/get-pfp?id=${profileData.pfp_id}`}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-gray-500">No Profile Picture</span>
          )}
        </div>
        
        {/* Rest of the profile content */}
        <div className="text-center mt-4">
          <h1 className="text-3xl font-serif font-bold text-gray-800">
            {username}
          </h1>
          <h2 className="text-2xl font-serif font-semibold">Role: {profileData.role}</h2>
          {/* Other profile details */}
        </div>
      </div>
    </div>
  );
}
