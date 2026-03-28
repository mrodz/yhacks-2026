'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/lib/app-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  User,
  Globe,
  MapPin,
  Volume2,
  Type,
  Eye,
  Pen,
  Shield,
  Bell,
  LogOut,
  ChevronRight,
  Moon,
  Sun
} from 'lucide-react';

const languages: Record<string, string> = {
  es: 'Spanish',
  zh: 'Chinese',
  vi: 'Vietnamese',
  ko: 'Korean',
  tl: 'Tagalog',
  ar: 'Arabic',
  hi: 'Hindi',
  pt: 'Portuguese',
};

export function ProfileScreen() {
  const { 
    userName, 
    preferences, 
    setPreferences, 
    setIsAuthenticated, 
    setCurrentScreen 
  } = useApp();
  const [darkMode, setDarkMode] = useState(false);
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentScreen('onboarding-welcome');
  };
  
  const toggleSetting = (key: 'audioEnabled' | 'largerText' | 'plainLanguageMode') => {
    setPreferences({
      ...preferences,
      [key]: !preferences[key]
    });
  };
  
  return (
    <div className="min-h-screen bg-background pb-24 safe-area-top">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
      </div>
      
      {/* Profile Card */}
      <div className="px-6 mb-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-lg text-foreground">{userName || 'Guest'}</h2>
              <p className="text-sm text-muted-foreground">
                {preferences.state ? `${preferences.state}, ` : ''}{preferences.country}
              </p>
            </div>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </div>
        </Card>
      </div>
      
      {/* Language & Region */}
      <div className="px-6 mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3 px-1">Language & Region</h3>
        <Card>
          <SettingRow
            icon={<Globe className="w-5 h-5" />}
            title="Translation Language"
            value={languages[preferences.language] || preferences.language}
            onClick={() => {}}
          />
          <SettingRow
            icon={<MapPin className="w-5 h-5" />}
            title="Location"
            value={preferences.state ? `${preferences.state}, ${preferences.country}` : preferences.country}
            onClick={() => {}}
            isLast
          />
        </Card>
      </div>
      
      {/* Accessibility */}
      <div className="px-6 mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3 px-1">Accessibility</h3>
        <Card>
          <SettingToggle
            icon={<Volume2 className="w-5 h-5" />}
            title="Audio Explanations"
            description="Listen to explanations"
            enabled={preferences.audioEnabled}
            onToggle={() => toggleSetting('audioEnabled')}
          />
          <SettingToggle
            icon={<Type className="w-5 h-5" />}
            title="Larger Text"
            description="Increase text size"
            enabled={preferences.largerText}
            onToggle={() => toggleSetting('largerText')}
          />
          <SettingToggle
            icon={<Eye className="w-5 h-5" />}
            title="Plain Language Mode"
            description="Show simple explanations first"
            enabled={preferences.plainLanguageMode}
            onToggle={() => toggleSetting('plainLanguageMode')}
            isLast
          />
        </Card>
      </div>
      
      {/* Signature */}
      <div className="px-6 mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3 px-1">Signature</h3>
        <Card>
          <SettingRow
            icon={<Pen className="w-5 h-5" />}
            title="Saved Signature"
            value="Not set"
            onClick={() => {}}
            isLast
          />
        </Card>
      </div>
      
      {/* App Settings */}
      <div className="px-6 mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3 px-1">App Settings</h3>
        <Card>
          <SettingToggle
            icon={darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            title="Dark Mode"
            description="Switch to dark theme"
            enabled={darkMode}
            onToggle={() => setDarkMode(!darkMode)}
          />
          <SettingRow
            icon={<Bell className="w-5 h-5" />}
            title="Notifications"
            value="Enabled"
            onClick={() => {}}
          />
          <SettingRow
            icon={<Shield className="w-5 h-5" />}
            title="Privacy"
            value=""
            onClick={() => {}}
            isLast
          />
        </Card>
      </div>
      
      {/* Account */}
      <div className="px-6 mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3 px-1">Account</h3>
        <Card>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 p-4 text-left hover:bg-muted transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <LogOut className="w-5 h-5 text-destructive" />
            </div>
            <span className="font-medium text-destructive">Sign Out</span>
          </button>
        </Card>
      </div>
      
      {/* App Info */}
      <div className="px-6 text-center">
        <p className="text-sm text-muted-foreground">ClearSign v1.0.0</p>
        <p className="text-xs text-muted-foreground mt-1">
          This app provides educational information only and is not legal advice.
        </p>
      </div>
    </div>
  );
}

function SettingRow({ 
  icon, 
  title, 
  value, 
  onClick, 
  isLast = false 
}: { 
  icon: React.ReactNode; 
  title: string; 
  value: string; 
  onClick: () => void;
  isLast?: boolean;
}) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 text-left hover:bg-muted transition-colors ${
        !isLast ? 'border-b border-border' : ''
      }`}
    >
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
      <div className="flex-1">
        <span className="font-medium text-foreground">{title}</span>
      </div>
      {value && (
        <span className="text-sm text-muted-foreground">{value}</span>
      )}
      <ChevronRight className="w-5 h-5 text-muted-foreground" />
    </button>
  );
}

function SettingToggle({ 
  icon, 
  title, 
  description, 
  enabled, 
  onToggle,
  isLast = false 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  enabled: boolean;
  onToggle: () => void;
  isLast?: boolean;
}) {
  return (
    <button 
      onClick={onToggle}
      className={`w-full flex items-center gap-4 p-4 text-left hover:bg-muted transition-colors ${
        !isLast ? 'border-b border-border' : ''
      }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
        enabled ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
      }`}>
        {icon}
      </div>
      <div className="flex-1">
        <span className="font-medium text-foreground block">{title}</span>
        <span className="text-sm text-muted-foreground">{description}</span>
      </div>
      <div className={`w-12 h-7 rounded-full p-1 transition-colors ${
        enabled ? 'bg-primary' : 'bg-muted'
      }`}>
        <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`} />
      </div>
    </button>
  );
}
