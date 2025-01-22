export default function ConversationsSkeleton(){
  return <div className="flex flex-col mt-1 animate-pulse">
      <div
        className={` mb-2 hover:rounded-md flex justify-between
           px-3 border-gray-200 dark:border-slate-700 border-b text-gray-800`
          }
      >
      <div className="flex items-center gap-4 p-2 w-full ">   
          <div className="rounded-full object-cover bg-gray-200 dark:bg-slate-700 h-10 w-14"></div>
          
          <div className="flex items-center justify-between w-full bg-gray-200 dark:bg-slate-700 rounded-lg h-4">
          </div>
        </div>
      </div>
      <div
        className={` mb-2 hover:rounded-md flex justify-between
           px-3 border-gray-200 dark:border-slate-700 border-b text-gray-800`
          }
      >
    <div className="flex items-center gap-4 p-2 w-full ">   
          <div className="rounded-full object-cover bg-gray-200 dark:bg-slate-700 h-10 w-14"></div>
          
          <div className="flex items-center justify-between w-full bg-gray-200 dark:bg-slate-700 rounded-lg h-4">
          </div>
        </div>
      </div>
      <div
        className={` mb-2 hover:rounded-md flex justify-between
           px-3 border-gray-200 dark:border-slate-700 border-b text-gray-800`
          }
      >
    <div className="flex items-center gap-4 p-2 w-full ">   
          <div className="rounded-full object-cover dark:bg-slate-700 bg-gray-200 h-10 w-14"></div>
          
          <div className="flex items-center justify-between w-full bg-gray-200 dark:bg-slate-700 rounded-lg h-4">
          </div>
        </div>
      </div>
      <div
        className={` mb-2 hover:rounded-md flex justify-between
           px-3 border-gray-200 dark:border-slate-700 border-b text-gray-800`
          }
      >
    <div className="flex items-center gap-4 p-2 w-full ">   
          <div className="rounded-full object-cover dark:bg-slate-700 bg-gray-200 h-10 w-14"></div>
          
          <div className="flex items-center justify-between w-full dark:bg-slate-700 bg-gray-200 rounded-lg h-4">
          </div>
        </div>
      </div>
</div>
}