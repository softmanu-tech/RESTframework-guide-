
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Play, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface CodeEditorProps {
  initialCode: string;
  expectedOutput: string;
  challenge: string;
  onSuccess?: () => void;
  className?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode,
  expectedOutput,
  challenge,
  onSuccess,
  className
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  const runCode = () => {
    setIsRunning(true);
    setError(null);
    setOutput(null);
    
    // Simulate code execution - in a real app, this would send code to a backend
    setTimeout(() => {
      try {
        // This is a simplified validation that would normally happen on a backend
        // For demo purposes, we're just checking if the code includes certain patterns
        const mockValidation = validateCode(code);
        
        if (mockValidation.isValid) {
          setOutput(mockValidation.output);
          setIsSuccess(mockValidation.output === expectedOutput);
          
          if (mockValidation.output === expectedOutput) {
            toast({
              title: "Success!",
              description: "Your code produced the expected output!",
              duration: 3000,
            });
            if (onSuccess) onSuccess();
          } else {
            toast({
              title: "Almost there!",
              description: "Your code runs but doesn't produce the expected output.",
              duration: 3000,
            });
          }
        } else {
          setError(mockValidation.error);
          toast({
            title: "Code Error",
            description: mockValidation.error,
            variant: "destructive",
            duration: 3000,
          });
        }
      } catch (err) {
        setError("An unexpected error occurred while running your code.");
      } finally {
        setIsRunning(false);
      }
    }, 1000);
  };

  const resetCode = () => {
    setCode(initialCode);
    setOutput(null);
    setError(null);
    setIsSuccess(false);
  };

  // This is a mock validation function that would be replaced by actual code execution
  const validateCode = (code: string) => {
    // For demo purposes, we're just checking if code contains certain patterns
    if (!code.trim()) {
      return { isValid: false, error: "Code cannot be empty" };
    }
    
    // Look for syntax errors (simplified for demo)
    if (code.includes('import') && !code.includes('from')) {
      return { isValid: false, error: "Syntax error: 'import' statement requires 'from'" };
    }
    
    if ((code.match(/\(/g) || []).length !== (code.match(/\)/g) || []).length) {
      return { isValid: false, error: "Syntax error: Unmatched parentheses" };
    }
    
    // Generate mock output based on the code content (simplified for demo)
    let output = ""; 
    
    if (code.includes('Response') && code.includes('serializer.data')) {
      output = expectedOutput; // If code contains key elements, return the expected output
    } else {
      output = "{ \"detail\": \"Partial results\" }"; // Otherwise return partial results
    }
    
    return { isValid: true, output };
  };

  return (
    <div className={cn("bg-white rounded-lg shadow-md overflow-hidden", className)}>
      <div className="border-b bg-gray-50 px-4 py-2 flex justify-between items-center">
        <h3 className="text-sm font-medium">Interactive Code Editor</h3>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={resetCode}
            className="h-7 text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Reset
          </Button>
          <Button 
            onClick={runCode} 
            size="sm" 
            disabled={isRunning}
            className="h-7 text-xs"
          >
            <Play className="h-3 w-3 mr-1" />
            Run
          </Button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="border rounded-md mb-4">
          <p className="bg-gray-100 text-xs px-3 py-1 border-b">Challenge:</p>
          <p className="p-3 text-sm">{challenge}</p>
        </div>
        
        <div className="mb-4">
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="font-mono text-sm h-[200px] resize-y"
            placeholder="Write your code here..."
          />
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {output && (
          <div className="mb-4">
            <div className="bg-gray-100 px-3 py-1 text-xs border-t border-x rounded-t-md flex justify-between items-center">
              <span>Output:</span>
              {isSuccess && <CheckCircle className="h-4 w-4 text-green-500" />}
            </div>
            <pre className={cn(
              "p-3 border border-gray-200 rounded-b-md text-sm font-mono overflow-auto max-h-[150px]",
              isSuccess ? "bg-green-50" : "bg-white"
            )}>
              {output}
            </pre>
          </div>
        )}
        
        <div className="mt-4 text-xs text-gray-500">
          <p>Note: This is a demonstration environment. In a real application, your code would be executed on a backend server.</p>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
