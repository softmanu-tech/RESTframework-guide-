
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { FileCode, FolderOpen, GitBranch, Play, Terminal as TerminalIcon, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import CodeBlock from './CodeBlock';
import TerminalSimulator from './TerminalSimulator';
import { useToast } from '@/hooks/use-toast';

interface VSCodeSimulatorProps {
  className?: string;
  initialFiles?: {
    name: string;
    content: string;
    language: string;
  }[];
  onComplete?: () => void;
}

const VSCodeSimulator: React.FC<VSCodeSimulatorProps> = ({
  className,
  initialFiles = [],
  onComplete
}) => {
  const [files, setFiles] = useState(initialFiles);
  const [activeFile, setActiveFile] = useState(initialFiles[0]?.name || '');
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const { toast } = useToast();

  const createNewFile = (name: string, content: string = '', language: string = 'python') => {
    const newFile = { name, content, language };
    setFiles([...files, newFile]);
    setActiveFile(name);
    
    toast({
      title: "File Created",
      description: `Created new file: ${name}`,
    });
  };

  const handleRunCode = () => {
    toast({
      title: "Running Code",
      description: "Simulating code execution in VS Code",
    });
    
    // In a real app, this would connect to a backend service
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 1500);
  };

  return (
    <div className={cn("border rounded-md overflow-hidden bg-[#1e1e1e] text-white shadow-xl", className)}>
      {/* VS Code Header */}
      <div className="bg-[#333333] px-4 py-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FileCode size={16} />
          <span className="text-sm">Django REST Framework - VS Code</span>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0 text-gray-400 hover:text-white"
            onClick={handleRunCode}
          >
            <Play size={14} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0 text-gray-400 hover:text-white"
            onClick={() => setIsTerminalOpen(!isTerminalOpen)}
          >
            <TerminalIcon size={14} />
          </Button>
        </div>
      </div>
      
      {/* Sidebar and Editor */}
      <div className="flex h-[400px]">
        {/* Explorer Sidebar */}
        <div className="w-48 bg-[#252526] border-r border-gray-800">
          <div className="p-2 text-xs text-gray-400 font-medium">EXPLORER</div>
          <div className="p-2">
            <div className="flex items-center gap-1 text-xs text-gray-300 mb-2">
              <FolderOpen size={14} />
              <span>drf_tutorial</span>
            </div>
            
            {files.map((file) => (
              <div 
                key={file.name}
                className={cn(
                  "flex items-center gap-1 text-xs py-1 px-2 cursor-pointer rounded",
                  activeFile === file.name ? "bg-[#37373d]" : "hover:bg-[#2a2d2e]"
                )}
                onClick={() => setActiveFile(file.name)}
              >
                <FileCode size={14} />
                <span>{file.name}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-4 px-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-xs h-7 bg-[#252526] border-gray-700 hover:bg-[#37373d]"
              onClick={() => createNewFile(`new_file_${files.length + 1}.py`)}
            >
              New File
            </Button>
          </div>
          
          <div className="mt-2 px-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-xs h-7 flex items-center gap-1 bg-[#252526] border-gray-700 hover:bg-[#37373d]"
            >
              <GitBranch size={12} />
              <span>Clone from GitHub</span>
            </Button>
          </div>
        </div>
        
        {/* Editor Area */}
        <div className="flex-1 overflow-auto">
          <Tabs defaultValue="editor" className="w-full h-full">
            <TabsList className="bg-[#252526] border-b border-gray-800 rounded-none w-full justify-start h-9">
              <TabsTrigger value="editor" className="text-xs h-8 data-[state=active]:bg-[#1e1e1e]">Editor</TabsTrigger>
              <TabsTrigger value="preview" className="text-xs h-8 data-[state=active]:bg-[#1e1e1e]">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="editor" className="p-0 h-full">
              {activeFile ? (
                <div className="p-4 h-full">
                  <div className="text-xs text-gray-400 mb-2">{activeFile}</div>
                  {files.find(f => f.name === activeFile)?.content ? (
                    <CodeBlock 
                      code={files.find(f => f.name === activeFile)?.content || ''}
                      language={files.find(f => f.name === activeFile)?.language || 'python'}
                      filename={activeFile}
                      className="h-full bg-[#1e1e1e] border-none"
                    />
                  ) : (
                    <div className="text-gray-500 text-sm">
                      # Start coding here
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No file selected
                </div>
              )}
            </TabsContent>
            <TabsContent value="preview" className="p-4 h-full">
              <div className="bg-white text-black rounded p-4 h-full overflow-auto">
                <div className="text-sm font-medium mb-2">Preview</div>
                <p className="text-sm text-gray-700">This would show a live preview of your Django REST Framework API.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Terminal */}
      {isTerminalOpen && (
        <div className="border-t border-gray-800 h-[200px]">
          <div className="bg-[#333333] px-3 py-1 flex justify-between items-center">
            <div className="text-xs">TERMINAL</div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 text-gray-400 hover:text-white"
              onClick={() => setIsTerminalOpen(false)}
            >
              <X size={12} />
            </Button>
          </div>
          <TerminalSimulator 
            className="h-[165px] bg-[#1e1e1e]" 
            initialCommands={[
              { command: "python -m venv drf_env", output: "Creating virtual environment..." },
              { command: "source drf_env/bin/activate", output: "(drf_env) user@machine:~/drf_tutorial$" }
            ]}
          />
        </div>
      )}
    </div>
  );
};

export default VSCodeSimulator;
