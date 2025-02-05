import YouTubeEmbed from './YouTubeEmbed';
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import ReactMarkdown from 'react-markdown';
import React from 'react';

function PostContent({props,post}){

  const URL_REGEX = /(((https?:\/\/)|(www\.))[^\s]+)/g;
return(
  <>
          <ReactMarkdown
                    components={{
                      p: ({ node, children }) => {
                        return <>{children}</>
                      },
                      a: ({ node, ...props }) => {

                          //Shriharsh's code commented
                          const youtubeMatch = props.href.match(URL_REGEX);

                          //const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/;
                          //const youtubeMatch = props.href.match(youtubeRegex);
                          const isLastYouTubeLink = youtubeMatch && post.content.includes(props.href) &&
                          props.href === post.content.split(/\s+/).reverse().find((link) => URL_REGEX.test(link));
                          
                          if (youtubeMatch) {
                            return (
                              <>
                                <a 
                                  target='_blank' 
                                  className='text-blue-400' 
                                  {...props}
                                >
                                  {props.children}
                                </a> 
                                {post.images===null && isLastYouTubeLink && <YouTubeEmbed videoUrl={props.href} /> }
                              </>
                            );
                          }
                          
                          return (
                            <a
                              target='_blank' 
                              className='text-blue-400' 
                              {...props}
                            />
                          );
                        }
                      }}
                      rehypePlugins={[rehypeRaw]}
                      remarkPlugins={[remarkGfm]}
                    >
                      {post.content}
                    </ReactMarkdown>
                    </>
)
}
export default React.memo(PostContent)
