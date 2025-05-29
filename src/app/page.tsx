
"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/webgenius/Header";
import CodeEditor from "@/components/webgenius/CodeEditor";
import LivePreview from "@/components/webgenius/LivePreview";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Lightbulb, Search, Clock, Code, Eye, ListChecks } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { exportCodeAsZip, type GeneratedCode } from "@/lib/exportUtils";
import { generateCodeFromPrompt, type GenerateCodeFromPromptOutput } from "@/ai/flows/generate-code-from-prompt";
import { identifyIntent, type IdentifyIntentOutput } from "@/ai/flows/identify-intent-from-prompt";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const initialCode: GeneratedCode = {
  html: "<h1>Welcome to Tenali!</h1>\n<p>Enter a prompt in the panel on the left and click Generate.</p>",
  css: "body {\n  font-family: sans-serif;\n  display: flex;\n  flex-direction: column; \n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n  text-align: center;\n  background-color: hsl(var(--background)); \n color: hsl(var(--foreground)); \n}\nh1 {\n color: hsl(var(--primary)); \n}",
  js: "// console.log('Hello from Tenali!');",
};

type RightPanelViewType = "editor" | "preview";
type ActiveCodeViewType = "html" | "css" | "js";

export default function TenaliPage() {
  const [prompt, setPrompt] = useState<string>("");
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode>(initialCode);
  const [editorContent, setEditorContent] = useState<string>(initialCode.html);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [intentResult, setIntentResult] = useState<IdentifyIntentOutput | null>(null);
  
  const [promptHistory, setPromptHistory] = useState<string[]>([]);
  const [currentRightPanelView, setCurrentRightPanelView] = useState<RightPanelViewType>("preview");
  const [activeCodeView, setActiveCodeView] = useState<ActiveCodeViewType>("html");

  const { toast } = useToast();

  useEffect(() => {
    setEditorContent(generatedCode[activeCodeView]);
  }, [activeCodeView, generatedCode]);

  const handleEditorChange = (newContent: string) => {
    setEditorContent(newContent);
    setGeneratedCode((prevCode) => ({
      ...prevCode,
      [activeCodeView]: newContent,
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
    setIntentResult(null); 
    setPromptHistory(prev => [prompt, ...prev.slice(0, 9)]); // Add to history, keep last 10

    try {
      try {
        const intentOutput = await identifyIntent({ prompt });
        setIntentResult(intentOutput);
      } catch (intentError) {
        console.warn("Could not identify intent:", intentError);
      }
      
      const output: GenerateCodeFromPromptOutput = await generateCodeFromPrompt({ prompt });
      const newCode = {
        html: output.html || "",
        css: output.css || "",
        js: output.js || "",
      };
      setGeneratedCode(newCode);
      setActiveCodeView("html"); // Default to HTML view in editor after generation
      setEditorContent(newCode.html);
      setCurrentRightPanelView("preview"); // Switch to preview after generation

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
    exportCodeAsZip(generatedCode, "tenali-export");
  };

  const handleSelectPromptFromHistory = (selectedPrompt: string) => {
    setPrompt(selectedPrompt);
  };

  const codeViewButtons = [
    { label: "HTML", value: "html" as ActiveCodeViewType, Icon: Code },
    { label: "CSS", value: "css" as ActiveCodeViewType, Icon: Code }, // Could use a specific CSS icon if available
    { label: "JS", value: "js" as ActiveCodeViewType, Icon: Code }, // Could use a specific JS icon
  ];

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header onExport={handleExport} isGenerating={isGenerating} />

      <main className="flex-grow flex flex-col lg:flex-row p-4 gap-4 overflow-hidden">
        {/* Prompt Panel (Left) */}
        <div className="flex flex-col gap-4 lg:w-1/3 xl:w-1/4">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Describe Your Website</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Textarea
                placeholder="e.g., Create a modern portfolio website for a photographer with a dark theme and a gallery section."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[100px] text-base"
                disabled={isGenerating}
              />
              <Button onClick={handleGenerate} disabled={isGenerating} size="lg" className="w-full bg-primary hover:bg-primary/90">
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-5 w-5" />
                    Generate Website
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-sm flex-grow overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-md flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" /> Prompt History
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-4rem)]"> {/* Adjust height as needed */}
              <ScrollArea className="h-full pr-3">
                {promptHistory.length > 0 ? (
                  <ul className="space-y-2">
                    {promptHistory.map((histPrompt, index) => (
                      <li key={index}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-left h-auto p-2 text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                          onClick={() => handleSelectPromptFromHistory(histPrompt)}
                        >
                          <p className="truncate text-sm">{histPrompt}</p>
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No prompts yet.</p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel (Toggleable Editor/Preview) */}
        <div className="flex-grow flex flex-col gap-4 lg:w-2/3 xl:w-3/4 overflow-hidden">
          <Card className="shadow-md flex flex-col flex-grow overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">
                  {currentRightPanelView === 'editor' ? 'Code Editor' : 'Live Preview'}
                </CardTitle>
                <ToggleGroup 
                  type="single" 
                  value={currentRightPanelView} 
                  onValueChange={(value) => { if (value) setCurrentRightPanelView(value as RightPanelViewType)}}
                  aria-label="Toggle editor or preview"
                >
                  <ToggleGroupItem value="editor" aria-label="Show Code Editor">
                    <Code className="h-4 w-4 mr-2" /> Editor
                  </ToggleGroupItem>
                  <ToggleGroupItem value="preview" aria-label="Show Live Preview">
                    <Eye className="h-4 w-4 mr-2" /> Preview
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
              {currentRightPanelView === 'editor' && (
                <div className="mt-3">
                  <ToggleGroup 
                    type="single" 
                    value={activeCodeView} 
                    onValueChange={(value) => { if (value) setActiveCodeView(value as ActiveCodeViewType)}}
                    aria-label="Select code file"
                    className="justify-start"
                  >
                    {codeViewButtons.map(btn => (
                      <ToggleGroupItem key={btn.value} value={btn.value} aria-label={`Edit ${btn.label}`}>
                        <btn.Icon className="h-4 w-4 mr-2" /> {btn.label}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
              )}
            </CardHeader>
            <CardContent className="flex-grow p-0 overflow-hidden">
              {currentRightPanelView === 'editor' ? (
                <CodeEditor
                  content={editorContent}
                  activeFile={activeCodeView}
                  onChange={handleEditorChange}
                  isGenerating={isGenerating}
                />
              ) : (
                <LivePreview
                  html={generatedCode.html}
                  css={generatedCode.css}
                  js={generatedCode.js}
                  isGenerating={isGenerating}
                />
              )}
            </CardContent>
          </Card>
          
          {/* Status/Logs Panel - Integrated the Intent Result here */}
          <Card className="shadow-sm border-accent/50 max-h-[200px] overflow-y-auto">
             <CardHeader className="pb-2 pt-3">
              <CardTitle className="text-md flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-muted-foreground" /> Status / Logs
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm pt-2">
              {isGenerating && <p className="text-muted-foreground">AI is processing your request...</p>}
              {intentResult ? (
                <>
                  <p><strong>Identified Intent:</strong> {intentResult.intent}</p>
                  <p><strong>Suggested Technologies:</strong> {intentResult.technologies.join(', ') || 'None specified'}</p>
                </>
              ) : (
                !isGenerating && <p className="text-muted-foreground">No intent analysis to display.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
