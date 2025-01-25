import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useLocation,useSearchParams } from "react-router-dom"

export default function SplashScreen({ setLoad }) {
    
    const navigate = useNavigate()
    const  location = useLocation()
    const [query] = useSearchParams()
    const email = query.get('email')

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
        
        setTimeout(() => {
            setLoad(() => false)
            if(location.pathname==='/')
            {
                isAuthenticated?navigate(`/home`):navigate('/login')
                return
            }
            if(email){
                navigate(`${location.pathname}?email=${email}`)
                return
            }
            if(isAuthenticated && 
                (location.pathname==='/login' ||location.pathname==='/register')){
                    navigate('/home')
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