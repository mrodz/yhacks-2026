'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/app-context';
import { ReviewTab, Clause, RiskLevel } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  MoreVertical,
  FileText,
  Languages,
  ListChecks,
  AlertTriangle,
  MessageCircle,
  ChevronRight,
  ChevronDown,
  X,
  Volume2,
  Info,
  MapPin,
  HelpCircle,
  ExternalLink,
  Check,
  Send
} from 'lucide-react';
import { mockClauses, suggestedQuestions, mockChatResponse } from '@/lib/mock-data';

const tabs: { id: ReviewTab; label: string; icon: typeof FileText }[] = [
  { id: 'original', label: 'Original', icon: FileText },
  { id: 'translation', label: 'Translation', icon: Languages },
  { id: 'summary', label: 'Summary', icon: ListChecks },
  { id: 'risks', label: 'Risks', icon: AlertTriangle },
  { id: 'questions', label: 'Questions', icon: MessageCircle },
];

export function ReviewScreen() {
  const { 
    currentDocument, 
    setCurrentScreen, 
    reviewTab, 
    setReviewTab,
    showClauseSheet,
    setShowClauseSheet,
    selectedClauseId,
    setSelectedClauseId
  } = useApp();
  
  const clauses = currentDocument?.clauses || mockClauses;
  const selectedClause = clauses.find(c => c.id === selectedClauseId);
  
  const handleClauseClick = (clauseId: string) => {
    setSelectedClauseId(clauseId);
    setShowClauseSheet(true);
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col safe-area-top">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <button onClick={() => setCurrentScreen('home')}>
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>
        <div className="flex-1 text-center">
          <h1 className="font-semibold text-foreground truncate px-4">
            {currentDocument?.title || 'Document Review'}
          </h1>
        </div>
        <button>
          <MoreVertical className="w-6 h-6 text-foreground" />
        </button>
      </div>
      
      {/* Tab Bar */}
      <div className="bg-card border-b border-border">
        <div className="flex overflow-x-auto hide-scrollbar px-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = reviewTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setReviewTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-3 whitespace-nowrap border-b-2 transition-colors ${
                  isActive 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-muted-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
                {tab.id === 'risks' && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full bg-risk-high text-white text-xs font-bold">
                    2
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        <AnimatePresence mode="wait">
          {reviewTab === 'original' && (
            <OriginalTab clauses={clauses} onClauseClick={handleClauseClick} />
          )}
          {reviewTab === 'translation' && (
            <TranslationTab clauses={clauses} onClauseClick={handleClauseClick} />
          )}
          {reviewTab === 'summary' && (
            <SummaryTab clauses={clauses} onClauseClick={handleClauseClick} />
          )}
          {reviewTab === 'risks' && (
            <RisksTab clauses={clauses} onClauseClick={handleClauseClick} />
          )}
          {reviewTab === 'questions' && (
            <QuestionsTab clauses={clauses} onClauseClick={handleClauseClick} />
          )}
        </AnimatePresence>
      </div>
      
      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border safe-area-bottom">
        <Button 
          className="w-full h-12 rounded-xl"
          onClick={() => setCurrentScreen('sign')}
        >
          Ready to Sign
          <ChevronRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
      
      {/* Clause Bottom Sheet */}
      <AnimatePresence>
        {showClauseSheet && selectedClause && (
          <ClauseBottomSheet 
            clause={selectedClause} 
            onClose={() => setShowClauseSheet(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function OriginalTab({ clauses, onClauseClick }: { clauses: Clause[]; onClauseClick: (id: string) => void }) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 8;
  
  const getRiskColor = (level: RiskLevel) => {
    const colors = {
      high: 'bg-risk-high/20 border-risk-high',
      medium: 'bg-risk-medium/20 border-risk-medium',
      low: 'bg-risk-low/20 border-risk-low',
      info: 'bg-info/20 border-info',
      safe: 'bg-safe/20 border-safe',
    };
    return colors[level];
  };
  
  const pageClause = clauses.filter(c => c.pageNumber === currentPage);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-4"
    >
      {/* PDF Viewer Simulation */}
      <Card className="bg-white aspect-[3/4] relative overflow-hidden mb-4">
        {/* Page content simulation */}
        <div className="absolute inset-4 space-y-3">
          {/* Simulated text lines */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={i}
              className="h-2 bg-gray-200 rounded"
              style={{ width: `${60 + Math.random() * 35}%` }}
            />
          ))}
        </div>
        
        {/* Highlighted clauses */}
        {pageClause.map((clause) => (
          <motion.button
            key={clause.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => onClauseClick(clause.id)}
            className={`absolute border-l-4 rounded-r px-2 py-1 text-left ${getRiskColor(clause.riskLevel)}`}
            style={{
              top: `${clause.position.y}%`,
              left: `${clause.position.x}%`,
              width: `${clause.position.width}%`,
            }}
          >
            <span className="text-xs font-medium text-foreground line-clamp-2">
              {clause.title}
            </span>
          </motion.button>
        ))}
        
        {/* Page number */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <span className="text-sm text-muted-foreground bg-white/80 px-3 py-1 rounded-full">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      </Card>
      
      {/* Page Navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(p => p - 1)}
        >
          Previous
        </Button>
        <div className="flex gap-1">
          {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={i}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                  currentPage === pageNum 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(p => p + 1)}
        >
          Next
        </Button>
      </div>
      
      {/* Clause Legend */}
      <Card className="p-4">
        <h3 className="font-medium text-foreground mb-3">Highlight Legend</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-risk-high" />
            <span className="text-muted-foreground">High Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-risk-medium" />
            <span className="text-muted-foreground">Unusual</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-risk-low" />
            <span className="text-muted-foreground">Ambiguous</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-info" />
            <span className="text-muted-foreground">Important</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-safe" />
            <span className="text-muted-foreground">Standard</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function TranslationTab({ clauses, onClauseClick }: { clauses: Clause[]; onClauseClick: (id: string) => void }) {
  const [viewMode, setViewMode] = useState<'side-by-side' | 'translated'>('translated');
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-4"
    >
      {/* View Mode Toggle */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={viewMode === 'translated' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('translated')}
          className="flex-1"
        >
          Translated Only
        </Button>
        <Button
          variant={viewMode === 'side-by-side' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('side-by-side')}
          className="flex-1"
        >
          Side by Side
        </Button>
      </div>
      
      {/* Translated Clauses */}
      <div className="space-y-4">
        {clauses.map((clause, index) => (
          <motion.div
            key={clause.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card 
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onClauseClick(clause.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-foreground">{clause.title}</h3>
                <RiskBadge level={clause.riskLevel} />
              </div>
              
              {viewMode === 'side-by-side' && (
                <div className="mb-3 pb-3 border-b border-border">
                  <p className="text-xs text-muted-foreground mb-1">Original (English)</p>
                  <p className="text-sm text-foreground/70">{clause.originalText}</p>
                </div>
              )}
              
              <div>
                <p className="text-xs text-muted-foreground mb-1">Translated (Spanish)</p>
                <p className="text-sm text-foreground">{clause.translatedText}</p>
              </div>
              
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground mb-1">Plain Language</p>
                <p className="text-sm text-foreground">{clause.plainLanguage}</p>
              </div>
              
              <button className="flex items-center gap-2 mt-3 text-primary text-sm">
                <Volume2 className="w-4 h-4" />
                Listen to translation
              </button>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function SummaryTab({ clauses, onClauseClick }: { clauses: Clause[]; onClauseClick: (id: string) => void }) {
  const summaryItems = [
    {
      title: 'What this document is',
      content: 'A residential lease agreement for a one-bedroom apartment located at 123 Main Street, for a term of 12 months.',
      icon: FileText,
    },
    {
      title: 'What you are agreeing to',
      content: 'You agree to pay $2,400/month in rent, follow building rules, maintain the property, and give 60 days notice before moving out.',
      icon: Check,
    },
    {
      title: 'Financial obligations',
      content: 'Security deposit: $4,800 (2 months). Monthly rent: $2,400 due on the 1st. Late fee: $50 or 5% after 5 days.',
      icon: Info,
      linkedClause: '4',
    },
    {
      title: 'Important deadlines',
      content: '60 days notice required to terminate. Auto-renewal if no notice given. Late payment fee after 5 days.',
      icon: AlertTriangle,
      linkedClause: '2',
    },
    {
      title: 'Rights you may be giving up',
      content: 'Right to jury trial (arbitration clause). Right to sue for some types of damages (liability waiver).',
      icon: AlertTriangle,
      linkedClause: '1',
      risk: 'high',
    },
    {
      title: 'Things that may depend on local law',
      content: 'Security deposit limits, arbitration enforceability, and liability waiver validity may vary based on California law.',
      icon: MapPin,
    },
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-4"
    >
      <div className="space-y-4">
        {summaryItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card 
                className={`p-4 ${item.linkedClause ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${
                  item.risk === 'high' ? 'border-l-4 border-l-risk-high' : ''
                }`}
                onClick={() => item.linkedClause && onClauseClick(item.linkedClause)}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    item.risk === 'high' ? 'bg-risk-high-bg text-risk-high' : 'bg-primary/10 text-primary'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.content}</p>
                    {item.linkedClause && (
                      <button className="flex items-center gap-1 text-primary text-sm mt-2">
                        View clause
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function RisksTab({ clauses, onClauseClick }: { clauses: Clause[]; onClauseClick: (id: string) => void }) {
  const highRisk = clauses.filter(c => c.riskLevel === 'high');
  const mediumRisk = clauses.filter(c => c.riskLevel === 'medium');
  const lowRisk = clauses.filter(c => c.riskLevel === 'low');
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-4"
    >
      {/* Summary Stats */}
      <Card className="p-4 mb-6">
        <div className="flex justify-around text-center">
          <div>
            <p className="text-2xl font-bold text-risk-high">{highRisk.length}</p>
            <p className="text-xs text-muted-foreground">High Risk</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-risk-medium">{mediumRisk.length}</p>
            <p className="text-xs text-muted-foreground">Unusual</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-risk-low">{lowRisk.length}</p>
            <p className="text-xs text-muted-foreground">Gray Areas</p>
          </div>
        </div>
      </Card>
      
      {/* High Risk Section */}
      {highRisk.length > 0 && (
        <RiskSection 
          title="High Risk Clauses" 
          subtitle="Review these carefully before signing"
          clauses={highRisk} 
          onClauseClick={onClauseClick}
        />
      )}
      
      {/* Medium Risk Section */}
      {mediumRisk.length > 0 && (
        <RiskSection 
          title="Unusual Clauses" 
          subtitle="One-sided or uncommon terms"
          clauses={mediumRisk} 
          onClauseClick={onClauseClick}
        />
      )}
      
      {/* Low Risk Section */}
      {lowRisk.length > 0 && (
        <RiskSection 
          title="Gray Areas" 
          subtitle="Ambiguous terms that could be interpreted differently"
          clauses={lowRisk} 
          onClauseClick={onClauseClick}
        />
      )}
    </motion.div>
  );
}

function RiskSection({ 
  title, 
  subtitle, 
  clauses, 
  onClauseClick 
}: { 
  title: string; 
  subtitle: string; 
  clauses: Clause[]; 
  onClauseClick: (id: string) => void;
}) {
  return (
    <div className="mb-6">
      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-3">{subtitle}</p>
      <div className="space-y-3">
        {clauses.map((clause) => (
          <Card 
            key={clause.id}
            className="p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onClauseClick(clause.id)}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-foreground">{clause.title}</h4>
              <RiskBadge level={clause.riskLevel} />
            </div>
            <p className="text-sm text-muted-foreground mb-2">{clause.plainLanguage}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Page {clause.pageNumber}</span>
              <span className="text-primary">Tap to view details</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function QuestionsTab({ clauses, onClauseClick }: { clauses: Clause[]; onClauseClick: (id: string) => void }) {
  const { chatMessages, addChatMessage } = useApp();
  const [inputValue, setInputValue] = useState('');
  
  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;
    
    // Add user message
    addChatMessage({ type: 'user', content: message });
    setInputValue('');
    
    // Simulate AI response
    setTimeout(() => {
      const response = mockChatResponse(message);
      addChatMessage({ 
        type: 'assistant', 
        content: response.content,
        clauseReferences: response.clauseReferences
      });
    }, 1000);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-[calc(100vh-220px)]"
    >
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-medium text-foreground mb-2">Ask About This Document</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Get answers grounded in the actual clauses
            </p>
            
            {/* Suggested Questions */}
            <div className="space-y-2">
              {suggestedQuestions.slice(0, 4).map((question) => (
                <button
                  key={question}
                  onClick={() => handleSendMessage(question)}
                  className="w-full p-3 rounded-xl bg-card border border-border text-left text-sm text-foreground hover:border-primary transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] rounded-2xl p-4 ${
                  message.type === 'user' 
                    ? 'bg-primary text-primary-foreground rounded-br-md' 
                    : 'bg-card border border-border rounded-bl-md'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {message.clauseReferences && message.clauseReferences.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border/30">
                      <p className="text-xs opacity-70 mb-2">Referenced clauses:</p>
                      <div className="flex flex-wrap gap-2">
                        {message.clauseReferences.map((ref) => {
                          const clause = clauses.find(c => c.id === ref.clauseId);
                          return (
                            <button
                              key={ref.clauseId}
                              onClick={() => onClauseClick(ref.clauseId)}
                              className="text-xs px-2 py-1 rounded bg-primary/10 text-primary"
                            >
                              {clause?.title || `Page ${ref.pageNumber}`}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      
      {/* Input */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
            placeholder="Ask a question about this document..."
            className="flex-1 h-12 px-4 rounded-xl bg-muted border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button 
            size="icon" 
            className="w-12 h-12 rounded-xl"
            onClick={() => handleSendMessage(inputValue)}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function ClauseBottomSheet({ clause, onClose }: { clause: Clause; onClose: () => void }) {
  const { setReviewTab } = useApp();
  
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-40"
      />
      
      {/* Sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 bg-card rounded-t-3xl z-50 max-h-[85vh] overflow-hidden flex flex-col safe-area-bottom"
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-muted" />
        </div>
        
        {/* Header */}
        <div className="flex items-start justify-between px-6 pb-4 border-b border-border">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <RiskBadge level={clause.riskLevel} />
              <span className="text-xs text-muted-foreground">Page {clause.pageNumber}</span>
            </div>
            <h2 className="text-xl font-bold text-foreground">{clause.title}</h2>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
          >
            <X className="w-4 h-4 text-foreground" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Plain Language Explanation */}
          <section className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Plain Language</h3>
            <Card className="p-4 bg-primary/5 border-primary/20">
              <p className="text-foreground leading-relaxed">{clause.plainLanguage}</p>
            </Card>
          </section>
          
          {/* Translation */}
          <section className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Translation (Spanish)</h3>
              <button className="flex items-center gap-1 text-primary text-sm">
                <Volume2 className="w-4 h-4" />
                Listen
              </button>
            </div>
            <Card className="p-4">
              <p className="text-foreground leading-relaxed">{clause.translatedText}</p>
            </Card>
          </section>
          
          {/* Why This Matters */}
          <section className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Why This Matters</h3>
            <Card className="p-4">
              <p className="text-foreground leading-relaxed">{clause.whyMatters}</p>
            </Card>
          </section>
          
          {/* Local Law Note */}
          {clause.dependsOnLocalLaw && clause.localLawNote && (
            <section className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Depends on Local Law
              </h3>
              <Card className="p-4 bg-info-bg border-info/20">
                <p className="text-foreground leading-relaxed">{clause.localLawNote}</p>
              </Card>
            </section>
          )}
          
          {/* Questions to Ask */}
          <section className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              Questions to Ask Before Signing
            </h3>
            <div className="space-y-2">
              {clause.questionsToAsk.map((question, i) => (
                <Card key={i} className="p-3">
                  <p className="text-sm text-foreground">{question}</p>
                </Card>
              ))}
            </div>
          </section>
          
          {/* Confidence Note */}
          <section className="mb-6">
            <Card className="p-4 bg-muted">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-muted-foreground mt-0.5" />
                <p className="text-sm text-muted-foreground">{clause.confidenceNote}</p>
              </div>
            </Card>
          </section>
        </div>
        
        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-border flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => {
              setReviewTab('questions');
              onClose();
            }}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Ask About This
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => {
              setReviewTab('original');
              onClose();
            }}
          >
            <FileText className="w-4 h-4 mr-2" />
            View in Document
          </Button>
        </div>
      </motion.div>
    </>
  );
}

function RiskBadge({ level }: { level: RiskLevel }) {
  const config = {
    high: { label: 'High Risk', className: 'bg-risk-high text-white' },
    medium: { label: 'Unusual', className: 'bg-risk-medium text-white' },
    low: { label: 'Gray Area', className: 'bg-risk-low text-white' },
    info: { label: 'Important', className: 'bg-info text-white' },
    safe: { label: 'Standard', className: 'bg-safe text-white' },
  };
  
  const { label, className } = config[level];
  
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${className}`}>
      {label}
    </span>
  );
}
