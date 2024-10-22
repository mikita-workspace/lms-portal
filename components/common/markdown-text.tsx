'use client';

import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import remarkGfm from 'remark-gfm';

import { cn } from '@/lib/utils';

type MarkdownTextProps = {
  className?: string;
  text?: string | null;
};

export const MarkdownText = ({ className, text }: MarkdownTextProps) => {
  return (
    <div
      className={cn(
        'text-sm prose dark:prose-invert prose-a:text-accent-primary prose-a:no-underline hover:prose-a:underline prose-pre:bg-transparent',
        className,
      )}
    >
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
