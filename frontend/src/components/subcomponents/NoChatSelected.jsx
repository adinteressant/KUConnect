export default function NoChatSelected(){
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h3 className="text-xl font-medium text-gray-900 mb-2">
          Welcome to Messages
        </h3>
        <p className="text-gray-500">
          Select a conversation to start messaging
        </p>
      </div>
    </div>
  );
}