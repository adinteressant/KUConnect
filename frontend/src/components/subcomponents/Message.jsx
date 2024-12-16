export default function Message() {
  return <div className="overflow-auto">
  <div className="flex flex-col space-y-4 w-full"> 
  <div className="flex items-start justify-start space-x-4">
    <div className="bg-gray-200 text-gray-900 p-3 rounded-lg max-w-xs">
      Hello! How can I help you today?
    </div>
  </div>
 
  <div className="flex items-end justify-end space-x-4">
    <div className="bg-cyan-500 text-white p-3 rounded-lg max-w-xs">
      I need assistance with my account. this thing is not working
    </div>
  </div>  
  </div>
  </div>
 }