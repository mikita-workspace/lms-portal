'use client';

import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import remarkGfm from 'remark-gfm';

type MarkdownTextProps = {
  text?: string | null;
};

export const MarkdownText = ({ text }: MarkdownTextProps) => {
  return (
    <div className="text-sm prose dark:prose-invert prose-a:text-accent-primary prose-a:no-underline hover:prose-a:underline prose-pre:bg-transparent">
      <Markdown
        remarkPlugins={[remarkGfm]}
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
        {text}
      </Markdown>
    </div>
  );
};
