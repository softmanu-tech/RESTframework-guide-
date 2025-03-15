
import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
  editable?: boolean;
  onCodeChange?: (code: string) => void;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ 
  code, 
  language = 'python', 
  filename,
  className,
  editable = false,
  onCodeChange
}) => {
  const [copied, setCopied] = useState(false);
  const [codeValue, setCodeValue] = useState(code);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCodeValue(e.target.value);
    if (onCodeChange) {
      onCodeChange(e.target.value);
    }
  };

  return (
    <div className={cn("code-block border rounded-md overflow-hidden", className)}>
      {filename && (
        <div className="code-header bg-gray-100 px-3 py-1 text-xs border-b flex justify-between items-center">
          <span>{filename}</span>
          <span className="text-gray-400">{language}</span>
        </div>
      )}
      <div className="relative">
        <Button 
          variant="ghost" 
          size="sm" 
          className="absolute right-2 top-2 h-8 w-8 p-0"
          onClick={handleCopy}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          <span className="sr-only">Copy code</span>
        </Button>
        {editable ? (
          <Textarea
            value={codeValue}
            onChange={handleCodeChange}
            className="font-mono text-sm min-h-[200px] resize-y p-4 border-0 focus-visible:ring-0 rounded-none"
          />
        ) : (
          <pre className="code-content p-4 overflow-auto">
            <code className={`language-${language}`}>{codeValue}</code>
          </pre>
        )}
      </div>
    </div>
  );
};

export default CodeBlock;
