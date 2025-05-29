
"use client";

import type { FC } from "react";
import { Button } from "@/components/ui/button";
import { Download, Zap } from "lucide-react"; // Zap icon might be replaced or removed based on new branding. Keeping for now.

interface HeaderProps {
  onExport: () => void;
  isGenerating: boolean;
}

const Header: FC<HeaderProps> = ({ onExport, isGenerating }) => {
  return (
    <header className="bg-card border-b border-border p-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <Zap className="h-8 w-8 text-primary" /> {/* Consider if this icon still fits "Tenali" */}
        <h1 className="text-2xl font-bold text-primary">Tenali</h1>
      </div>
      <div className="flex items-center gap-4">
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
