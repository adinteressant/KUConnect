import useConversation from '../../zustand/useConversation.js'
import MessageHeader from './MessageHeader.jsx'
import Messages from './Messages.jsx'
import NoChatSelected from './NoChatSelected.jsx'
import SendMessage from './SendMessage.jsx'

export default function MessageContainer() {
  const { selectedConversation } = useConversation();

  return (
    <div className="p-4 ml-64 h-screen flex flex-col">
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          <MessageHeader username={selectedConversation.username} />
          <div className="flex-1 overflow-y-auto">
            <Messages />
          </div>
          <div className="flex-shrink-0 mb-9">
            <SendMessage />
          </div>
        </>
      )}
    </div>
  );
}
