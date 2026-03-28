import React from 'react';
import { View, Text } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface OnboardingHeaderProps {
  step: number;
  total: number;
}

export function OnboardingHeader({ step, total }: OnboardingHeaderProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <View style={{ marginBottom: 32 }}>
      <View style={{ flexDirection: 'row', gap: 6, marginBottom: 12 }}>
        {Array.from({ length: total }).map((_, i) => (
          <View
            key={i}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              backgroundColor: i < step ? colors.primary : colors.border,
            }}
          />
        ))}
      </View>
      <Text style={{ fontSize: 13, color: colors.mutedForeground }}>
        Step {step} of {total}
      </Text>
    </View>
  );
}
