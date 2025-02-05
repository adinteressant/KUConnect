import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useLocation,useSearchParams } from "react-router-dom"
import { KUConnectSvg } from "../../public/logo/KUConnectSvg"
import useAuthenticatedState from "../zustand/useAuthenticatedState"

export default function SplashScreen({ setLoad }) {
    
    const navigate = useNavigate()
    const  location = useLocation()
    const [query] = useSearchParams()
    const email = query.get('email')

    const {isAuthenticated, setIsAuthenticated} = useAuthenticatedState();
    useEffect(() => {
        
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
        }, 3000)
    } ,[])

    return (
        <div className='flex flex-col justify-center items-center min-h-screen max-h-screen'>
            <KUConnectSvg/>
        </div>
    )
}