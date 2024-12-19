import { React, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import formatTimeAgo from "../../utils/generateTimeAgo.js"

function ShowComments(props) {

    const [comments, setComments] = useState([])
    const [category, setCategory] = useState('all')
    const [student, setStudent] = useState(0)
    const [faculty, setFaculty] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(() => true)
        fetch(`/api/posts/${props.postId}/get-comments`)
        .then(response => response.json())
        .then(data => {
            setComments(() => data.commentArray)
            let s=0,f=0
            data.commentArray.forEach((comment) => {
                if(comment.role === 'student')
                {
                    s++
                }
                if(comment.role === 'faculty')
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
            console.error('Error getting comments: ', error)
        })
    }, [])

    return(
        <div className = 'flex flex-col w-[100%] h-[100%]'>
            {loading?
            (<div className='flex flex-col w-[100%] h-[100%]'>
                <div className='p-2 flex gap-2'>
                    {[1,2,3].map(() => (
                        <button className={`pl-8 pr-8 pt-4 pb-4 rounded-2xl bg-gray-200 animate-pulse`}>
                        </button>
                    ))}
                </div>
                <hr/>
                <div className='p-4 overflow-hidden flex flex-col gap-8 w-[100%] h-[100%]'>
                    {[1,2,3,4].map(() => (<div className='flex'>
                        <div className='mt-2 shrink-0 w-8 h-8 rounded-full object-cover bg-gray-200 animate-pulse'>
                        </div>
                        <div className='ml-2 bg-gray-200 w-[50%] h-[120%] rounded-xl animate-pulse object-cover'>
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
                <div className='p-4 overflow-y-auto flex flex-col gap-4 w-[100%] h-[100%]'>
                    {comments.map((comment, index) => {
                    if(comment.role === 'student')
                        {
                            
                            if(category === 'faculty')
                            {
                                return;
                            }
                        }
                    if(comment.role === 'faculty')
                    {
                            
                            if(category === 'student')
                            {
                                return;
                            }
                    }
                    return (
                            <div key={index} className='flex'>
                                <Link className='mt-2 shrink-0' to={`/${comment.username}`}>
                                        <img src={`/api/get-pfp?id=${comment.pfp}`} alt="profile" className="w-8 h-8 rounded-full object-cover"/>
                                </Link>
                                <div className='ml-2'>
                                    <div className='flex'>
                                        <div className='bg-gray-100 p-2 rounded-xl'>
                                            <div className='flex gap-2 items-center'>
                                                <Link to={`/${comment.username}`} className='text-gray-800 font-semibold text-sm'>
                                                    {comment.username}
                                                </Link>
                                                <div className='text-gray-600 text-xs'>
                                                    {comment.role.charAt(0).toUpperCase() + comment.role.slice(1)}
                                                </div>
                                            </div>
                                            <div className='text-gray-800 break-all whitespace-normal'>
                                                {comment.comment}
                                            </div>
                                        </div>
                                        <div className='ml-2 flex flex-col justify-evenly'>
                                            <button className='group'>
                                                <svg width='18' height='18' viewBox='0 0 24 24'
                                                    className= {`transition-all duration-300 ${false
                                                    ? 'stroke-cyan-600 fill-cyan-600 group-hover:fill-cyan-700 group-hover:stroke-cyan-700'
                                                    : 'stroke-gray-600 fill-none group-hover:stroke-cyan-600'}`}
                                                    xmlns='http://www.w3.org/2000/svg'
                                                >
                                                    <path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/>
                                                </svg>
                                            </button>
                                            <button className='group'>
                                                <svg width='18' height='18' viewBox='0 0 24 24'
                                                className = {`transition-all duration-300 fill-none
                                                        ${false
                                                        ? 'stroke-cyan-600 group-hover:stroke-cyan-700'
                                                        : 'stroke-gray-600 group-hover:stroke-cyan-600'
                                                        }`}
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-4 ml-2 text-gray-600 text-xs'>
                                        <div>
                                            {formatTimeAgo(comment.created)} ago
                                        </div>
                                        <div>Likes: 0</div>
                                        <div>Replies: 0</div>
                                    </div>
                                </div>
                            </div>
                    )
                    })}
                    {((category === 'faculty' && faculty === 0) || (category === 'student' && student === 0)) && <div className="leading-none m-auto text-gray-600">No comments</div>}
                </div>
            </div>)}
        </div>
    );
}

export default ShowComments