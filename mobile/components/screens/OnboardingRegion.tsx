import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/lib/app-context';
import { Button } from '@/components/ui/Button';
import { OnboardingHeader } from './OnboardingHeader';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

const countries = [
  { code: 'US', name: 'United States', states: ['California', 'Texas', 'New York', 'Florida', 'Illinois', 'Other'] },
  { code: 'CA', name: 'Canada', states: ['Ontario', 'British Columbia', 'Quebec', 'Alberta', 'Other'] },
  { code: 'UK', name: 'United Kingdom', states: [] },
  { code: 'AU', name: 'Australia', states: ['New South Wales', 'Victoria', 'Queensland', 'Other'] },
];

export default function OnboardingRegion() {
  const { preferences, setPreferences, setCurrentScreen } = useApp();
  const [selectedCountry, setSelectedCountry] = useState(preferences.country);
  const [selectedState, setSelectedState] = useState(preferences.state || '');
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const currentCountry = countries.find((c) => c.code === selectedCountry);

  const handleContinue = () => {
    setPreferences({ ...preferences, country: selectedCountry, state: selectedState });
    setCurrentScreen('onboarding-accessibility');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, paddingHorizontal: 24 }}>
        <OnboardingHeader step={2} total={4} />

        <Text style={{ fontSize: 26, fontWeight: '700', color: colors.foreground, marginBottom: 8 }}>
          Where are you located?
        </Text>
        <Text style={{ fontSize: 15, color: colors.mutedForeground, marginBottom: 24 }}>
          Legal terms depend on your location
        </Text>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
          <View style={{ gap: 12, marginBottom: 24 }}>
            {countries.map((country) => {
              const isSelected = selectedCountry === country.code;
              return (
                <TouchableOpacity
                  key={country.code}
                  activeOpacity={0.7}
                  onPress={() => {
                    setSelectedCountry(country.code);
                    setSelectedState('');
                  }}
                  style={{
                    padding: 16,
                    borderRadius: 14,
                    borderWidth: 2,
                    borderColor: isSelected ? colors.primary : colors.border,
                    backgroundColor: isSelected ? colors.primary + '08' : colors.card,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: '500', color: colors.foreground }}>
                    {country.name}
                  </Text>
                  {isSelected && <Ionicons name="checkmark-circle" size={22} color={colors.primary} />}
                </TouchableOpacity>
              );
            })}
          </View>

          {currentCountry && currentCountry.states.length > 0 && (
            <View>
              <Text style={{ fontSize: 18, fontWeight: '600', color: colors.foreground, marginBottom: 12 }}>
                Select your state/province
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {currentCountry.states.map((state) => {
                  const isSelected = selectedState === state;
                  return (
                    <TouchableOpacity
                      key={state}
                      activeOpacity={0.7}
                      onPress={() => setSelectedState(state)}
                      style={{
                        paddingVertical: 10,
                        paddingHorizontal: 16,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: isSelected ? colors.primary : colors.border,
                        backgroundColor: isSelected ? colors.primary + '08' : colors.card,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          color: isSelected ? colors.primary : colors.foreground,
                        }}
                      >
                        {state}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}
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
