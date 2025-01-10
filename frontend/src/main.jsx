import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'
import LoginPage from './components/LoginPage.jsx'
import RegisterPage from './components/RegisterPage.jsx'
import HomePage from './components/HomePage.jsx'
import MessagePage from './components/MessagePage.jsx'
import FriendsPage from './components/FriendsPage.jsx'
import NotificationPage from './components/NotificationPage.jsx'
import CustomizeMyProfile from './components/CustomizeMyProfile.jsx'
import VerifyOtp from './components/VerifyOtpPage.jsx'
import SetInfoGoogle from './components/SetInfoGoogle.jsx'
import ProfilePage from './components/ProfilePage.jsx'
import ResultPage from './components/ResultPage.jsx'
import SearchPage from './components/SearchPage.jsx'
import SearchResults from './components/SearchResults.jsx'
import VideoCall from './components/VideoCall.jsx'
import PushNotification from './components/pushNotifications.jsx'
import LandingPage from './components/LandingPage.jsx'
 
const router = createBrowserRouter([
  {
    path : '/',
    element : <App/>,
    children:[
      {
        path:'/',
        element: <LandingPage/>
      },
      {
        path:'/home',
        element: <HomePage/>
      },
      {
        path:'/login',
        element: <LoginPage/>
      },
      {
        path:'/register',
        element: <RegisterPage/>
      },
      {
        path:'/messages',
        element: <MessagePage/>
      },
      {
        path:'/friends',
        element:<FriendsPage/>
      },
      {
        path:'/notifications',
        element:<NotificationPage/>
      },
      {
        path:'/customizemyprofile',
        element:<CustomizeMyProfile/>
      },
      {
        path:'/verifyotp',
        element:<VerifyOtp/>
      },
      {
        path:'/set-google-profile',
        element:<SetInfoGoogle/>
      },
      {
        path:'/:username',
        element:<ProfilePage/>
      },
      {
        path:'/results',
        element:<ResultPage/>,
      },
      {
        path:'/search',
        element:<SearchPage/>
      },
      {
        path:'/push-notifications',
        element:<PushNotification/>
      }
    ]
  },
  {
      path:'/call',
      element:<VideoCall/>,
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <RouterProvider router={router} />
  </StrictMode>
);
