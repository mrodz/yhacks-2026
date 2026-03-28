'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/lib/app-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ChevronLeft, 
  AlertTriangle,
  Check,
  Pen,
  Type,
  Upload,
  RotateCcw,
  FileText,
  Calendar,
  MapPin,
  ChevronRight
} from 'lucide-react';

export function PreSignScreen() {
  const { currentDocument, setCurrentScreen, setReviewTab } = useApp();
  
  const clauses = currentDocument?.clauses || [];
  const highRiskCount = clauses.filter(c => c.riskLevel === 'high').length;
  const mediumRiskCount = clauses.filter(c => c.riskLevel === 'medium').length;
  const grayAreaCount = clauses.filter(c => c.riskLevel === 'low').length;
  const totalClauses = clauses.length;
  
  return (
    <div className="min-h-screen bg-background safe-area-top safe-area-bottom">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <button onClick={() => setCurrentScreen('review')}>
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="font-semibold text-lg text-foreground">Ready to Sign?</h1>
        <div className="w-6" />
      </div>
      
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Review Summary</h2>
          <p className="text-muted-foreground">
            Before you sign, here is what we found
          </p>
        </motion.div>
        
        {/* Stats */}
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">{totalClauses}</p>
              <p className="text-sm text-muted-foreground">Clauses Analyzed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-safe">{totalClauses - highRiskCount - mediumRiskCount}</p>
              <p className="text-sm text-muted-foreground">Standard Clauses</p>
            </div>
          </div>
        </Card>
        
        {/* Warnings */}
        {(highRiskCount > 0 || mediumRiskCount > 0 || grayAreaCount > 0) && (
          <div className="space-y-3 mb-6">
            {highRiskCount > 0 && (
              <Card 
                className="p-4 border-l-4 border-l-risk-high bg-risk-high-bg cursor-pointer"
                onClick={() => {
                  setReviewTab('risks');
                  setCurrentScreen('review');
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-risk-high" />
                    <div>
                      <p className="font-medium text-foreground">{highRiskCount} High Risk Clause{highRiskCount > 1 ? 's' : ''}</p>
                      <p className="text-sm text-muted-foreground">Review carefully before signing</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </Card>
            )}
            
            {mediumRiskCount > 0 && (
              <Card 
                className="p-4 border-l-4 border-l-risk-medium bg-risk-medium-bg cursor-pointer"
                onClick={() => {
                  setReviewTab('risks');
                  setCurrentScreen('review');
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-risk-medium" />
                    <div>
                      <p className="font-medium text-foreground">{mediumRiskCount} Unusual Clause{mediumRiskCount > 1 ? 's' : ''}</p>
                      <p className="text-sm text-muted-foreground">One-sided or uncommon terms</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </Card>
            )}
            
            {grayAreaCount > 0 && (
              <Card 
                className="p-4 border-l-4 border-l-risk-low bg-risk-low-bg cursor-pointer"
                onClick={() => {
                  setReviewTab('risks');
                  setCurrentScreen('review');
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-risk-low" />
                    <div>
                      <p className="font-medium text-foreground">{grayAreaCount} Gray Area{grayAreaCount > 1 ? 's' : ''}</p>
                      <p className="text-sm text-muted-foreground">May be interpreted differently</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </Card>
            )}
          </div>
        )}
        
        {/* Local Law Reminder */}
        <Card className="p-4 bg-info-bg border-info/20 mb-6">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-info mt-0.5" />
            <div>
              <p className="font-medium text-foreground text-sm">Location-Dependent Terms</p>
              <p className="text-xs text-muted-foreground mt-1">
                Some clauses in this document may be interpreted differently based on California law. 
                Consider consulting a local attorney if you have concerns.
              </p>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-background border-t border-border safe-area-bottom">
        <div className="space-y-3">
          <Button 
            className="w-full h-14 text-lg rounded-xl"
            onClick={() => setCurrentScreen('sign')}
          >
            Continue to Sign
            <Pen className="ml-2 w-5 h-5" />
          </Button>
          <Button 
            variant="outline"
            className="w-full h-12 rounded-xl"
            onClick={() => setCurrentScreen('review')}
          >
            Review Again
          </Button>
        </div>
      </div>
    </div>
  );
}

export function SignScreen() {
  const { setCurrentScreen, currentDocument, setCurrentDocument } = useApp();
  const [signatureMode, setSignatureMode] = useState<'draw' | 'type' | 'upload'>('draw');
  const [typedSignature, setTypedSignature] = useState('');
  const [hasSignature, setHasSignature] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  const handleDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    let x, y;
    
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };
  
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    let x, y;
    
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1a1a1a';
    setIsDrawing(true);
  };
  
  const stopDrawing = () => {
    setIsDrawing(false);
  };
  
  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setHasSignature(false);
  };
  
  const handleSign = () => {
    if (currentDocument) {
      setCurrentDocument({
        ...currentDocument,
        status: 'signed'
      });
    }
    setCurrentScreen('export');
  };
  
  const canSign = signatureMode === 'draw' ? hasSignature : 
                  signatureMode === 'type' ? typedSignature.length > 0 : 
                  false;
  
  return (
    <div className="min-h-screen bg-background safe-area-top safe-area-bottom">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <button onClick={() => setCurrentScreen('review')}>
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="font-semibold text-lg text-foreground">Sign Document</h1>
        <div className="w-6" />
      </div>
      
      <div className="p-6">
        {/* Document Preview */}
        <Card className="aspect-[3/4] bg-white mb-6 relative overflow-hidden">
          <div className="absolute inset-4 space-y-2">
            {Array.from({ length: 15 }).map((_, i) => (
              <div 
                key={i}
                className="h-2 bg-gray-200 rounded"
                style={{ width: `${60 + Math.random() * 35}%` }}
              />
            ))}
          </div>
          
          {/* Signature placement indicator */}
          <div className="absolute bottom-8 left-8 right-8">
            <div className="border-b-2 border-dashed border-primary pb-2">
              {signatureMode === 'type' && typedSignature && (
                <p className="font-serif text-2xl text-foreground italic">{typedSignature}</p>
              )}
              {signatureMode === 'draw' && hasSignature && (
                <p className="text-sm text-muted-foreground">Signature placed</p>
              )}
              {!canSign && (
                <p className="text-sm text-muted-foreground">Sign here</p>
              )}
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-muted-foreground">Signature</span>
              <span className="text-xs text-muted-foreground">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </Card>
        
        {/* Signature Mode Tabs */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={signatureMode === 'draw' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSignatureMode('draw')}
            className="flex-1"
          >
            <Pen className="w-4 h-4 mr-2" />
            Draw
          </Button>
          <Button
            variant={signatureMode === 'type' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSignatureMode('type')}
            className="flex-1"
          >
            <Type className="w-4 h-4 mr-2" />
            Type
          </Button>
          <Button
            variant={signatureMode === 'upload' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSignatureMode('upload')}
            className="flex-1"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
        </div>
        
        {/* Signature Input */}
        {signatureMode === 'draw' && (
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Draw your signature</span>
              <button 
                onClick={clearCanvas}
                className="flex items-center gap-1 text-primary text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                Clear
              </button>
            </div>
            <div className="border-2 border-dashed border-border rounded-xl bg-white">
              <canvas
                ref={canvasRef}
                width={300}
                height={120}
                className="w-full touch-none"
                onMouseDown={startDrawing}
                onMouseMove={handleDraw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={handleDraw}
                onTouchEnd={stopDrawing}
              />
            </div>
          </Card>
        )}
        
        {signatureMode === 'type' && (
          <Card className="p-4">
            <span className="text-sm text-muted-foreground block mb-2">Type your name</span>
            <Input
              value={typedSignature}
              onChange={(e) => setTypedSignature(e.target.value)}
              placeholder="Your full legal name"
              className="h-14 text-lg font-serif italic"
            />
            <p className="text-xs text-muted-foreground mt-2">
              By typing your name, you agree that this constitutes your legal signature.
            </p>
          </Card>
        )}
        
        {signatureMode === 'upload' && (
          <Card className="p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-foreground font-medium mb-1">Upload saved signature</p>
            <p className="text-sm text-muted-foreground">PNG or JPG image</p>
          </Card>
        )}
        
        {/* Date */}
        <Card className="p-4 mt-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium text-foreground">{new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-background border-t border-border safe-area-bottom">
        <Button 
          className="w-full h-14 text-lg rounded-xl"
          disabled={!canSign}
          onClick={handleSign}
        >
          <Check className="mr-2 w-5 h-5" />
          Sign Document
        </Button>
      </div>
    </div>
  );
}

export function ExportScreen() {
  const { setCurrentScreen, currentDocument } = useApp();
  
  const exportOptions = [
    { 
      id: 'signed-pdf', 
      title: 'Signed PDF', 
      description: 'The complete document with your signature',
      icon: FileText 
    },
    { 
      id: 'summary', 
      title: 'Summary Report', 
      description: 'Key findings and clause explanations',
      icon: FileText 
    },
    { 
      id: 'bilingual', 
      title: 'Bilingual Version', 
      description: 'Original text with translations',
      icon: FileText 
    },
  ];
  
  return (
    <div className="min-h-screen bg-background safe-area-top safe-area-bottom">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="w-6" />
        <h1 className="font-semibold text-lg text-foreground">Export Document</h1>
        <div className="w-6" />
      </div>
      
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 rounded-full bg-safe flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Document Signed!</h2>
          <p className="text-muted-foreground">
            {currentDocument?.title || 'Your document'} has been signed successfully
          </p>
        </motion.div>
        
        {/* Export Options */}
        <div className="space-y-3 mb-6">
          {exportOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{option.title}</h3>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
        
        {/* Share Options */}
        <Card className="p-4 mb-6">
          <h3 className="font-medium text-foreground mb-3">Share</h3>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1">
              Email
            </Button>
            <Button variant="outline" className="flex-1">
              Copy Link
            </Button>
            <Button variant="outline" className="flex-1">
              More
            </Button>
          </div>
        </Card>
      </div>
      
      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-background border-t border-border safe-area-bottom">
        <Button 
          className="w-full h-14 text-lg rounded-xl"
          onClick={() => setCurrentScreen('home')}
        >
          Done
        </Button>
      </div>
    </div>
  );
}
