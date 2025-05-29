
"use client";

import { useEffect, useRef, useState, type FC } from "react"; // Added useState

interface LivePreviewProps {
  html: string;
  css: string;
  js: string;
  isGenerating: boolean;
}

const LivePreview: FC<LivePreviewProps> = ({ html, css, js, isGenerating }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  // Initialize with a basic HTML structure to avoid "document is not defined" during SSR
  const [srcDocContent, setSrcDocContent] = useState(
    "<!DOCTYPE html><html><head><meta charset='UTF-8'></head><body></body></html>"
  );

  useEffect(() => {
    // This function is called from useEffect, so it only runs on the client.
    const constructClientSrcDoc = () => {
      // Safe to access document here as useEffect runs client-side.
      const currentThemeClass = typeof document !== 'undefined' ? document.documentElement.className : '';
      return `
        <!DOCTYPE html>
        <html lang="en" class="${currentThemeClass}">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            /* Basic reset and theming for iframe body */
            body { 
              margin: 0; 
              font-family: sans-serif; 
              background-color: hsl(var(--background));
              color: hsl(var(--foreground));
              transition: background-color 0.2s, color 0.2s;
            }
            ${css}
          </style>
        </head>
        <body>
          ${html}
          <script>
            try {
              ${js}
            } catch (e) {
              console.error('Error in preview script:', e);
            }
          </script>
        </body>
        </html>
      `;
    };

    const newSrcDoc = constructClientSrcDoc();
    setSrcDocContent(newSrcDoc);

  // The dependency array ensures that the useEffect hook re-runs if html, css, js,
  // or the document's theme class changes on the client-side.
  }, [html, css, js, typeof document !== 'undefined' ? document.documentElement.className : '']);


  return (
    <div className="flex flex-col h-full bg-card rounded-b-lg overflow-hidden">
      {isGenerating && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10 rounded-b-lg">
          <p className="text-lg font-semibold animate-pulse text-primary">Generating website...</p>
        </div>
      )}
      <iframe
        ref={iframeRef}
        title="Live Preview"
        className="w-full h-full border-0 flex-grow"
        sandbox="allow-scripts allow-same-origin" 
        srcDoc={srcDocContent} // Use state here, which is updated client-side
      />
    </div>
  );
};

export default LivePreview;
