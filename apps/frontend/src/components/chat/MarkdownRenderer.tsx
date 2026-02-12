import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownRendererProps {
    content: string;
}

/**
 * Renders markdown content with syntax highlighting for code blocks
 */
const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                // Custom code block rendering with syntax highlighting
                code({ node, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    const inline = props.inline;
                    return !inline && match ? (
                        <SyntaxHighlighter
                            style={vscDarkPlus as any}
                            language={match[1]}
                            PreTag="div"
                            customStyle={{
                                margin: '0.5rem 0',
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem',
                            } as any}
                            {...props}
                        >
                            {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                    ) : (
                        <code
                            className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono"
                            {...props}
                        >
                            {children}
                        </code>
                    );
                },
                // Style links to open in new tab
                a({ node, children, href, ...props }) {
                    return (
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                            {...props}
                        >
                            {children}
                        </a>
                    );
                },
                // Style lists
                ul({ node, children, ...props }) {
                    return (
                        <ul className="list-disc list-inside space-y-1 my-2" {...props}>
                            {children}
                        </ul>
                    );
                },
                ol({ node, children, ...props }) {
                    return (
                        <ol className="list-decimal list-inside space-y-1 my-2" {...props}>
                            {children}
                        </ol>
                    );
                },
                // Style headings
                h1({ node, children, ...props }) {
                    return (
                        <h1 className="text-xl font-bold mt-4 mb-2" {...props}>
                            {children}
                        </h1>
                    );
                },
                h2({ node, children, ...props }) {
                    return (
                        <h2 className="text-lg font-bold mt-3 mb-2" {...props}>
                            {children}
                        </h2>
                    );
                },
                h3({ node, children, ...props }) {
                    return (
                        <h3 className="text-base font-bold mt-2 mb-1" {...props}>
                            {children}
                        </h3>
                    );
                },
                // Style blockquotes
                blockquote({ node, children, ...props }) {
                    return (
                        <blockquote
                            className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-2"
                            {...props}
                        >
                            {children}
                        </blockquote>
                    );
                },
                // Style paragraphs
                p({ node, children, ...props }) {
                    return (
                        <p className="mb-2 last:mb-0" {...props}>
                            {children}
                        </p>
                    );
                },
            }}
        >
            {content}
        </ReactMarkdown>
    );
};

export default MarkdownRenderer;
