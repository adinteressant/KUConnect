import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useLocation } from "react-router-dom"

export default function SplashScreen({ setLoad }) {
    
    const navigate = useNavigate()
    const  location = useLocation()

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
        
        setTimeout(() => {
            setLoad(() => false)
            if(location.pathname==='/')
            {
                isAuthenticated?navigate(`/home`):navigate('/login')
                return
            }
            navigate(`${location.pathname}`)
            return
        }, 1500)
    } ,[])

    return (
        <div className='flex flex-col justify-center items-center min-h-screen'>
            <img className='max-h-28 object-contain' src='../public/logo/KUConnectTab.png'></img>
        </div>
    )
}