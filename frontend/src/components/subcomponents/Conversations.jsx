export default function Conversations(){

  const users = ['adolf','hitler','benito','mussolini']

  return <div className="flex flex-col gap-4 mt-5">

    {
      users.map((user,index)=>(
        <div key={index} className="hover:bg-slate-500 cursor-pointer">
          <button>
            {user}
          </button>
        </div>
      ))
    }
  </div>
}