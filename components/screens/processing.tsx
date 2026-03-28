'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/app-context';
import { Card } from '@/components/ui/card';
import { 
  Upload, 
  FileText, 
  Search, 
  Globe, 
  AlertTriangle, 
  FileCheck,
  Check
} from 'lucide-react';

const processingSteps = [
  { id: 0, label: 'Uploading file', icon: Upload, duration: 1500 },
  { id: 1, label: 'Reading document', icon: FileText, duration: 2000 },
  { id: 2, label: 'Detecting clauses', icon: Search, duration: 2500 },
  { id: 3, label: 'Translating content', icon: Globe, duration: 2000 },
  { id: 4, label: 'Checking risk terms', icon: AlertTriangle, duration: 2000 },
  { id: 5, label: 'Building summary', icon: FileCheck, duration: 1500 },
];

export function ProcessingScreen() {
  const { setCurrentScreen, currentDocument, setCurrentDocument, processingStep, setProcessingStep } = useApp();
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    if (processingStep < processingSteps.length) {
      const timer = setTimeout(() => {
        setProcessingStep(processingStep + 1);
      }, processingSteps[processingStep]?.duration || 1500);
      
      return () => clearTimeout(timer);
    } else {
      setIsComplete(true);
      // Auto-navigate after completion
      const timer = setTimeout(() => {
        if (currentDocument) {
          setCurrentDocument({
            ...currentDocument,
            status: 'needs-review'
          });
        }
        setCurrentScreen('review');
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [processingStep, setProcessingStep, setCurrentScreen, currentDocument, setCurrentDocument]);
  
  const progress = (processingStep / processingSteps.length) * 100;
  
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 safe-area-top safe-area-bottom">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm"
      >
        {/* Document preview */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <Card className="w-24 h-32 flex items-center justify-center bg-white shadow-lg">
              <FileText className="w-10 h-10 text-muted-foreground" />
            </Card>
            
            {/* Animated scanning line */}
            {!isComplete && (
              <motion.div
                initial={{ top: 0 }}
                animate={{ top: '100%' }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: 'linear' 
                }}
                className="absolute left-0 right-0 h-0.5 bg-primary shadow-lg"
                style={{ boxShadow: '0 0 10px var(--primary)' }}
              />
            )}
            
            {/* Completion checkmark */}
            <AnimatePresence>
              {isComplete && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-safe flex items-center justify-center shadow-lg"
                >
                  <Check className="w-5 h-5 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-foreground mb-2">
            {isComplete ? 'Analysis Complete' : 'Analyzing Document'}
          </h2>
          <p className="text-muted-foreground text-sm">
            {isComplete 
              ? 'Your document is ready for review' 
              : currentDocument?.title || 'Processing your document...'}
          </p>
        </div>
        
        {/* Progress bar */}
        <div className="mb-8">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          <p className="text-center text-sm text-muted-foreground mt-2">
            {Math.round(progress)}% complete
          </p>
        </div>
        
        {/* Steps */}
        <Card className="p-4">
          <div className="space-y-3">
            {processingSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === processingStep;
              const isCompleted = index < processingStep;
              
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0.5 }}
                  animate={{ 
                    opacity: isActive || isCompleted ? 1 : 0.5,
                  }}
                  className="flex items-center gap-3"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    isCompleted 
                      ? 'bg-safe text-white' 
                      : isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                  }`}>
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <span className={`text-sm ${
                    isActive ? 'text-foreground font-medium' : 
                    isCompleted ? 'text-muted-foreground' : 
                    'text-muted-foreground'
                  }`}>
                    {step.label}
                  </span>
                  {isActive && (
                    <motion.div
                      className="ml-auto"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-primary"
                            animate={{ 
                              scale: [1, 1.2, 1],
                              opacity: [0.5, 1, 0.5] 
                            }}
                            transition={{ 
                              duration: 0.6, 
                              repeat: Infinity,
                              delay: i * 0.2 
                            }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </Card>
        
        {/* Document stats preview */}
        <AnimatePresence>
          {processingStep >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6"
            >
              <Card className="p-4 bg-primary/5 border-primary/20">
                <div className="flex items-center justify-between text-sm">
                  <div className="text-center">
                    <p className="font-bold text-foreground">8</p>
                    <p className="text-muted-foreground text-xs">Pages</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-foreground">6</p>
                    <p className="text-muted-foreground text-xs">Clauses</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-risk-high">2</p>
                    <p className="text-muted-foreground text-xs">High Risk</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-risk-medium">1</p>
                    <p className="text-muted-foreground text-xs">Medium</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
