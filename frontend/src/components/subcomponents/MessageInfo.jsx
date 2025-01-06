export default function MessageInfo({isVisible}){
  return <div className={`flex flex-col border bg-white rounded-md border-gray-200 
    ${isVisible?`absolute z-50`:`hidden`}
  `}>
    <div className="border-b border-gray-200 p-2 hover:bg-gray-200 cursor-pointer">
      messageinfo
    </div>
    <div className="p-2 hover:bg-gray-200 cursor-pointer">messageinfo2</div>
  </div>
}