export default function ProfileSkeleton()
{
    return(
        <div className="max-w-2xl mx-auto bg-white border dark:border-slate-700 dark:bg-slate-800 space-y-4 p-8 rounded-lg shadow-md">
          {/* Profile picture skeleton */}
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-200 dark:bg-slate-900 animate-pulse" />
  
          {/* Profile content skeleton */}
          <div className="text-center mt-4 flex flex-col items-start space-y-4">
            {/* Username skeleton */}
            <div className="w-48 h-8 bg-gray-200 mb-8 dark:bg-slate-900 rounded-lg animate-pulse" />
            
          <div className="flex justify-between w-full">  
          <div className="flex flex-col gap-2">
            {/* role and joinend date skeletons */}
            <div className="w-20 h-4 bg-gray-200 dark:bg-slate-900 rounded-lg animate-pulse" />
           
            <div className="w-40 h-4 bg-gray-200 dark:bg-slate-900 rounded-lg animate-pulse" />
            
            </div>
            {/*additional button*/}
            <div className="w-32 h-10 bg-gray-200 dark:bg-slate-900 rounded-full animate-pulse " />
           </div>     
      </div>
        </div>
    )
}
