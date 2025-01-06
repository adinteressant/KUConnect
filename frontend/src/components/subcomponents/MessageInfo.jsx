export default function MessageInfo({isVisible}){
  return <div className={`flex flex-col border bg-slate-50 rounded-md border-gray-200 
    ${isVisible?`absolute z-50`:`hidden`}
  `}>
    <div className="border-b border-gray-200 p-2">messageinfo</div>
    <div className="p-2">messageinfo2</div>
  </div>
}