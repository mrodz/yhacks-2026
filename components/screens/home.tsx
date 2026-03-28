'use client';

import { motion } from 'framer-motion';
import { useApp } from '@/lib/app-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Camera, 
  Upload, 
  ChevronRight, 
  FileText, 
  Clock, 
  AlertTriangle,
  Scale,
  Home as HomeIcon,
  Briefcase,
  Heart,
  BookOpen
} from 'lucide-react';
import { educationalCards } from '@/lib/mock-data';

export function HomeScreen() {
  const { userName, documents, setCurrentScreen, setCurrentDocument } = useApp();
  
  const pendingDocuments = documents.filter(d => d.status === 'needs-review');
  const recentDocuments = documents.slice(0, 3);
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };
  
  const iconMap: Record<string, typeof Scale> = {
    Scale,
    Home: HomeIcon,
    Briefcase,
    Heart,
  };
  
  return (
    <div className="min-h-screen bg-background pb-24 safe-area-top">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-muted-foreground">{getGreeting()}</p>
          <h1 className="text-2xl font-bold text-foreground">{userName || 'Welcome back'}</h1>
        </motion.div>
      </div>
      
      {/* Main Actions */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card 
              className="p-5 cursor-pointer hover:shadow-md transition-shadow bg-primary text-primary-foreground"
              onClick={() => setCurrentScreen('scan-choice')}
            >
              <Camera className="w-8 h-8 mb-3" />
              <h3 className="font-semibold text-lg">Scan Document</h3>
              <p className="text-sm opacity-90 mt-1">Use your camera</p>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
          >
            <Card 
              className="p-5 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setCurrentScreen('upload')}
            >
              <Upload className="w-8 h-8 mb-3 text-primary" />
              <h3 className="font-semibold text-lg text-foreground">Upload PDF</h3>
              <p className="text-sm text-muted-foreground mt-1">From your files</p>
            </Card>
          </motion.div>
        </div>
      </div>
      
      {/* Pending Review Card */}
      {pendingDocuments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="px-6 mb-6"
        >
          <Card 
            className="p-4 border-l-4 border-l-risk-medium bg-risk-medium-bg cursor-pointer"
            onClick={() => {
              setCurrentDocument(pendingDocuments[0]);
              setCurrentScreen('review');
            }}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-16 bg-card rounded-lg border flex items-center justify-center">
                <FileText className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-risk-medium text-white">
                    Needs Review
                  </span>
                </div>
                <h3 className="font-medium text-foreground">{pendingDocuments[0].title}</h3>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-risk-high" />
                    {pendingDocuments[0].riskCount.high} high risk
                  </span>
                  <span>{pendingDocuments[0].pages} pages</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Card>
        </motion.div>
      )}
      
      {/* Recent Documents */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="px-6 mb-6"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-foreground">Recent Documents</h2>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setCurrentScreen('documents')}
            className="text-primary"
          >
            See All
          </Button>
        </div>
        
        <div className="space-y-3">
          {recentDocuments.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
            >
              <Card 
                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => {
                  setCurrentDocument(doc);
                  setCurrentScreen('review');
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">{doc.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(doc.uploadDate)}</span>
                      <StatusBadge status={doc.status} />
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      {/* Educational Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="px-6"
      >
        <h2 className="font-semibold text-foreground mb-3">Learn</h2>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 -mx-6 px-6">
          {educationalCards.map((card) => {
            const Icon = iconMap[card.icon] || BookOpen;
            return (
              <Card 
                key={card.id}
                className="flex-shrink-0 w-[160px] p-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-medium text-sm text-foreground leading-snug">{card.title}</h3>
              </Card>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    'needs-review': { label: 'Needs Review', className: 'bg-risk-medium/10 text-risk-medium' },
    'reviewed': { label: 'Reviewed', className: 'bg-info/10 text-info' },
    'signed': { label: 'Signed', className: 'bg-safe/10 text-safe' },
    'exported': { label: 'Exported', className: 'bg-safe/10 text-safe' },
    'processing': { label: 'Processing', className: 'bg-muted text-muted-foreground' },
  };
  
  const { label, className } = config[status] || config['processing'];
  
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${className}`}>
      {label}
    </span>
  );
}

function formatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
