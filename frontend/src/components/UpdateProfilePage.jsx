export default function UpdateProfilePage(){

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('update')
  }

  return <div>
    <form className="flex flex-col gap-2 m-6" onSubmit={handleSubmit}>
      <input type="text" placeholder="Username" required/>
      <input type="password" placeholder="Password" required/>
      <input type="text" placeholder="Role" required/>
      <button type="submit" className="border border-cyan-400 hover:bg-slate-300">
        Update
      </button>
    </form>
  </div>
}