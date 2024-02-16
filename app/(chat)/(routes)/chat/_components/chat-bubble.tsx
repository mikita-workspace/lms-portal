'use client';

import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import { ChatCompletionRole } from '@/constants/open-ai';
import { getFallbackName } from '@/lib/utils';

type ChatBubbleProps = {
  message: { role: string; content: string };
  name: string;
  picture?: string | null;
  streamMessage?: string;
};

export const ChatBubble = ({ message, name, picture, streamMessage }: ChatBubbleProps) => {
  const isAssistant = message.role === ChatCompletionRole.ASSISTANT;

  return (
    <div className="pb-4 pt-2">
      <div className="flex gap-x-4">
        <div>
          <Avatar>
            {!isAssistant && picture && <AvatarImage src={picture} />}
            {isAssistant && (
              <AvatarImage
                className="bg-white p-1.5 border rounded-full"
                src="/assets/openai.svg"
              />
            )}
            <AvatarFallback>{getFallbackName(name)}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col">
          <div className="space-x-2">
            <span className="text-medium font-bold">{name}</span>
          </div>
          <p className="text-sm prose dark:prose-invert prose-a:text-accent-primary prose-a:no-underline hover:prose-a:underline prose-pre:bg-transparent">
            <Markdown
              components={{
                code({ inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');

                  return !inline && match ? (
                    <SyntaxHighlighter
                      {...props}
                      PreTag="div"
                      language={match[1]}
                      style={atomDark}
                      wrapLongLines
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code {...props} className={className || ''}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {streamMessage || message.content}
            </Markdown>
          </p>
        </div>
      </div>
    </div>
  );
};
