'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/app-context';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  BookOpen,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Scale,
  AlertTriangle,
  Shield,
  RefreshCw,
  MapPin,
  Zap,
  FileText,
  Handshake
} from 'lucide-react';
import { glossaryTerms } from '@/lib/mock-data';

export function HelpScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);
  
  const filteredTerms = glossaryTerms.filter(term => 
    term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
    term.definition.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const termIcons: Record<string, typeof Scale> = {
    'Arbitration': Scale,
    'Waiver': AlertTriangle,
    'Indemnity': Shield,
    'Auto-Renewal': RefreshCw,
    'Governing Law': MapPin,
    'Force Majeure': Zap,
    'Severability': FileText,
    'Joint and Several Liability': Handshake,
  };
  
  return (
    <div className="min-h-screen bg-background pb-24 safe-area-top">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-foreground mb-2">Help & Glossary</h1>
        <p className="text-muted-foreground mb-4">
          Learn common legal terms in simple language
        </p>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search terms..."
            className="pl-12 h-12 rounded-xl bg-muted border-none"
          />
        </div>
      </div>
      
      {/* Quick Help Cards */}
      <div className="px-6 mb-6">
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 -mx-6 px-6">
          <Card className="flex-shrink-0 w-[140px] p-4 cursor-pointer hover:shadow-md transition-shadow">
            <BookOpen className="w-6 h-6 text-primary mb-2" />
            <h3 className="font-medium text-sm text-foreground">Getting Started</h3>
          </Card>
          <Card className="flex-shrink-0 w-[140px] p-4 cursor-pointer hover:shadow-md transition-shadow">
            <Shield className="w-6 h-6 text-primary mb-2" />
            <h3 className="font-medium text-sm text-foreground">Your Rights</h3>
          </Card>
          <Card className="flex-shrink-0 w-[140px] p-4 cursor-pointer hover:shadow-md transition-shadow">
            <Scale className="w-6 h-6 text-primary mb-2" />
            <h3 className="font-medium text-sm text-foreground">Legal Basics</h3>
          </Card>
        </div>
      </div>
      
      {/* Glossary */}
      <div className="px-6">
        <h2 className="font-semibold text-foreground mb-4">Legal Terms Glossary</h2>
        
        {filteredTerms.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No terms found matching your search</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTerms.map((term, index) => {
              const Icon = termIcons[term.term] || BookOpen;
              const isExpanded = expandedTerm === term.term;
              
              return (
                <motion.div
                  key={term.term}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card 
                    className="overflow-hidden cursor-pointer"
                    onClick={() => setExpandedTerm(isExpanded ? null : term.term)}
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <h3 className="font-medium text-foreground">{term.term}</h3>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="px-4 pb-4 pt-0 border-t border-border">
                            <div className="pt-4">
                              <h4 className="text-sm font-medium text-muted-foreground mb-2">Definition</h4>
                              <p className="text-foreground mb-4">{term.definition}</p>
                              
                              <h4 className="text-sm font-medium text-muted-foreground mb-2">Example</h4>
                              <Card className="p-3 bg-muted">
                                <p className="text-sm text-foreground">{term.example}</p>
                              </Card>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Support Card */}
      <div className="px-6 mt-8">
        <Card className="p-6 bg-primary/5 border-primary/20">
          <h3 className="font-semibold text-foreground mb-2">Need more help?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            This app provides educational information only and is not legal advice. 
            For complex legal matters, consult with a qualified attorney.
          </p>
          <button className="flex items-center gap-2 text-primary text-sm font-medium">
            Find legal help resources
            <ExternalLink className="w-4 h-4" />
          </button>
        </Card>
      </div>
    </div>
  );
}
