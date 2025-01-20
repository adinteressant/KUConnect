import { useEffect, useRef } from 'react';
import useConversation from '../../zustand/useConversation.js';
import MessageHeader from './MessageHeader.jsx';
import Messages from './Messages.jsx';
import NoChatSelected from './NoChatSelected.jsx';
import SendMessage from './SendMessage.jsx';

export default function MessageContainer() {
  const { selectedConversation } = useConversation();

  // Ref to scroll to the latest message
  // const messagesEndRef = useRef(null);

  // Scroll to the bottom when messages change
  // useEffect(() => {
  //   if (messagesEndRef.current) {
  //     messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  //   }
  // }, [selectedConversation]);

  return (
    <div className="flex-1 flex flex-col">
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          {/* Fixed Header */}
          <div className="w-full bg-white dark:bg-slate-900">
            <MessageHeader username={selectedConversation.username} />
          </div>

          {/* Scrollable Messages Section */}
          <div className="flex-1 overflow-y-auto dark:bg-slate-900 dark:text-slate-100 bg-gray-50 pt-16 border-l border-gray-200 dark:border-slate-800 flex flex-col-reverse">
            <div className="mt-auto p-4 space-y-4 dark:bg-slate-900">
              <Messages />
              {/* Empty div for scrolling to the bottom */}
              {/* <div ref={messagesEndRef}></div> */}
            </div>
          </div>

          {/* Fixed SendMessage */}
          <div className="w-full bg-white border-t dark:border-slate-800 border-gray-200">
            <SendMessage />
          </div>
        </>
      )}
    </div>
  );
}
