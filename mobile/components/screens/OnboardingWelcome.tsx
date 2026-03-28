import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/lib/app-context';
import { Button } from '@/components/ui/Button';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

function FeatureItem({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 14,
          backgroundColor: colors.primary + '18',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name={icon} size={22} color={colors.primary} />
      </View>
      <Text style={{ fontSize: 16, color: colors.foreground, flex: 1 }}>{text}</Text>
    </View>
  );
}

export default function OnboardingWelcome() {
  const { setCurrentScreen } = useApp();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, paddingHorizontal: 24, justifyContent: 'center' }}>
        <View style={{ alignItems: 'center', marginBottom: 48 }}>
          <Animated.View entering={FadeIn.duration(500)}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 24,
                backgroundColor: colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 8,
              }}
            >
              <Ionicons name="document-text" size={40} color={colors.primaryForeground} />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(100).duration(500)}>
            <Text
              style={{
                fontSize: 32,
                fontWeight: '700',
                color: colors.foreground,
                textAlign: 'center',
                marginBottom: 8,
              }}
            >
              ClearSign
            </Text>
            <Text
              style={{
                fontSize: 18,
                color: colors.mutedForeground,
                textAlign: 'center',
              }}
            >
              Understand Before You Sign
            </Text>
          </Animated.View>
        </View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={{ gap: 16, marginBottom: 48 }}>
          <FeatureItem icon="shield-checkmark" text="AI-powered document analysis" />
          <FeatureItem icon="globe" text="Plain-language translations" />
          <FeatureItem icon="eye" text="Risk highlighting and explanations" />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <Text
            style={{
              fontSize: 14,
              color: colors.mutedForeground,
              textAlign: 'center',
              lineHeight: 20,
              paddingHorizontal: 16,
            }}
          >
            We help immigrants and non-native speakers understand legal documents before
            signing them.
          </Text>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInDown.delay(600).duration(500)} style={{ paddingHorizontal: 24, paddingBottom: 16 }}>
        <Button
          size="lg"
          onPress={() => setCurrentScreen('onboarding-language')}
          style={{ width: '100%' }}
        >
          <Text style={{ fontSize: 17, fontWeight: '600', color: colors.primaryForeground }}>
            Get Started
          </Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.primaryForeground}
            style={{ marginLeft: 8 }}
          />
        </Button>
      </Animated.View>
    </SafeAreaView>
  );
}
