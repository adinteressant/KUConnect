import React, { useState, useEffect, useCallback } from 'react';
import { Lock, Settings, ChevronRight, X, EyeIcon, EyeOffIcon } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from './context/themeContext';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

const SliderToggle = React.memo(({ selected, setSelected, toggleTheme, isLoading }) => {
  const handleThemeToggle = useCallback(() => {
    const newTheme = selected === "dark" ? "light" : "dark";
    setSelected(newTheme);
    toggleTheme();
  }, [selected, setSelected, toggleTheme]);

  return (
    <div className="relative flex items-center">
      <button
        onClick={handleThemeToggle}
        className="relative w-16 h-8 rounded-full bg-slate-200 dark:bg-slate-700 transition-colors duration-300"
        aria-label="Toggle theme"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            className="absolute top-1 left-1 w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center"
            initial={{ x: selected === "dark" ? "0rem" : "2rem" }}
            animate={{ x: selected === "dark" ? "2rem" : "0rem" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              duration: isLoading ? 0 : undefined
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selected}
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 180, opacity: 0 }}
                transition={{ duration: isLoading ? 0 : 0.2 }}
              >
                {selected === "dark" ? (
                  <FiMoon className="w-4 h-4 text-white" />
                ) : (
                  <FiSun className="w-4 h-4 text-white" />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </button>
    </div>
  );
});

export default function SettingsPage(user) {
    const {userProfile, setUserProfile} = useOutletContext()
  const [activeSection, setActiveSection] = useState('general');
  const { theme, toggleTheme } = useTheme();
  const [selected, setSelected] = useState(theme || 'light');
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Form states
  const [username, setUsername] = useState('');
  const [passwordform, setpasswordform] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordVisibility, setPasswordVisibility] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    setSelected(theme);
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, [theme]);

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    try{
        await axios.post('/api/change',
            {
                username: username,
                user_id: userProfile.user_id,
                type: 'username'
            },
            { withCredentials: true}
        )
        alert ('Username changed successfully');
        setIsUsernameModalOpen(false);
        setUsername('');
        setUserProfile((prev) => ({
            ...prev,
            username: username,
          }));
    }
    catch (error) {
        console.error('error changing username:', error);
        alert('failed to change username');
      }
  };

  const handlepasswordchange = async (e) => {
    e.preventDefault();
    if (passwordform.newpassword !== passwordform.confirmpassword) {
      alert("passwords don't match");
      return;
    }

    try {
      await axios.post('/api/change', {
        currentPassword: passwordform.currentPassword,
        newPassword: passwordform.newPassword,
        user_id: userProfile.user_id,
        type: "password"
      }, { withCredentials: true });

      alert('password changed successfully');
      setIsPasswordModalOpen(false);
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

  const handleDeleteAccount = (e) => {
    e.preventDefault();
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="flex h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-white transition-colors duration-300">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-slate-800 shadow-md transition-colors duration-300">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-semibold">Settings</h1>
        </div>
        <nav className="p-2">
          <div 
            className={`flex items-center p-3 mt-1 rounded-lg cursor-pointer transition-colors duration-300 ${
              activeSection === 'general' 
                ? 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => setActiveSection('general')}
          >
            <Settings className="w-5 h-5 mr-3" />
            <span>General</span>
          </div>
          <div 
            className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-300 ${
              activeSection === 'security' 
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => setActiveSection('security')}
          >
            <Lock className="w-5 h-5 mr-3" />
            <span className="font-medium">Security</span>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {activeSection === 'security' && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Security</h2>
            
            <div 
              className="bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg shadow-sm p-4 mb-4 cursor-pointer transition-colors duration-300"
              onClick={() => setIsPasswordModalOpen(true)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Change Password</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Update your password to keep your account secure
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              </div>
            </div>

            <div 
              className="bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg shadow-sm p-4 cursor-pointer transition-colors duration-300"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-red-600 dark:text-red-400">Delete Account</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Permanently remove your account and all associated data
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              </div>
            </div>
          </div>
        )}

        {activeSection === 'general' && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">General</h2>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg shadow-sm p-4 transition-colors duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Dark Mode</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Switch between light and dark themes
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <SliderToggle
                      selected={selected}
                      setSelected={setSelected}
                      toggleTheme={toggleTheme}
                      isLoading={isLoading}
                    />
                  </div>
                </div>
              </div>

              <div 
                className="bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg shadow-sm p-4 cursor-pointer transition-colors duration-300"
                onClick={() => setIsUsernameModalOpen(true)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Change Username</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Update your username
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal
        isOpen={isUsernameModalOpen}
        onClose={() => setIsUsernameModalOpen(false)}
        title="Change Username"
      >
        <form onSubmit={handleUsernameSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">New Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsUsernameModalOpen(false)}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Change Password"
      >
        <form onSubmit={handlepasswordchange}>
          <div className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium mb-2">Current Password</label>
              <input
                type={passwordVisibility.current ? "text" : "password"}
                value={passwordform.currentPassword}
                onChange={(e) => setpasswordform(prev => ({
                  ...prev,
                  currentPassword: e.target.value
                }))}
                className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 bottom-3 text-gray-400 hover:text-gray-600"
              >
                {passwordVisibility.current ? 
                  <EyeOffIcon className="w-5 h-5" /> : 
                  <EyeIcon className="w-5 h-5" />
                }
              </button>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium mb-2">New Password</label>
              <input
                type={passwordVisibility.new ? "text" : "password"}
                value={passwordform.newPassword}
                onChange={(e) => setpasswordform(prev => ({
                  ...prev,
                  newPassword: e.target.value
                }))}
                className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 bottom-3 text-gray-400 hover:text-gray-600"
              >
                {passwordVisibility.new ? 
                  <EyeOffIcon className="w-5 h-5" /> : 
                  <EyeIcon className="w-5 h-5" />
                }
              </button>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium mb-2">Confirm New Password</label>
              <input
                type={passwordVisibility.confirm ? "text" : "password"}
                value={passwordform.confirmPassword}
                onChange={(e) => setpasswordform(prev => ({
                  ...prev,
                  confirmPassword: e.target.value
                }))}
                className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 bottom-3 text-gray-400 hover:text-gray-600"
              >
                {passwordVisibility.confirm ? 
                  <EyeOffIcon className="w-5 h-5" /> : 
                  <EyeIcon className="w-5 h-5" />
                }
              </button>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={() => {
                setIsPasswordModalOpen(false);
                setpasswordform({
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: ''
                });
                setPasswordVisibility({
                  current: false,
                  new: false,
                  confirm: false
                });
              }}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Update Password
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Account"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Are you sure you want to delete your account? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAccount}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete Account
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}