import { useState, useEffect } from 'react';
import axios from 'axios';

const MyProfile = () => {
  const [userProfile, setUserProfile] = useState({});
  const [showProfilePicOverlay, setShowProfilePicOverlay] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Sample profile pictures (you can replace with your own array)
  const profilePictures = [
    1,
    2,
    3,
    4,
    5,
  ];

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get('/api/get-user-profile/', {
          withCredentials: true
        });
        if (!response.data) return;
        setUserProfile(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    })();
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    try {
      await axios.post('/api/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      }, { withCredentials: true });
      
      alert('Password changed successfully');
      setShowPasswordModal(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password');
    }
  };

  const handleProfilePicSelect = async (picUrl) => {
    try {
      await axios.post('/api/update-profile-pic', 
        { profilePicUrl: picUrl }, 
        { withCredentials: true }
      );
      setUserProfile(prev => ({ ...prev, profilePic: picUrl }));
      setShowProfilePicOverlay(false);
    } catch (error) {
      console.error('Error updating profile picture:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        {/* Profile Picture with Hover Effect */}
        <div 
          className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-300 
                     flex items-center justify-center mx-auto 
                     relative group cursor-pointer"
          onClick={() => setShowProfilePicOverlay(true)}
        >
          {userProfile.profilePic ? (
            <img 
              src={userProfile.profilePic} 
              alt="Profile" 
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-gray-500">Add Photo</span>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-50 
                          rounded-full flex items-center justify-center 
                          opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white">Change Picture</span>
          </div>
        </div>

        {/* Profile Picture Overlay */}
        {showProfilePicOverlay && (
          <div className="fixed inset-0 bg-black bg-opacity-50 
                          flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg">
              <h2 className="text-2xl mb-4">Choose Profile Picture</h2>
              <div className="grid grid-cols-3 gap-4">
                {profilePictures.map((pic, index) => (
                  <img 
                    key={index} 
                    src={`/api/get-pfp/${pic}`} 
                    alt={`Profile option ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-full cursor-pointer 
                               hover:scale-105 transition-transform"
                    onClick={() => handleProfilePicSelect(pic)}
                  />
                ))}
              </div>
              <button 
                className="mt-4 w-full bg-gray-200 py-2 rounded"
                onClick={() => setShowProfilePicOverlay(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Rest of the previous profile content */}
        <div className="text-center mt-4">
          <h1 className="text-4xl font-serif font-bold text-gray-800">
            {userProfile.username || userProfile.email?.split('@')[0]}
          </h1>
          {/* ... other profile details ... */}
        </div>

        {/* Change Password Button */}
        <div className="mt-6 text-center">
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => setShowPasswordModal(true)}
          >
            Change Password
          </button>
        </div>

        {/* Password Change Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 
                          flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h2 className="text-2xl mb-4">Change Password</h2>
              <form onSubmit={handlePasswordChange}>
                <input 
                  type="password" 
                  placeholder="Current Password"
                  className="w-full mb-3 p-2 border rounded"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({
                    ...prev, 
                    currentPassword: e.target.value
                  }))}
                  required
                />
                <input 
                  type="password" 
                  placeholder="New Password"
                  className="w-full mb-3 p-2 border rounded"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({
                    ...prev, 
                    newPassword: e.target.value
                  }))}
                  required
                />
                <input 
                  type="password" 
                  placeholder="Confirm New Password"
                  className="w-full mb-3 p-2 border rounded"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({
                    ...prev, 
                    confirmPassword: e.target.value
                  }))}
                  required
                />
                <div className="flex justify-between">
                  <button 
                    type="submit" 
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Change Password
                  </button>
                  <button 
                    type="button"
                    className="bg-gray-200 px-4 py-2 rounded"
                    onClick={() => setShowPasswordModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
