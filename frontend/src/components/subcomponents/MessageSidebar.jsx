import Conversations from './Conversations.jsx'

export default function MessageSidebar(){
  return <div className="border border-cyan-600 h-screen p-3 fixed bottom-0 top-14">
    
    <div className="flex gap-2">
      <input placeholder="Search"/>
      <button type="Submit" className="border border-cyan-400 hover:bg-slate-400">
        Search
      </button>
    </div>

    <Conversations/>

  </div>
}