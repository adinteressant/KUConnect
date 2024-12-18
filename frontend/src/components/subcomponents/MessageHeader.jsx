export default function MessageHeader({username}) {
  return <div className="px-1 mb-3 flex gap-1">
      <div>
        <img src="images/light.svg" alt="" className="inline "/>
      </div>
      <div>
        {username}
      </div>
    
  </div>
}
