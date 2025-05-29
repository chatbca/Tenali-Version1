
"use client";

import type { FC } from "react";
import { Button } from "@/components/ui/button";
import {
  Download,
  Moon,
  Sun,
  BrainCircuit,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";

interface HeaderProps {
  onExport: () => void;
  isGenerating: boolean;
  // selectedModel: string; // Prop to receive selected model
  // onModelChange: (model: string) => void; // Prop to update model
}

const Header: FC<HeaderProps> = ({ onExport, isGenerating }) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // Update default selected model value to match the new text
  const [selectedModel, setSelectedModel] = useState("gemini_statement_option"); 

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    // Avoid rendering mismatch during hydration for theme toggle
    return (
      <header className="bg-card border-b border-border p-4 flex items-center justify-between shadow-sm sticky top-0 z-50 h-[69px]">
        <div className="flex items-center gap-2">
          <span role="img" aria-label="logo" className="text-2xl">🧠</span>
          <h1 className="text-2xl font-bold text-primary">Tenali v-1</h1>
        </div>
        <div className="flex items-center gap-4">
           {/* Placeholder for model selector to maintain layout, adjusted width */}
          <div className="w-[270px]"></div>
          <Button variant="outline" size="icon" className="w-10 h-10" disabled>
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          </Button>
          <span className="text-sm text-muted-foreground">v-1</span>
          <Button onClick={onExport} disabled={isGenerating} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Code
          </Button>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-card border-b border-border p-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <span role="img" aria-label="logo" className="text-2xl">🧠</span>
        <h1 className="text-2xl font-bold text-primary">Tenali</h1>
      </div>
      <div className="flex items-center gap-4">
        <Select value={selectedModel} onValueChange={setSelectedModel}>
          {/* Adjusted width for the new long text */}
          <SelectTrigger className="w-[270px] text-sm"> 
            <div className="flex items-center gap-2">
              <BrainCircuit className="h-4 w-4 text-muted-foreground" />
              {/* SelectValue will display the text of the selected SelectItem */}
              <SelectValue placeholder="Select model" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {/* Changed the value and display text for the former "GPT-3.5" option */}
            <SelectItem value="gemini_statement_option">we are using gemni only?</SelectItem>
            <SelectItem value="gpt-4">GPT-4(coming soon)</SelectItem>
            <SelectItem value="DeepSeek">DeepSeek(coming soon)</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="w-10 h-10"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <Moon className="h-[1.2rem] w-[1.2rem]" />
          )}
        </Button>
        <span className="text-sm text-muted-foreground">v-1</span>
        <Button onClick={onExport} disabled={isGenerating} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Code
        </Button>
      </div>
    </header>
  );
};

export default Header;

    
