
"use client";

// This component is no longer used as its functionality has been integrated
// into the right panel of the main page (src/app/page.tsx).
// It can be safely deleted if desired.

import type { FC } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FileCode, FileJson, FileText } from "lucide-react"; 

export type FileType = "html" | "css" | "js";

interface FileExplorerProps {
  activeFile: FileType;
  onSelectFile: (file: FileType) => void;
}

const fileItems: { type: FileType; name: string; icon: React.ElementType }[] = [
  { type: "html", name: "index.html", icon: FileCode },
  { type: "css", name: "style.css", icon: FileText },
  { type: "js", name: "script.js", icon: FileJson },
];

const FileExplorer: FC<FileExplorerProps> = ({ activeFile, onSelectFile }) => {
  return (
    <div className="bg-card border-r border-border p-4 flex flex-col gap-2 min-w-[200px] h-full shadow-sm">
      <h2 className="text-lg font-semibold mb-2 text-foreground">Files</h2>
      {fileItems.map((file) => (
        <Button
          key={file.type}
          variant={activeFile === file.type ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start text-sm",
            activeFile === file.type
              ? "bg-primary/10 text-primary hover:bg-primary/20"
              : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
          )}
          onClick={() => onSelectFile(file.type)}
        >
          <file.icon className="mr-2 h-4 w-4" />
          {file.name}
        </Button>
      ))}
    </div>
  );
};

export default FileExplorer;
