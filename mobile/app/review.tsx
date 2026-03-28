import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function ReviewScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: '600', color: colors.foreground, marginLeft: 8 }}>
          Document Review
        </Text>
      </View>

      <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={{ alignItems: 'center', marginBottom: 48 }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 24,
              backgroundColor: colors.primary + '18',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 24,
            }}
          >
            <Ionicons name="document-text" size={40} color={colors.primary} />
          </View>
          <Text style={{ fontSize: 24, fontWeight: '700', color: colors.foreground, textAlign: 'center', marginBottom: 8 }}>
            Translation & Risks
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={{ gap: 16 }}>
          <Button size="lg" onPress={() => router.push('/sign')} style={{ width: '100%' }}>
            <Ionicons name="pencil" size={20} color={colors.primaryForeground} style={{ marginRight: 8 }} />
            <Text style={{ fontSize: 17, fontWeight: '600', color: colors.primaryForeground }}>Go to Sign</Text>
          </Button>

          <Button size="lg" variant="outline" onPress={() => router.push('/export')} style={{ width: '100%' }}>
            <Text style={{ fontSize: 17, fontWeight: '600', color: colors.foreground }}>Export Instead</Text>
          </Button>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
