import useGetMessage from '../hooks/useGetMessage.js';
import useListenMessage from '../hooks/useListenMessage.js';
import Message from './Message.jsx';
import MessagesSketeleton from './MessagesSkeleton.jsx'

export default function Messages() {
  const { loading, messages } = useGetMessage()
  useListenMessage()

  return (
    <div className="space-y-4 dark:bg-slate-900 dark:text-slate-100 flex flex-col">
      {loading ? (
        <MessagesSketeleton/>
      ) : messages.length > 0 ? (
        messages.map((message) => (
          <Message key={message._id} message={message} />
        ))
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          Start a conversation
        </div>
      )}
    </div>
  );
}
