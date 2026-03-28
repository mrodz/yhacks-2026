'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/app-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Check, ChevronRight, FileText, Shield, Globe, Accessibility, Eye, Volume2, Type } from 'lucide-react';

const languages = [
  { code: 'es', name: 'Espa\u00f1ol', native: 'Spanish' },
  { code: 'zh', name: '\u4e2d\u6587', native: 'Chinese' },
  { code: 'vi', name: 'Ti\u1ebfng Vi\u1ec7t', native: 'Vietnamese' },
  { code: 'ko', name: '\ud55c\uad6d\uc5b4', native: 'Korean' },
  { code: 'tl', name: 'Tagalog', native: 'Filipino' },
  { code: 'ar', name: '\u0627\u0644\u0639\u0631\u0628\u064a\u0629', native: 'Arabic' },
  { code: 'hi', name: '\u0939\u093f\u0928\u094d\u0926\u0940', native: 'Hindi' },
  { code: 'pt', name: 'Portugu\u00eas', native: 'Portuguese' },
];

const countries = [
  { code: 'US', name: 'United States', states: ['California', 'Texas', 'New York', 'Florida', 'Illinois', 'Other'] },
  { code: 'CA', name: 'Canada', states: ['Ontario', 'British Columbia', 'Quebec', 'Alberta', 'Other'] },
  { code: 'UK', name: 'United Kingdom', states: [] },
  { code: 'AU', name: 'Australia', states: ['New South Wales', 'Victoria', 'Queensland', 'Other'] },
];

export function OnboardingWelcome() {
  const { setCurrentScreen } = useApp();
  
  return (
    <div className="flex flex-col min-h-screen bg-background p-6 safe-area-top safe-area-bottom">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center mb-6 mx-auto shadow-lg">
            <FileText className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">ClearSign</h1>
          <p className="text-lg text-muted-foreground">Understand Before You Sign</p>
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-4 mb-12 max-w-xs"
        >
          <FeatureItem icon={<Shield className="w-5 h-5" />} text="AI-powered document analysis" />
          <FeatureItem icon={<Globe className="w-5 h-5" />} text="Plain-language translations" />
          <FeatureItem icon={<Eye className="w-5 h-5" />} text="Risk highlighting and explanations" />
        </motion.div>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-muted-foreground text-sm max-w-xs leading-relaxed"
        >
          We help immigrants and non-native speakers understand legal documents before signing them.
        </motion.p>
      </div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Button 
          className="w-full h-14 text-lg rounded-xl shadow-md"
          onClick={() => setCurrentScreen('onboarding-language')}
        >
          Get Started
          <ChevronRight className="ml-2 w-5 h-5" />
        </Button>
      </motion.div>
    </div>
  );
}

function FeatureItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 text-left">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
      <span className="text-foreground">{text}</span>
    </div>
  );
}

export function OnboardingLanguage() {
  const { preferences, setPreferences, setCurrentScreen } = useApp();
  const [selected, setSelected] = useState(preferences.language);
  
  const handleContinue = () => {
    setPreferences({ ...preferences, language: selected });
    setCurrentScreen('onboarding-region');
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-background p-6 safe-area-top safe-area-bottom">
      <OnboardingHeader step={1} total={4} />
      
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-foreground mb-2">Choose your language</h2>
        <p className="text-muted-foreground mb-6">We will translate documents into this language</p>
        
        <div className="grid grid-cols-2 gap-3">
          {languages.map((lang) => (
            <motion.button
              key={lang.code}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelected(lang.code)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                selected === lang.code
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <span className="block text-lg font-medium text-foreground">{lang.name}</span>
              <span className="text-sm text-muted-foreground">{lang.native}</span>
              {selected === lang.code && (
                <Check className="absolute top-3 right-3 w-5 h-5 text-primary" />
              )}
            </motion.button>
          ))}
        </div>
      </div>
      
      <Button className="w-full h-14 text-lg rounded-xl" onClick={handleContinue}>
        Continue
        <ChevronRight className="ml-2 w-5 h-5" />
      </Button>
    </div>
  );
}

export function OnboardingRegion() {
  const { preferences, setPreferences, setCurrentScreen } = useApp();
  const [selectedCountry, setSelectedCountry] = useState(preferences.country);
  const [selectedState, setSelectedState] = useState(preferences.state || '');
  
  const currentCountry = countries.find(c => c.code === selectedCountry);
  
  const handleContinue = () => {
    setPreferences({ ...preferences, country: selectedCountry, state: selectedState });
    setCurrentScreen('onboarding-accessibility');
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-background p-6 safe-area-top safe-area-bottom">
      <OnboardingHeader step={2} total={4} />
      
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-foreground mb-2">Where are you located?</h2>
        <p className="text-muted-foreground mb-6">Legal terms depend on your location</p>
        
        <div className="space-y-3 mb-6">
          {countries.map((country) => (
            <motion.button
              key={country.code}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedCountry(country.code);
                setSelectedState('');
              }}
              className={`w-full p-4 rounded-xl border-2 text-left flex items-center justify-between transition-all ${
                selectedCountry === country.code
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <span className="font-medium text-foreground">{country.name}</span>
              {selectedCountry === country.code && (
                <Check className="w-5 h-5 text-primary" />
              )}
            </motion.button>
          ))}
        </div>
        
        {currentCountry && currentCountry.states.length > 0 && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <h3 className="text-lg font-medium text-foreground mb-3">Select your state/province</h3>
              <div className="grid grid-cols-2 gap-2">
                {currentCountry.states.map((state) => (
                  <button
                    key={state}
                    onClick={() => setSelectedState(state)}
                    className={`p-3 rounded-lg border text-sm transition-all ${
                      selectedState === state
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border bg-card text-foreground hover:border-primary/50'
                    }`}
                  >
                    {state}
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
      
      <Button className="w-full h-14 text-lg rounded-xl" onClick={handleContinue}>
        Continue
        <ChevronRight className="ml-2 w-5 h-5" />
      </Button>
    </div>
  );
}

export function OnboardingAccessibility() {
  const { preferences, setPreferences, setCurrentScreen } = useApp();
  const [audio, setAudio] = useState(preferences.audioEnabled);
  const [largerText, setLargerText] = useState(preferences.largerText);
  const [plainLanguage, setPlainLanguage] = useState(preferences.plainLanguageMode);
  
  const handleContinue = () => {
    setPreferences({ 
      ...preferences, 
      audioEnabled: audio, 
      largerText, 
      plainLanguageMode: plainLanguage 
    });
    setCurrentScreen('onboarding-auth');
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-background p-6 safe-area-top safe-area-bottom">
      <OnboardingHeader step={3} total={4} />
      
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-foreground mb-2">Accessibility preferences</h2>
        <p className="text-muted-foreground mb-6">Customize how the app works for you</p>
        
        <div className="space-y-4">
          <AccessibilityOption
            icon={<Volume2 className="w-5 h-5" />}
            title="Audio explanations"
            description="Listen to explanations instead of reading"
            checked={audio}
            onChange={setAudio}
          />
          <AccessibilityOption
            icon={<Type className="w-5 h-5" />}
            title="Larger text"
            description="Increase text size throughout the app"
            checked={largerText}
            onChange={setLargerText}
          />
          <AccessibilityOption
            icon={<Eye className="w-5 h-5" />}
            title="Plain language mode"
            description="Always show simple explanations first"
            checked={plainLanguage}
            onChange={setPlainLanguage}
          />
        </div>
      </div>
      
      <Button className="w-full h-14 text-lg rounded-xl" onClick={handleContinue}>
        Continue
        <ChevronRight className="ml-2 w-5 h-5" />
      </Button>
    </div>
  );
}

function AccessibilityOption({ 
  icon, 
  title, 
  description, 
  checked, 
  onChange 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  checked: boolean; 
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`w-full p-4 rounded-xl border-2 text-left flex items-start gap-4 transition-all ${
        checked ? 'border-primary bg-primary/5' : 'border-border bg-card'
      }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
        checked ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
      }`}>
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
        checked ? 'border-primary bg-primary' : 'border-muted'
      }`}>
        {checked && <Check className="w-4 h-4 text-primary-foreground" />}
      </div>
    </button>
  );
}

export function OnboardingAuth() {
  const { setCurrentScreen, setIsAuthenticated, setUserName } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  const handleSignUp = () => {
    setUserName(name || 'Guest');
    setIsAuthenticated(true);
    setCurrentScreen('home');
  };
  
  const handleSkip = () => {
    setUserName('Guest');
    setIsAuthenticated(true);
    setCurrentScreen('home');
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-background p-6 safe-area-top safe-area-bottom">
      <OnboardingHeader step={4} total={4} />
      
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-foreground mb-2">Create your account</h2>
        <p className="text-muted-foreground mb-6">Save your documents and preferences</p>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="h-14 rounded-xl text-lg"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="h-14 rounded-xl text-lg"
            />
          </div>
        </div>
        
        <Card className="mt-6 p-4 bg-primary/5 border-primary/20">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-foreground text-sm">Your privacy matters</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Your documents are encrypted and never shared. You control your data.
              </p>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="space-y-3">
        <Button className="w-full h-14 text-lg rounded-xl" onClick={handleSignUp}>
          Create Account
        </Button>
        <Button variant="ghost" className="w-full h-12" onClick={handleSkip}>
          Continue as Guest
        </Button>
      </div>
    </div>
  );
}

function OnboardingHeader({ step, total }: { step: number; total: number }) {
  return (
    <div className="mb-8">
      <div className="flex gap-2 mb-4">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i < step ? 'bg-primary' : 'bg-border'
            }`}
          />
        ))}
      </div>
      <p className="text-sm text-muted-foreground">Step {step} of {total}</p>
    </div>
  );
}
