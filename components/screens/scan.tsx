'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/app-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Camera, 
  Upload, 
  X, 
  ChevronLeft,
  RotateCcw,
  Check,
  Crop,
  Trash2,
  Plus,
  FileText,
  Zap
} from 'lucide-react';
import { mockDocuments, mockClauses } from '@/lib/mock-data';

export function ScanChoiceScreen() {
  const { setCurrentScreen } = useApp();
  
  return (
    <div className="min-h-screen bg-background safe-area-top safe-area-bottom">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <button onClick={() => setCurrentScreen('home')}>
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="font-semibold text-lg text-foreground">Add Document</h1>
        <div className="w-6" />
      </div>
      
      <div className="px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl font-bold text-foreground mb-2">
            How would you like to add your document?
          </h2>
          <p className="text-muted-foreground">
            We will analyze it and highlight important clauses
          </p>
        </motion.div>
        
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card 
              className="p-6 cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary"
              onClick={() => setCurrentScreen('scan-camera')}
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center">
                  <Camera className="w-7 h-7 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-foreground mb-1">Scan with Camera</h3>
                  <p className="text-muted-foreground text-sm">
                    Take photos of your paper document. Great for contracts and forms.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card 
              className="p-6 cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary"
              onClick={() => setCurrentScreen('upload')}
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center">
                  <Upload className="w-7 h-7 text-secondary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-foreground mb-1">Upload PDF</h3>
                  <p className="text-muted-foreground text-sm">
                    Select a PDF file from your device or email attachment.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Card className="p-4 bg-info-bg border-info/20">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-info mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground text-sm">Quick tip</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  For best results, ensure good lighting and that all text is clearly visible.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export function ScanCameraScreen() {
  const { setCurrentScreen } = useApp();
  const [capturedPages, setCapturedPages] = useState<number[]>([]);
  
  const handleCapture = () => {
    setCapturedPages(prev => [...prev, prev.length + 1]);
  };
  
  const handleDone = () => {
    if (capturedPages.length > 0) {
      setCurrentScreen('scan-review');
    }
  };
  
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Camera View */}
      <div className="flex-1 relative">
        {/* Simulated camera view */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
          <div className="w-[85%] h-[70%] border-2 border-white/30 rounded-lg relative">
            {/* Corner guides */}
            <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg" />
            <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg" />
            <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg" />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg" />
            
            {/* Document preview placeholder */}
            <div className="absolute inset-4 bg-white/5 rounded flex items-center justify-center">
              <FileText className="w-16 h-16 text-white/30" />
            </div>
          </div>
        </div>
        
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 safe-area-top">
          <button 
            onClick={() => setCurrentScreen('scan-choice')}
            className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          
          <div className="bg-black/50 rounded-full px-4 py-2">
            <span className="text-white text-sm font-medium">
              {capturedPages.length} {capturedPages.length === 1 ? 'page' : 'pages'}
            </span>
          </div>
          
          <div className="w-10" />
        </div>
        
        {/* Page thumbnails */}
        {capturedPages.length > 0 && (
          <div className="absolute bottom-32 left-0 right-0 px-4">
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
              {capturedPages.map((page) => (
                <div 
                  key={page}
                  className="w-16 h-20 bg-white rounded-lg flex-shrink-0 flex items-center justify-center shadow-lg"
                >
                  <span className="text-gray-400 text-sm font-medium">{page}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Controls */}
      <div className="bg-black py-6 px-6 safe-area-bottom">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <button className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
            <RotateCcw className="w-6 h-6 text-white" />
          </button>
          
          <button 
            onClick={handleCapture}
            className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg"
          >
            <div className="w-16 h-16 rounded-full border-4 border-gray-300" />
          </button>
          
          <button 
            onClick={handleDone}
            disabled={capturedPages.length === 0}
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              capturedPages.length > 0 ? 'bg-primary' : 'bg-white/10'
            }`}
          >
            <Check className={`w-6 h-6 ${capturedPages.length > 0 ? 'text-primary-foreground' : 'text-white/50'}`} />
          </button>
        </div>
        
        <p className="text-center text-white/60 text-sm mt-4">
          Position document within the frame and tap to capture
        </p>
      </div>
    </div>
  );
}

export function ScanReviewScreen() {
  const { setCurrentScreen, setCurrentDocument, setProcessingStep } = useApp();
  const [pages, setPages] = useState([1, 2, 3]);
  
  const handleConfirm = () => {
    // Create a new document and start processing
    const newDoc = {
      ...mockDocuments[0],
      id: Date.now().toString(),
      title: 'Scanned Document',
      uploadDate: new Date(),
      status: 'processing' as const,
    };
    setCurrentDocument(newDoc);
    setProcessingStep(0);
    setCurrentScreen('processing');
  };
  
  return (
    <div className="min-h-screen bg-background safe-area-top safe-area-bottom">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <button onClick={() => setCurrentScreen('scan-camera')}>
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="font-semibold text-lg text-foreground">Review Scan</h1>
        <button 
          onClick={() => setPages(prev => [...prev, prev.length + 1])}
          className="text-primary"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
      
      <div className="p-6">
        <p className="text-muted-foreground text-center mb-6">
          Review your pages. Tap to crop or reorder.
        </p>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          {pages.map((page, index) => (
            <motion.div
              key={page}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <Card className="aspect-[3/4] bg-white flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <span className="text-sm text-muted-foreground">Page {page}</span>
                  </div>
                </div>
              </Card>
              
              {/* Actions */}
              <div className="absolute top-2 right-2 flex gap-1">
                <button className="w-8 h-8 rounded-full bg-background/90 flex items-center justify-center shadow">
                  <Crop className="w-4 h-4 text-foreground" />
                </button>
                <button 
                  onClick={() => setPages(prev => prev.filter((_, i) => i !== index))}
                  className="w-8 h-8 rounded-full bg-background/90 flex items-center justify-center shadow"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
              
              {/* Page number */}
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-background/90 rounded text-xs font-medium text-foreground">
                {index + 1} of {pages.length}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Bottom actions */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-background border-t border-border safe-area-bottom">
        <Button className="w-full h-14 text-lg rounded-xl" onClick={handleConfirm}>
          Confirm & Analyze
        </Button>
      </div>
    </div>
  );
}

export function UploadScreen() {
  const { setCurrentScreen, setCurrentDocument, setProcessingStep } = useApp();
  const [isDragging, setIsDragging] = useState(false);
  
  const handleUpload = () => {
    const newDoc = {
      ...mockDocuments[0],
      id: Date.now().toString(),
      uploadDate: new Date(),
      status: 'processing' as const,
    };
    setCurrentDocument(newDoc);
    setProcessingStep(0);
    setCurrentScreen('processing');
  };
  
  return (
    <div className="min-h-screen bg-background safe-area-top safe-area-bottom">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <button onClick={() => setCurrentScreen('scan-choice')}>
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="font-semibold text-lg text-foreground">Upload PDF</h1>
        <div className="w-6" />
      </div>
      
      <div className="px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Upload area */}
          <div
            onClick={handleUpload}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleUpload(); }}
            className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
              isDragging 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg text-foreground mb-2">
              Drop your PDF here
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              or tap to browse files
            </p>
            <p className="text-xs text-muted-foreground">
              Supports PDF files up to 50MB
            </p>
          </div>
          
          {/* Recent files */}
          <div className="mt-8">
            <h3 className="font-medium text-foreground mb-4">Recent files</h3>
            <div className="space-y-3">
              {['Employment_Contract.pdf', 'Lease_Agreement.pdf', 'Medical_Consent.pdf'].map((file, i) => (
                <Card 
                  key={file}
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={handleUpload}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground text-sm">{file}</h4>
                      <p className="text-xs text-muted-foreground">{(1.2 + i * 0.5).toFixed(1)} MB</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
