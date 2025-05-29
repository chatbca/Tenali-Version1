"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/webgenius/Header";
import FileExplorer, { type FileType } from "@/components/webgenius/FileExplorer";
import CodeEditor from "@/components/webgenius/CodeEditor";
import LivePreview from "@/components/webgenius/LivePreview";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { exportCodeAsZip, type GeneratedCode } from "@/lib/exportUtils";
import { generateCodeFromPrompt, type GenerateCodeFromPromptOutput } from "@/ai/flows/generate-code-from-prompt";
import { identifyIntent, type IdentifyIntentOutput } from "@/ai/flows/identify-intent-from-prompt";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const initialCode: GeneratedCode = {
  html: "<h1>Welcome to WebGenius!</h1>\n<p>Enter a prompt above and click Generate.</p>",
  css: "body {\n  font-family: sans-serif;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n  text-align: center;\n  background-color: #f0f0f0;\n}\nh1 {\n color: #333;\n}",
  js: "// console.log('Hello from WebGenius!');",
};

export default function WebGeniusPage() {
  const [prompt, setPrompt] = useState<string>("");
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode>(initialCode);
  const [activeFile, setActiveFile] = useState<FileType>("html");
  const [editorContent, setEditorContent] = useState<string>(initialCode.html);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [intentResult, setIntentResult] = useState<IdentifyIntentOutput | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    setEditorContent(generatedCode[activeFile]);
  }, [activeFile, generatedCode]);

  const handleEditorChange = (newContent: string) => {
    setEditorContent(newContent);
    setGeneratedCode((prevCode) => ({
      ...prevCode,
      [activeFile]: newContent,
    }));
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt is empty",
        description: "Please enter a description for your website.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setIntentResult(null); // Reset previous intent result

    try {
      // Step 1: Identify Intent (optional, for display or future prompt enhancement)
      try {
        const intentOutput = await identifyIntent({ prompt });
        setIntentResult(intentOutput);
      } catch (intentError) {
        console.warn("Could not identify intent:", intentError);
        // Continue with generation even if intent identification fails
      }
      
      // Step 2: Generate Code
      const output: GenerateCodeFromPromptOutput = await generateCodeFromPrompt({ prompt });
      setGeneratedCode({
        html: output.html || "",
        css: output.css || "",
        js: output.js || "",
      });
      // Switch to HTML view after generation by default
      setActiveFile("html"); 
      setEditorContent(output.html || "");

      toast({
        title: "Website Generated!",
        description: "Your code has been generated and is live in the preview.",
      });
    } catch (error) {
      console.error("Error generating code:", error);
      toast({
        title: "Generation Failed",
        description: (error as Error).message || "An unknown error occurred during code generation.",
        variant: "destructive",
      });
      // Optionally revert to placeholder or last successful code
      // setGeneratedCode(initialCode); 
      // setEditorContent(initialCode.html);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = () => {
    if (!generatedCode.html && !generatedCode.css && !generatedCode.js) {
      toast({
        title: "Nothing to Export",
        description: "Generate some code first before exporting.",
        variant: "destructive",
      });
      return;
    }
    exportCodeAsZip(generatedCode);
  };

  const handleSelectFile = useCallback((fileType: FileType) => {
    setActiveFile(fileType);
  }, []);


  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header onExport={handleExport} isGenerating={isGenerating} />

      <main className="flex-grow flex flex-col p-4 gap-4 overflow-hidden">
        {/* Prompt Input Section */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Describe Your Website</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Textarea
              placeholder="e.g., Create a modern portfolio website for a photographer with a dark theme and a gallery section."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[80px] text-base"
              disabled={isGenerating}
            />
            <Button onClick={handleGenerate} disabled={isGenerating} size="lg" className="w-full sm:w-auto self-end bg-primary hover:bg-primary/90">
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Website"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Intent Result Display Section - shows after generation attempt */}
        {intentResult && (
          <Card className="shadow-sm border-accent">
            <CardHeader className="pb-2">
              <CardTitle className="text-md flex items-center gap-2 text-accent">
                <Lightbulb className="h-5 w-5" /> AI Intent Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p><strong>Identified Intent:</strong> {intentResult.intent}</p>
              <p><strong>Suggested Technologies:</strong> {intentResult.technologies.join(', ') || 'None specified'}</p>
            </CardContent>
          </Card>
        )}
        
        {/* Editor and Preview Section */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-4 min-h-[400px] overflow-hidden">
          {/* File Explorer - takes 2 columns on medium screens */}
          <div className="md:col-span-2 h-full overflow-y-auto rounded-md">
            <FileExplorer activeFile={activeFile} onSelectFile={handleSelectFile} />
          </div>
          {/* Code Editor - takes 5 columns on medium screens */}
          <div className="md:col-span-5 h-full overflow-hidden rounded-md border border-border">
            <CodeEditor
              content={editorContent}
              activeFile={activeFile}
              onChange={handleEditorChange}
              isGenerating={isGenerating}
            />
          </div>
          {/* Live Preview - takes 5 columns on medium screens */}
          <div className="md:col-span-5 h-full overflow-hidden rounded-md border border-border">
            <LivePreview
              html={generatedCode.html}
              css={generatedCode.css}
              js={generatedCode.js}
              isGenerating={isGenerating}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
