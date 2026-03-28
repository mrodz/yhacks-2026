import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/lib/app-context';
import { Button } from '@/components/ui/Button';
import { OnboardingHeader } from './OnboardingHeader';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface AccessibilityOptionProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function AccessibilityOption({ icon, title, description, checked, onChange }: AccessibilityOptionProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onChange(!checked)}
      style={{
        padding: 16,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: checked ? colors.primary : colors.border,
        backgroundColor: checked ? colors.primary + '08' : colors.card,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 14,
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 14,
          backgroundColor: checked ? colors.primary : colors.muted,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons
          name={icon}
          size={22}
          color={checked ? colors.primaryForeground : colors.mutedForeground}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: '500', color: colors.foreground }}>
          {title}
        </Text>
        <Text style={{ fontSize: 13, color: colors.mutedForeground, marginTop: 2 }}>
          {description}
        </Text>
      </View>
      <View
        style={{
          width: 26,
          height: 26,
          borderRadius: 13,
          borderWidth: 2,
          borderColor: checked ? colors.primary : colors.muted,
          backgroundColor: checked ? colors.primary : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {checked && <Ionicons name="checkmark" size={16} color={colors.primaryForeground} />}
      </View>
    </TouchableOpacity>
  );
}

export default function OnboardingAccessibility() {
  const { preferences, setPreferences, setCurrentScreen } = useApp();
  const [audio, setAudio] = useState(preferences.audioEnabled);
  const [largerText, setLargerText] = useState(preferences.largerText);
  const [plainLanguage, setPlainLanguage] = useState(preferences.plainLanguageMode);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const handleContinue = () => {
    setPreferences({
      ...preferences,
      audioEnabled: audio,
      largerText,
      plainLanguageMode: plainLanguage,
    });
    setCurrentScreen('onboarding-auth');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, paddingHorizontal: 24 }}>
        <OnboardingHeader step={3} total={4} />

        <Text style={{ fontSize: 26, fontWeight: '700', color: colors.foreground, marginBottom: 8 }}>
          Accessibility preferences
        </Text>
        <Text style={{ fontSize: 15, color: colors.mutedForeground, marginBottom: 24 }}>
          Customize how the app works for you
        </Text>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
          <AccessibilityOption
            icon="volume-high"
            title="Audio explanations"
            description="Listen to explanations instead of reading"
            checked={audio}
            onChange={setAudio}
          />
          <AccessibilityOption
            icon="text"
            title="Larger text"
            description="Increase text size throughout the app"
            checked={largerText}
            onChange={setLargerText}
          />
          <AccessibilityOption
            icon="eye"
            title="Plain language mode"
            description="Always show simple explanations first"
            checked={plainLanguage}
            onChange={setPlainLanguage}
          />
        </ScrollView>
      </View>

      <View style={{ paddingHorizontal: 24, paddingBottom: 16 }}>
        <Button size="lg" onPress={handleContinue} style={{ width: '100%' }}>
          <Text style={{ fontSize: 17, fontWeight: '600', color: colors.primaryForeground }}>Continue</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.primaryForeground} style={{ marginLeft: 8 }} />
        </Button>
      </View>
    </SafeAreaView>
  );
}
