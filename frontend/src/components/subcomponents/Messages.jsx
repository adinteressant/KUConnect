import useGetMessage from '../hooks/useGetMessage.js';
import useListenMessage from '../hooks/useListenMessage.js';
import Message from './Message.jsx';
import { Loader2 } from 'lucide-react';

export default function Messages() {
  const { loading, messages } = useGetMessage()
  useListenMessage()

  return (
    <div className="space-y-4 dark:bg-slate-900 dark:text-slate-100">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
        </div>
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
