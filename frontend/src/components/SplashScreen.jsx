import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useLocation,useSearchParams } from "react-router-dom"
import { KUConnectSvg } from "../../public/logo/KUConnectSvg"

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
            navigate(`${location.pathname}`)
            return
        }, 1500)
    } ,[])

    return (
        <div className='flex flex-col justify-center items-center min-h-screen'>
            <div className='min-w-32'>
                <KUConnectSvg/>
            </div>
        </div>
    )
}