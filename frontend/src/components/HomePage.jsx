
const HomePage = () => {
  return (
      <div className="flex-1 flex flex-col">
        {/* Content Feed */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-2xl mx-auto space-y-4">
            {/* Post Creation Area */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <textarea 
                placeholder="What's on your mind?" 
                className="w-full p-2 border rounded-lg mb-4 bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600"
              />
              <button className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:ring-offset-2">
                Post
              </button>
            </div>

            {/* Example Post */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <img 
                  src="/api/placeholder/40/40" 
                  alt="User" 
                  className="rounded-full w-10 h-10 mr-3"
                />
                <div>
                  <h3 className="font-serif">John Doe</h3>
                  <p className="text-gray-500 text-sm">2 hours ago</p>
                </div>
              </div>
              <p>Just had an amazing day exploring the city!</p>
            </div>
          </div>
        </main>
      </div>
   
  );
};

export default HomePage;
