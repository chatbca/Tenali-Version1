"use client";

import type { FC } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Zap } from "lucide-react";

interface HeaderProps {
  onExport: () => void;
  isGenerating: boolean;
}

const Header: FC<HeaderProps> = ({ onExport, isGenerating }) => {
  return (
    <header className="bg-card border-b border-border p-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <Zap className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold text-primary">WebGenius</h1>
      </div>
      <div className="flex items-center gap-4">
        <Select defaultValue="gemini">
          <SelectTrigger className="w-[180px] bg-background">
            <SelectValue placeholder="Select AI Model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gemini">Gemini (Default)</SelectItem>
            <SelectItem value="placeholder1" disabled>
              GPT-4 (Coming soon)
            </SelectItem>
            <SelectItem value="placeholder2" disabled>
              Codex (Coming soon)
            </SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={onExport} disabled={isGenerating} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Code
        </Button>
      </div>
    </header>
  );
};

export default Header;
