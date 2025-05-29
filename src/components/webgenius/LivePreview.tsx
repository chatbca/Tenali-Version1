"use client";

import { useEffect, useRef, type FC } from "react";

interface LivePreviewProps {
  html: string;
  css: string;
  js: string;
  isGenerating: boolean;
}

const LivePreview: FC<LivePreviewProps> = ({ html, css, js, isGenerating }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const constructSrcDoc = () => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { margin: 0; font-family: sans-serif; }
          ${css}
        </style>
      </head>
      <body>
        ${html}
        <script>
          ${js}
        </script>
      </body>
      </html>
    `;
  };
  
  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = constructSrcDoc();
    }
  }, [html, css, js]);


  return (
    <div className="flex flex-col h-full bg-card shadow-sm">
       <div className="p-3 border-b border-border bg-muted/50">
        <h3 className="text-sm font-medium text-foreground">Live Preview</h3>
      </div>
      {isGenerating && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
          <p className="text-lg font-semibold animate-pulse text-primary">Generating website...</p>
        </div>
      )}
      <iframe
        ref={iframeRef}
        title="Live Preview"
        className="w-full h-full border-0 flex-grow"
        sandbox="allow-scripts allow-same-origin" // allow-same-origin for potentially relative paths in generated code if any, though srcDoc usually handles this well.
        srcDoc={constructSrcDoc()} // Initial srcDoc
      />
    </div>
  );
};

export default LivePreview;
