import { React, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function ShowLikes(props) {
    const [likes, setLikes] = useState([])
    const [category, setCategory] = useState('all')
    const [student, setStudent] = useState(0)
    const [faculty, setFaculty] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(() => true)
        fetch(`/api/posts/${props.postId}/get-likes`)
        .then(response => response.json())
        .then(data => {
            setLikes(() => data.likeArray)
            let s=0,f=0
            data.likeArray.forEach((like) => {
                if(like.role === 'student')
                {
                    s++
                }
                if(like.role === 'faculty')
                {
                    f++
                }
            })
            setStudent(() => s)
            setFaculty(() => f)
            setLoading(() => false)
        })
        .catch((error) =>
        {
            console.error('Error getting likes: ', error)
        })
    }, [])

    return(
        <div className = 'flex flex-col w-[100%] h-[100%]'>
            {loading?
            (<div className='flex flex-col w-[100%] h-[100%]'>
                <div className='p-2 flex gap-2'>
                    {[1,2,3].map((_,index) => (
                        <button key={index} className={`pl-7 pr-7 pt-4 pb-4 rounded-2xl bg-gray-200 animate-pulse`}>
                        </button>
                    ))}
                </div>
                <hr/>
                <div className='p-2 overflow-hidden flex flex-col gap-6 w-[100%] h-[100%]'>
                    {[1,2,3,4].map((_,index) => (<div key={index} className='flex'>
                        <div className='mt-2 shrink-0 w-8 h-8 rounded-full object-cover bg-gray-200 animate-pulse'>
                        </div>
                        <div className='ml-2 bg-gray-200 w-[40%] h-[120%] rounded-xl animate-pulse object-cover'>
                        </div>
                    </div>))}
                </div>
            </div>):
            (<div className='flex flex-col w-[100%] h-[100%]'>
                <div className='p-2 flex gap-2'>
                    <button onClick={() => setCategory(() => 'all')} className={`p-2 rounded hover:bg-gray-100 transition-bg duration-300 ${category==='all'?'bg-gray-200':'bg-none'}`}>
                    All({student+faculty})
                    </button>
                    <button onClick={() => setCategory(() => 'student')} className={`p-2 rounded hover:bg-gray-100 transition-all duration-300 ${category==='student'?'bg-gray-200':'bg-none'}`}>
                    Students({student})
                    </button>
                    <button onClick={() => setCategory(() => 'faculty')} className={`p-2 rounded hover:bg-gray-100 transition-all duration-300 ${category==='faculty'?'bg-gray-200':'bg-none'}`}>
                    Faculty({faculty})
                    </button>
                </div>
                <hr/>
                <div className='p-2 overflow-y-auto flex flex-col gap-2 w-[100%] h-[100%]'>
                    {likes.map((like, index) => {
                        if(like.role === 'student')
                        {
                            if(category === 'faculty')
                            {
                                return;
                            }
                        }
                        if(like.role === 'faculty')
                        {  
                            if(category === 'student')
                            {
                                return;
                            }
                        }
                        return (
                            <div key={index} className='flex'>
                                <Link onClick={() => {
                                                        document.body.classList.toggle('overflow-hidden', false)
                                                        props.closeLikeOverlay()
                                                    }}
                                         className='mt-2 shrink-0' to={`/${like.username}`}>
                                        <img src={`/api/get-pfp?id=${like.pfp_id}`} alt="profile" className="w-8 h-8 rounded-full object-cover"/>
                                </Link>
                                <div className='ml-2'>
                                    <Link onClick={() => {
                                                        document.body.classList.toggle('overflow-hidden', false)
                                                        props.closeLikeOverlay()
                                                    }} 
                                        to={`/${like.username}`}  className='text-gray-800 font-semibold text-sm'>
                                        {like.username}
                                    </Link>
                                    <div className='text-gray-600 text-xs'>
                                        {like.role.charAt(0).toUpperCase() + like.role.slice(1)}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    {((category === 'faculty' && faculty === 0) || (category === 'student' && student === 0)) && <div className="leading-none m-auto text-gray-600">No likes</div>}
                </div>
            </div>)}
        </div>
    );    
}

export default ShowLikes