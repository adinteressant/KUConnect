import { getMonthAndDate } from '../../utils/timeConversion.js'
import useGetMessage from '../hooks/useGetMessage.js';
import useListenMessage from '../hooks/useListenMessage.js';
import Message from './Message.jsx';
import MessagesSketeleton from './MessagesSkeleton.jsx'

export default function Messages() {
  const { loading, messages } = useGetMessage()
  useListenMessage()
  let MM='', DD=''

  return (
    <div className="space-y-4 dark:bg-slate-900 dark:text-slate-100 flex flex-col">
      {loading ? (
        <MessagesSketeleton/>
      ) : messages.length > 0 ? (
        messages.map((message) => {
          let replyMessage
          messages.forEach((msg)=>{
            if(message?.replyOf==msg._id){
              replyMessage = msg
              return
            }
          })
          const {mm,dd} = getMonthAndDate(message.createdAt)
          const prevDD = DD
          const prevMM = MM

          DD = dd
          MM = mm
          return(
          <Message key={message._id} message={message} replyMessage={replyMessage}
          dd={dd} mm={mm} prevDD={prevDD} prevMM={prevMM}/>
        )})
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          Start a conversation
        </div>
      )}
    </div>
  );
}
