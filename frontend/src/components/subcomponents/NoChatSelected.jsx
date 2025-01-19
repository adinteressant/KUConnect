export default function NoChatSelected(){
  return (
    <div className="flex items-center justify-center h-full dark:bg-slate-900 bg-gray-50 text-gray-500">
      <div className="text-center">
        <h3 className="text-2xl font-medium dark:text-slate-100 text-gray-900 mb-2">
          Welcome to Messages
        </h3>
        <p className="text-gray-500 dark:text-slate-300 mt-2 text-sm">
          Select a conversation to start messaging
        </p>
      </div>
    </div>
  );
}