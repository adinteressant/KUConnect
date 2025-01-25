export const sortArray = (enhancedConversations) => {
  for(let i=0;i<enhancedConversations.length;i++){
    for(let j=i+1;j<enhancedConversations.length;j++){
      if(enhancedConversations[i].latestMessageDate < enhancedConversations[j].latestMessageDate){
          let temp = enhancedConversations[i];
          enhancedConversations[i] = enhancedConversations[j];
          enhancedConversations[j] = temp;
      }
    }
  }
}