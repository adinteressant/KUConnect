import { useState, useEffect } from 'react';
import axios from 'axios';

const myprofile = () => {
  const [userprofile, setuserprofile] = useState({});
  const [showprofilepicoverlay, setshowprofilepicoverlay] = useState(false);
  const [showpasswordmodal, setshowpasswordmodal] = useState(false);
  const [passwordform, setpasswordform] = useState({
    currentpassword: '',
    newpassword: '',
    confirmpassword: ''
  });
  const [usertags, setusertags] = useState([]);
  const [tagInput, setTagInput] = useState(''); // Add state for tag input

  // sample profile pictures (you can replace with your own array)
  const profilepictures = [
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
        setuserprofile(response.data);
        setusertags(response.data.tags || []); // Initialize tags from user profile
      } catch (error) {
        console.error('error fetching user profile:', error);
      }
    })();
  }, []);

  const handlepasswordchange = async (e) => {
    e.preventDefault();
    if (passwordform.newpassword !== passwordform.confirmpassword) {
      alert("passwords don't match");
      return;
    }

    try {
      await axios.post('/api/change-password', {
        currentPassword: passwordform.currentpassword,
        newPassword: passwordform.newpassword,
        user_id: userprofile.user_id
      }, { withCredentials: true });

      alert('password changed successfully');
      setshowpasswordmodal(false);
      setpasswordform({
        currentpassword: '',
        newpassword: '',
        confirmpassword: ''
      });
    } catch (error) {
      console.error('error changing password:', error);
      alert('failed to change password');
    }
  };

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

  const handleTagInput = (e) => {
    if (e.key === ' ' && tagInput.trim() !== '') {
      handleTagSubmit();
    }
  };

  const handleTagSubmit = async () => {
    if (tagInput.trim() !== '') {
      const newTag = tagInput.trim();
      const updatedTags = [...usertags, newTag];
      setusertags(updatedTags);
      setTagInput('');

    }
  };

  async function handleTagSubmitButtom(){
      try {
        await axios.post('/api/update-tags', {tags: usertags,user_id:userprofile.user_id}, { withCredentials: true });
      } catch (error) {
        console.error('Error updating tags:', error);
        alert('Failed to update tags');
      }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        {/* profile picture with hover effect */}
        <div
          className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-300
                     flex items-center justify-center mx-auto
                     relative group cursor-pointer"
          onClick={() => setshowprofilepicoverlay(true)}
        >
          {userprofile.pfp_id ? (
            <img
              src={`/api/get-pfp?id=${userprofile.pfp_id}`}
              alt="profile"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-gray-500">add photo</span>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-50
                          rounded-full flex items-center justify-center
                          opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white">change picture</span>
          </div>
        </div>

        {/* profile picture overlay */}
        {showprofilepicoverlay && (
          <div className="fixed inset-0 bg-black bg-opacity-50
                          flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg">
              <h2 className="text-2xl mb-4">choose profile picture</h2>
              <div className="grid grid-cols-3 gap-4">
                {profilepictures.map((pic, index) => (
                  <img
                    key={index}
                    src={`/api/get-pfp?id=${pic}`}
                    alt={`profile option ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-full cursor-pointer
                               hover:scale-105 transition-transform"
                    onClick={() => handleprofilepicselect(pic)}
                  />
                ))}
              </div>
              <button
                className="mt-4 w-full bg-gray-200 py-2 rounded"
                onClick={() => setshowprofilepicoverlay(false)}
              >
                cancel
              </button>
            </div>
          </div>
        )}

        {/* rest of the previous profile content */}
        <div className="text-center mt-4">
          <h1 className="text-4xl font-serif font-bold text-gray-800">
            {userprofile.username || userprofile.email?.split('@')[0]}
          </h1>
          {/* ... other profile details ... */}
          <div className="mt-6">
            <h2 className="text-2xl mb-4">Add Tags</h2>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInput}
                className="flex-grow p-2 border rounded"
                placeholder="Type a tag and press space"
              />
              <button
                onClick={handleTagSubmitButtom}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Submit Tags
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {usertags.map((tag, index) => (
                <span key={index} className="bg-gray-200 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* change password button */}
        <div className="mt-6 text-center">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => setshowpasswordmodal(true)}
          >
            change password
          </button>
        </div>

        {/* password change modal */}
        {showpasswordmodal && (
          <div className="fixed inset-0 bg-black bg-opacity-50
                          flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h2 className="text-2xl mb-4">change password</h2>
              <form onSubmit={handlepasswordchange}>
                <input
                  type="password"
                  placeholder="current password"
                  className="w-full mb-3 p-2 border rounded"
                  value={passwordform.currentpassword}
                  onChange={(e) => setpasswordform(prev => ({
                    ...prev,
                    currentpassword: e.target.value
                  }))}
                  required
                />
                <input
                  type="password"
                  placeholder="new password"
                  className="w-full mb-3 p-2 border rounded"
                  value={passwordform.newpassword}
                  onChange={(e) => setpasswordform(prev => ({
                    ...prev,
                    newpassword: e.target.value
                  }))}
                  required
                />
                <input
                  type="password"
                  placeholder="confirm new password"
                  className="w-full mb-3 p-2 border rounded"
                  value={passwordform.confirmpassword}
                  onChange={(e) => setpasswordform(prev => ({
                    ...prev,
                    confirmpassword: e.target.value
                  }))}
                  required
                />
                <div className="flex justify-between">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    change password
                  </button>
                  <button
                    type="button"
                    className="bg-gray-200 px-4 py-2 rounded"
                    onClick={() => setshowpasswordmodal(false)}
                  >
                    cancel
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

export default myprofile;

