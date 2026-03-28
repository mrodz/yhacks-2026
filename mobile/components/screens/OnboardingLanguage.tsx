import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/lib/app-context';
import { Button } from '@/components/ui/Button';
import { OnboardingHeader } from './OnboardingHeader';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

const languages = [
  { code: 'es', name: 'Español', native: 'Spanish' },
  { code: 'zh', name: '中文', native: 'Chinese' },
  { code: 'vi', name: 'Tiếng Việt', native: 'Vietnamese' },
  { code: 'ko', name: '한국어', native: 'Korean' },
  { code: 'tl', name: 'Tagalog', native: 'Filipino' },
  { code: 'ar', name: 'العربية', native: 'Arabic' },
  { code: 'hi', name: 'हिन्दी', native: 'Hindi' },
  { code: 'pt', name: 'Português', native: 'Portuguese' },
];

export default function OnboardingLanguage() {
  const { preferences, setPreferences, setCurrentScreen } = useApp();
  const [selected, setSelected] = useState(preferences.language);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const handleContinue = () => {
    setPreferences({ ...preferences, language: selected });
    setCurrentScreen('onboarding-region');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, paddingHorizontal: 24 }}>
        <OnboardingHeader step={1} total={4} />

        <Text style={{ fontSize: 26, fontWeight: '700', color: colors.foreground, marginBottom: 8 }}>
          Choose your language
        </Text>
        <Text style={{ fontSize: 15, color: colors.mutedForeground, marginBottom: 24 }}>
          We'll translate documents into this language
        </Text>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {languages.map((lang) => {
              const isSelected = selected === lang.code;
              return (
                <TouchableOpacity
                  key={lang.code}
                  activeOpacity={0.7}
                  onPress={() => setSelected(lang.code)}
                  style={{
                    width: '47%',
                    padding: 16,
                    borderRadius: 14,
                    borderWidth: 2,
                    borderColor: isSelected ? colors.primary : colors.border,
                    backgroundColor: isSelected ? colors.primary + '08' : colors.card,
                  }}
                >
                  <Text style={{ fontSize: 18, fontWeight: '600', color: colors.foreground }}>
                    {lang.name}
                  </Text>
                  <Text style={{ fontSize: 13, color: colors.mutedForeground, marginTop: 2 }}>
                    {lang.native}
                  </Text>
                  {isSelected && (
                    <View style={{ position: 'absolute', top: 12, right: 12 }}>
                      <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
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
