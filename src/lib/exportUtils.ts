"use client";

import JSZip from "jszip";
import { saveAs } from "file-saver"; // file-saver is a common companion for JSZip

export interface GeneratedCode {
  html: string;
  css: string;
  js: string;
}

export const exportCodeAsZip = async (code: GeneratedCode, filename: string = "webgenius-export") => {
  const zip = new JSZip();
  zip.file("index.html", code.html);
  zip.file("style.css", code.css);
  zip.file("script.js", code.js);

  try {
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `${filename}.zip`);
  } catch (error) {
    console.error("Failed to generate zip file:", error);
    // Potentially show a toast notification to the user
    alert("Error exporting code. Please check the console for details.");
  }
};
