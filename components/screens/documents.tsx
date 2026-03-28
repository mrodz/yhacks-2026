'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/lib/app-context';
import { Document } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  FileText, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Download,
  ChevronRight,
  Home,
  Briefcase,
  Heart,
  GraduationCap,
  MoreVertical,
  Filter
} from 'lucide-react';

type DocumentFilter = 'all' | 'lease' | 'employment' | 'medical' | 'school' | 'signed' | 'needs-review';

const filters: { id: DocumentFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'lease', label: 'Leases' },
  { id: 'employment', label: 'Employment' },
  { id: 'medical', label: 'Medical' },
  { id: 'school', label: 'School' },
  { id: 'signed', label: 'Signed' },
  { id: 'needs-review', label: 'Needs Review' },
];

export function DocumentsScreen() {
  const { documents, setCurrentDocument, setCurrentScreen } = useApp();
  const [activeFilter, setActiveFilter] = useState<DocumentFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredDocuments = documents.filter(doc => {
    // Search filter
    if (searchQuery && !doc.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Category filter
    if (activeFilter === 'all') return true;
    if (activeFilter === 'signed') return doc.status === 'signed' || doc.status === 'exported';
    if (activeFilter === 'needs-review') return doc.status === 'needs-review';
    return doc.type === activeFilter;
  });
  
  const handleDocumentClick = (doc: Document) => {
    setCurrentDocument(doc);
    setCurrentScreen('review');
  };
  
  const getTypeIcon = (type: string) => {
    const icons: Record<string, typeof FileText> = {
      lease: Home,
      employment: Briefcase,
      medical: Heart,
      school: GraduationCap,
    };
    return icons[type] || FileText;
  };
  
  return (
    <div className="min-h-screen bg-background pb-24 safe-area-top">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-foreground mb-4">Documents</h1>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents..."
            className="pl-12 h-12 rounded-xl bg-muted border-none"
          />
        </div>
      </div>
      
      {/* Filters */}
      <div className="px-6 mb-4">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 -mx-6 px-6">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter(filter.id)}
              className="rounded-full whitespace-nowrap"
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Document List */}
      <div className="px-6">
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-foreground mb-1">No documents found</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? 'Try a different search term' : 'Upload a document to get started'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDocuments.map((doc, index) => {
              const TypeIcon = getTypeIcon(doc.type);
              
              return (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card 
                    className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleDocumentClick(doc)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                        <TypeIcon className="w-6 h-6 text-muted-foreground" />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-medium text-foreground truncate">{doc.title}</h3>
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            className="flex-shrink-0"
                          >
                            <MoreVertical className="w-5 h-5 text-muted-foreground" />
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <StatusBadge status={doc.status} />
                          <span className="text-xs text-muted-foreground">
                            {doc.languagePair.from.toUpperCase()} → {doc.languagePair.to.toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(doc.uploadDate)}
                          </span>
                          <span>{doc.pages} pages</span>
                          {doc.riskCount.high > 0 && (
                            <span className="flex items-center gap-1 text-risk-high">
                              <AlertTriangle className="w-3 h-3" />
                              {doc.riskCount.high} risk
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1" />
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string; icon: typeof CheckCircle }> = {
    'needs-review': { 
      label: 'Needs Review', 
      className: 'bg-risk-medium/10 text-risk-medium',
      icon: AlertTriangle
    },
    'reviewed': { 
      label: 'Reviewed', 
      className: 'bg-info/10 text-info',
      icon: CheckCircle
    },
    'signed': { 
      label: 'Signed', 
      className: 'bg-safe/10 text-safe',
      icon: CheckCircle
    },
    'exported': { 
      label: 'Exported', 
      className: 'bg-safe/10 text-safe',
      icon: Download
    },
    'processing': { 
      label: 'Processing', 
      className: 'bg-muted text-muted-foreground',
      icon: Clock
    },
  };
  
  const { label, className, icon: Icon } = config[status] || config['processing'];
  
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${className}`}>
      <Icon className="w-3 h-3" />
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
