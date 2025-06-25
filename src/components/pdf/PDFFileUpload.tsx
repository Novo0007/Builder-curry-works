import React, { useState, useCallback } from "react";
import { Upload, FileText, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface PDFFileUploadProps {
  onFileSelect: (file: File) => void;
  onError?: (error: string) => void;
  acceptedFileTypes?: string[];
  maxFileSize?: number; // in MB
  className?: string;
}

export const PDFFileUpload: React.FC<PDFFileUploadProps> = ({
  onFileSelect,
  onError,
  acceptedFileTypes = [".pdf"],
  maxFileSize = 50, // 50MB default
  className,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      // Check file type
      if (
        !file.type.includes("pdf") &&
        !file.name.toLowerCase().endsWith(".pdf")
      ) {
        return "Please select a valid PDF file.";
      }

      // Check file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxFileSize) {
        return `File size must be less than ${maxFileSize}MB. Current size: ${fileSizeMB.toFixed(1)}MB.`;
      }

      return null;
    },
    [maxFileSize],
  );

  const handleFileSelect = useCallback(
    async (file: File) => {
      setError(null);

      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        if (onError) onError(validationError);
        return;
      }

      setSelectedFile(file);
      setIsUploading(true);
      setUploadProgress(0);

      try {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + Math.random() * 20;
          });
        }, 100);

        // Simulate processing time
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setUploadProgress(100);
        setTimeout(() => {
          setIsUploading(false);
          onFileSelect(file);
        }, 500);
      } catch (err) {
        const errorMessage =
          "Failed to process the PDF file. Please try again.";
        setError(errorMessage);
        if (onError) onError(errorMessage);
        setIsUploading(false);
        setSelectedFile(null);
      }
    },
    [validateFile, onFileSelect, onError],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect],
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect],
  );

  const clearFile = useCallback(() => {
    setSelectedFile(null);
    setError(null);
    setUploadProgress(0);
    setIsUploading(false);
  }, []);

  const formatFileSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className={cn("w-full max-w-2xl mx-auto", className)}>
      {/* Upload Area */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 transition-all duration-200 cursor-pointer",
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-accent/50",
          isUploading && "cursor-not-allowed opacity-75",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          if (!isUploading) {
            document.getElementById("pdf-file-input")?.click();
          }
        }}
      >
        <input
          id="pdf-file-input"
          type="file"
          accept={acceptedFileTypes.join(",")}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isUploading}
        />

        <div className="flex flex-col items-center gap-4">
          {isUploading ? (
            <>
              <div className="animate-pulse">
                <Upload className="h-12 w-12 text-primary" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-lg font-medium">Processing PDF...</p>
                <p className="text-sm text-muted-foreground">
                  {selectedFile?.name}
                </p>
                <div className="w-64 mx-auto">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {uploadProgress.toFixed(0)}% complete
                  </p>
                </div>
              </div>
            </>
          ) : selectedFile ? (
            <>
              <div className="flex items-center gap-3 p-4 bg-accent rounded-lg">
                <FileText className="h-8 w-8 text-primary" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFile();
                  }}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Click to select a different file or drag and drop
              </p>
            </>
          ) : (
            <>
              <Upload className="h-12 w-12 text-muted-foreground" />
              <div className="text-center space-y-2">
                <p className="text-lg font-medium">Upload PDF Document</p>
                <p className="text-sm text-muted-foreground">
                  Drag and drop your PDF file here, or click to browse
                </p>
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <span>PDF files only</span>
                  <span>•</span>
                  <span>Max {maxFileSize}MB</span>
                </div>
              </div>
              <Button variant="outline" className="mt-2">
                Choose File
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Sample Files */}
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground mb-3">
          Don't have a PDF? Try one of these samples:
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              import("@/lib/samplePDFs").then(({ getMockPDFFile }) => {
                onFileSelect(getMockPDFFile());
              });
            }}
          >
            Sample Report
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              import("@/lib/samplePDFs").then(({ samplePDFs }) => {
                onFileSelect(samplePDFs.presentation.url);
              });
            }}
          >
            Sample Presentation
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              import("@/lib/samplePDFs").then(({ samplePDFs }) => {
                onFileSelect(samplePDFs.manual.url);
              });
            }}
          >
            Sample Manual
          </Button>
        </div>
      </div>
    </div>
  );
};
