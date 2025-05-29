
"use client";

import type { FC } from "react";
import { Button } from "@/components/ui/button";
import {
  Download,
  Zap,
  Moon,
  Sun,
  ChevronDown,
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
  const [selectedModel, setSelectedModel] = useState("gpt-3.5"); // Default model

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
          <Zap className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-primary">Tenali</h1>
        </div>
        <div className="flex items-center gap-4">
           {/* Placeholder for model selector to maintain layout */}
          <div className="w-[150px]"></div>
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
        <Zap className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold text-primary">Tenali</h1>
      </div>
      <div className="flex items-center gap-4">
        <Select value={selectedModel} onValueChange={setSelectedModel}>
          <SelectTrigger className="w-[180px] text-sm">
            <div className="flex items-center gap-2">
              <BrainCircuit className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Select model" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-3.5">GPT-3.5</SelectItem>
            <SelectItem value="gpt-4">GPT-4</SelectItem>
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
