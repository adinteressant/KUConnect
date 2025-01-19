export default function PostSkeleton()
{
    return(
        // Post
        <div
            className = 'max-w-2xl mx-auto bg-white dark:bg-slate-800 dark:shadow-black dark:text-slate-200 p-4 rounded-lg shadow-md mt-4'
        >
            {/* Post Contents */}
            <div className='animate-pulse mb-[25%]'>
                {/* info of who posted */}
                <div className='flex gap-2 dark:text-slate-200 items-evenly mb-8'>
                    {/* profile pic */}
                    <div className='h-9 w-9 rounded-full bg-gray-200 dark:bg-slate-900'>
                    </div>
                    {/* userinfo */}
                    <div className='flex flex-col justify-between'>
                        <div className='h-4 w-28 rounded-lg bg-gray-200 dark:bg-slate-900'>
                        </div>
                        <div className='h-3 w-16 rounded-lg bg-gray-200 dark:bg-slate-900'>
                        </div>
                    </div>
                </div>
                {/* Content */}
                <div className='h-4 w-[100%] rounded-lg bg-gray-200 dark:bg-slate-900 mb-2'>
                </div>
                <div className='h-4 w-[100%] rounded-lg bg-gray-200 dark:bg-slate-900 mb-2'>
                </div>
                <div className='h-4 w-[50%] rounded-lg bg-gray-200 dark:bg-slate-900 mb-4'>
                </div>
                {/* tags */}
                <div className='h-3 w-[25%] rounded-lg bg-gray-200 dark:bg-slate-900'>
                </div>
            </div>
        </div>
    )
}