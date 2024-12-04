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
import MyProfile from './components/MyProfile.jsx'

const router = createBrowserRouter([
  {
    path : '/',
    element : <App/>,
    children:[
      {
        path:'/',
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
        path:'/myprofile',
        element:<MyProfile/>
      }
      
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router = {router}/>
  </StrictMode>,
)
