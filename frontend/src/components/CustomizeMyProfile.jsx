import { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import { EyeIcon, EyeOffIcon } from "lucide-react";
import tags from '../data/tags.js'

const CustomizeMyProfile = () => {
  const [userprofile, setuserprofile] = useState({});
  const [showprofilepicoverlay, setshowprofilepicoverlay] = useState(false);
  const [showpasswordmodal, setshowpasswordmodal] = useState(false);
  const [passwordform, setpasswordform] = useState({
    currentpassword: '',
    newpassword: '',
    confirmpassword: ''
  });
  const [selectedTags, setSelectedTags] = useState([]);
  const [passwordVisibility, setPasswordVisibility] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Predefined array of tags
  const availableTags = tags

  // sample profile pictures (you can replace with your own array)
  const profilepictures = [1, 2, 3, 4, 5];

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get('/api/get-user-profile/', {
          withCredentials: true
        });
        if (!response.data) return;
        setuserprofile(response.data);
        setSelectedTags(response.data.tags || []); // Initialize selected tags from user profile
      } catch (error) {
        console.error('error fetching user profile:', error);
      }
    })();
  }, []);

  const handleprofilepicselect = async (p) => {
    try {
      await axios.post(`/api/update-pfp?id=${p}`,
        {
          user_id: userprofile.user_id,
        },
        { withCredentials: true },
      );
      setuserprofile(prev => ({ ...prev, pfp_id: p }));
      setshowprofilepicoverlay(false);
    } catch (error) {
      console.error('error updating profile picture:', error);
    }
  };

  const handleTagToggle = (tag) => {
    setSelectedTags(prevTags => 
      prevTags.includes(tag)
        ? prevTags.filter(t => t !== tag)
        : [...prevTags, tag]
    );
  };

  const handleTagSubmit = async () => {
    try {
      await axios.post('/api/update-tags', { tags: selectedTags, user_id: userprofile.user_id }, { withCredentials: true });
      alert('Tags updated successfully');
    } catch (error) {
      console.error('Error updating tags:', error);
      alert('Failed to update tags');
    }
  };

  return (
    <div className="flex items-center justify-center max-h-screen dark:bg-slate-900  bg-gray-100 p-4 overflow-y-auto scrollbar">
      <div className="w-full max-w-md p-6 bg-white dark:bg-slate-800 border dark:border-slate-950 rounded-lg shadow-lg">
        {/* Profile picture section */}
        <div className="relative w-32 h-32 mx-auto mb-6 md:w-40 md:h-40">
          <div 
            className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center overflow-hidden cursor-pointer"
            onClick={() => setshowprofilepicoverlay(true)}
          >
            {userprofile.pfp_id ? (
              <img
                src={`/api/get-pfp?id=${userprofile.pfp_id}`}
                alt="profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-500">add photo</span>
            )}
          </div>
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
            onClick={() => setshowprofilepicoverlay(true)}
          >
            <span className="text-white text-sm">change picture</span>
          </div>
        </div>

        {/* Profile picture overlay */}
        {showprofilepicoverlay && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setshowprofilepicoverlay(false)}
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl mb-4 font-semibold">Choose Profile Picture</h2>
              <div className="grid grid-cols-3 gap-4">
                {profilepictures.map((pic, index) => (
                  <img
                    key={index}
                    src={`/api/get-pfp?id=${pic}`}
                    alt={`profile option ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-full cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => handleprofilepicselect(pic)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Profile content */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2 md:text-3xl lg:text-4xl">
            {userprofile.username || userprofile.email?.split('@')[0]}
          </h1>
          
          {/* Tag selection section */}
          <div className="mt-6">
            <h2 className="text-xl mb-4 font-semibold dark:text-gray-400 md:text-2xl">Select Tags</h2>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-cyan-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            <button 
              onClick={handleTagSubmit}
              className="w-full bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600 transition-colors"
            >
              Update Tags
            </button>
          </div>
        </div>

        {/* Change password button */}
        {/* <div className="text-center">
          <button
            className="w-full bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600 transition-colors"
            onClick={() => setshowpasswordmodal(true)}
          >
            Change Password
          </button>
        </div> */}

        {/* Password change modal */}
        {showpasswordmodal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4 relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setshowpasswordmodal(false)}
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl mb-4 font-semibold">Change Password</h2>
              <form onSubmit={handlepasswordchange}>
              <div className="w-full space-y-2">
              <div className="relative">
                <input
                  type={passwordVisibility.current ? "text" : "password"}
                  placeholder="Current password"
                  className="w-full mb-3 p-2 border rounded"
                  value={passwordform.currentpassword}
                  onChange={(e) => setpasswordform(prev => ({
                    ...prev,
                    currentpassword: e.target.value
                  }))}
                  required
                />
                <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {passwordVisibility.current ? <EyeOffIcon className="w-5 h-5" /> :
                <EyeIcon className="w-5 h-5" />}
              </button>
              </div>
              </div>
              <div className="w-full space-y-2">
              <div className="relative">
                <input
                  type={passwordVisibility.new ? "text" : "password"}
                  placeholder="New password"
                  className="w-full mb-3 p-2 border rounded"
                  value={passwordform.newpassword}
                  onChange={(e) => setpasswordform(prev => ({
                    ...prev,
                    newpassword: e.target.value
                  }))}
                  required
                />
                <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {passwordVisibility.new ? <EyeOffIcon className="w-5 h-5" /> :
                <EyeIcon className="w-5 h-5" />}
              </button>
              </div>
              </div>
              <div className="w-full space-y-2">
              <div className="relative">
                <input
                  type={passwordVisibility.confirm? "text" : "password"}
                  placeholder="Confirm new password"
                  className="w-full mb-3 p-2 border rounded"
                  value={passwordform.confirmpassword}
                  onChange={(e) => setpasswordform(prev => ({
                    ...prev,
                    confirmpassword: e.target.value
                  }))}
                  required
                />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {passwordVisibility.confirm ? <EyeOffIcon className="w-5 h-5" /> :
                <EyeIcon className="w-5 h-5" />}
              </button>
              </div>
              </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                  >
                    Change Password
                  </button>
                  <button
                    type="button"
                    className="w-full sm:w-auto bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
                    onClick={() => setshowpasswordmodal(false)}
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

export default CustomizeMyProfile;

