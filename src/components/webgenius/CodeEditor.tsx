
"use client";

import type { FC } from "react";
import { Textarea } from "@/components/ui/textarea";
// import type { FileType } from "./FileExplorer"; // FileType is now defined in page.tsx or similar
export type CodeLanguageType = "html" | "css" | "js";


interface CodeEditorProps {
  content: string;
  activeFile: CodeLanguageType; // Changed from FileType if that was specific to FileExplorer
  onChange: (newContent: string) => void;
  isGenerating: boolean;
}

const CodeEditor: FC<CodeEditorProps> = ({
  content,
  activeFile,
  onChange,
  isGenerating,
}) => {
  const getLanguageLabel = (fileType: CodeLanguageType) => {
    switch (fileType) {
      case "html":
        return "HTML";
      case "css":
        return "CSS";
      case "js":
        return "JavaScript";
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-b-lg overflow-hidden">
      {/* The header/title for the editor is now part of page.tsx's right panel card header */}
      {/*
      <div className="p-3 border-b border-border bg-muted/50">
        <h3 className="text-sm font-medium text-foreground">
          Editing: <span className="font-semibold text-primary">{getLanguageLabel(activeFile)}</span>
        </h3>
      </div>
      */}
      <Textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`// ${getLanguageLabel(activeFile)} code will appear here...`}
        className="flex-grow font-mono text-sm p-4 border-0 rounded-none focus-visible:ring-0 resize-none h-full bg-background"
        disabled={isGenerating}
        aria-label={`Code editor for ${getLanguageLabel(activeFile)}`}
      />
    </div>
  );
};

export default CodeEditor;
