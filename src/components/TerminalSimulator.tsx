
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface Command {
  command: string;
  output: string;
}

interface TerminalSimulatorProps {
  className?: string;
  initialCommands?: Command[];
  onCommandExecuted?: (command: string) => void;
}

const TerminalSimulator: React.FC<TerminalSimulatorProps> = ({
  className,
  initialCommands = [],
  onCommandExecuted
}) => {
  const [history, setHistory] = useState<Command[]>(initialCommands);
  const [currentCommand, setCurrentCommand] = useState("");
  const [promptPrefix, setPromptPrefix] = useState("(drf_env) user@machine:~/drf_tutorial$ ");
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const predefinedResponses: Record<string, string> = {
    "pip install django": "Collecting django\n  Downloading Django-4.2.7-py3-none-any.whl (8.0 MB)\nInstalling collected packages: django\nSuccessfully installed django-4.2.7",
    "pip install djangorestframework": "Collecting djangorestframework\n  Downloading djangorestframework-3.14.0-py3-none-any.whl (991 kB)\nInstalling collected packages: djangorestframework\nSuccessfully installed djangorestframework-3.14.0",
    "django-admin startproject drf_tutorial": "Project 'drf_tutorial' created successfully",
    "cd drf_tutorial": "Changed directory to drf_tutorial",
    "python manage.py startapp api": "App 'api' created successfully",
    "python manage.py migrate": "Operations to perform:\n  Apply all migrations: admin, auth, contenttypes, sessions\nRunning migrations:\n  Applying contenttypes.0001_initial... OK\n  Applying auth.0001_initial... OK\n  Applying admin.0001_initial... OK\n  Applying admin.0002_logentry_remove_auto_add... OK\n  Applying admin.0003_logentry_add_action_flag_choices... OK\n  Applying contenttypes.0002_remove_content_type_name... OK\n  Applying auth.0002_alter_permission_name_max_length... OK\n  Applying auth.0003_alter_user_email_max_length... OK\n  Applying auth.0004_alter_user_username_opts... OK\n  Applying auth.0005_alter_user_last_login_null... OK\n  Applying sessions.0001_initial... OK",
    "python manage.py runserver": "Watching for file changes with StatReloader\nPerforming system checks...\n\nSystem check identified no issues (0 silenced).\nNovember 22, 2023 - 15:15:33\nDjango version 4.2.7, using settings 'drf_tutorial.settings'\nStarting development server at http://127.0.0.1:8000/\nQuit the server with CONTROL-C.",
    "git init": "Initialized empty Git repository in ~/drf_tutorial/.git/",
    "git add .": "Added files to staging area",
    "git commit -m \"Initial commit\"": "Created initial commit with message: \"Initial commit\"",
    "git remote add origin https://github.com/username/drf_tutorial.git": "Added remote origin",
    "git push -u origin main": "Counting objects: 35, done.\nDelta compression using up to 8 threads.\nCompressing objects: 100% (32/32), done.\nWriting objects: 100% (35/35), 4.28 KiB | 4.28 MiB/s, done.\nTotal 35 (delta 2), reused 0 (delta 0)\nTo https://github.com/username/drf_tutorial.git\n * [new branch]      main -> main\nBranch 'main' set up to track remote branch 'main' from 'origin'.",
    "help": "Available commands:\n- pip install django\n- pip install djangorestframework\n- django-admin startproject drf_tutorial\n- cd drf_tutorial\n- python manage.py startapp api\n- python manage.py migrate\n- python manage.py runserver\n- git init\n- git add .\n- git commit -m \"Initial commit\"\n- git remote add origin https://github.com/username/drf_tutorial.git\n- git push -u origin main\n- clear (clears terminal)\n- help (shows this help message)"
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentCommand.trim()) return;
    
    const response = predefinedResponses[currentCommand.trim()] || "Command not recognized. Type 'help' for available commands.";
    
    const newCommand: Command = {
      command: currentCommand,
      output: response
    };
    
    setHistory([...history, newCommand]);
    setCurrentCommand("");
    
    if (currentCommand === "clear") {
      setHistory([]);
    }
    
    if (onCommandExecuted) {
      onCommandExecuted(currentCommand);
    }
  };

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div 
      className={cn("bg-black text-green-400 font-mono p-3 overflow-auto", className)} 
      onClick={focusInput}
      ref={terminalRef}
    >
      {history.map((item, index) => (
        <div key={index} className="mb-2">
          {item.command !== "clear" && (
            <>
              <div className="flex">
                <span className="text-yellow-400">{promptPrefix}</span>
                <span>{item.command}</span>
              </div>
              <div className="whitespace-pre-wrap text-sm">{item.output}</div>
            </>
          )}
        </div>
      ))}
      
      <form onSubmit={executeCommand} className="flex">
        <span className="text-yellow-400">{promptPrefix}</span>
        <input
          ref={inputRef}
          type="text"
          value={currentCommand}
          onChange={(e) => setCurrentCommand(e.target.value)}
          className="flex-1 bg-transparent outline-none text-green-400"
          autoFocus
        />
      </form>
    </div>
  );
};

export default TerminalSimulator;
