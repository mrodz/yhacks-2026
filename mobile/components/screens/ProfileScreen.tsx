import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/lib/app-context';
import { useRouter } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

const languageNames: Record<string, string> = {
  es: 'Spanish', zh: 'Chinese', vi: 'Vietnamese', ko: 'Korean',
  tl: 'Tagalog', ar: 'Arabic', hi: 'Hindi', pt: 'Portuguese',
};

interface SettingRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value?: string;
  onPress?: () => void;
  isLast?: boolean;
}

function SettingRow({ icon, title, value, onPress, isLast }: SettingRowProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        padding: 16,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: colors.border,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          backgroundColor: colors.primary + '15',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: '500', color: colors.foreground }}>{title}</Text>
      </View>
      {value ? (
        <Text style={{ fontSize: 14, color: colors.mutedForeground }}>{value}</Text>
      ) : null}
      <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
    </TouchableOpacity>
  );
}

interface SettingToggleProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  isLast?: boolean;
}

function SettingToggle({ icon, title, description, enabled, onToggle, isLast }: SettingToggleProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        padding: 16,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: colors.border,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          backgroundColor: enabled ? colors.primary : colors.muted,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name={icon} size={20} color={enabled ? colors.primaryForeground : colors.mutedForeground} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: '500', color: colors.foreground }}>{title}</Text>
        <Text style={{ fontSize: 12, color: colors.mutedForeground }}>{description}</Text>
      </View>
      <Switch
        value={enabled}
        onValueChange={onToggle}
        trackColor={{ false: colors.muted, true: colors.primary }}
        thumbColor="#fff"
      />
    </View>
  );
}

export default function ProfileScreen() {
  const { userName, preferences, setPreferences, logout, auth } = useApp();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const toggleSetting = (key: 'audioEnabled' | 'largerText' | 'plainLanguageMode') => {
    setPreferences({ ...preferences, [key]: !preferences[key] });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 12 }}>
          <Text style={{ fontSize: 26, fontWeight: '700', color: colors.foreground }}>Settings</Text>
        </View>

        {/* Profile Card */}
        <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
          <Card style={{ padding: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: colors.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="person" size={32} color={colors.primaryForeground} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 18, fontWeight: '600', color: colors.foreground }}>
                  {userName || 'Guest'}
                </Text>
                <Text style={{ fontSize: 14, color: colors.mutedForeground }}>
                  {preferences.state ? `${preferences.state}, ` : ''}{preferences.country}
                </Text>
                {auth.user && (
                  <Text style={{ fontSize: 12, color: colors.mutedForeground, marginTop: 2 }}>
                    {auth.user.schoolName}
                  </Text>
                )}
              </View>
              <Button variant="outline" size="sm">
                <Text style={{ fontSize: 13, color: colors.foreground }}>Edit</Text>
              </Button>
            </View>
          </Card>
        </View>

        {/* Language & Region */}
        <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
          <Text style={{ fontSize: 13, fontWeight: '500', color: colors.mutedForeground, marginBottom: 8, marginLeft: 4 }}>
            Language & Region
          </Text>
          <Card>
            <SettingRow icon="globe" title="Translation Language" value={languageNames[preferences.language] || preferences.language} />
            <SettingRow icon="location" title="Location" value={preferences.state ? `${preferences.state}, ${preferences.country}` : preferences.country} isLast />
          </Card>
        </View>

        {/* Accessibility */}
        <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
          <Text style={{ fontSize: 13, fontWeight: '500', color: colors.mutedForeground, marginBottom: 8, marginLeft: 4 }}>
            Accessibility
          </Text>
          <Card>
            <SettingToggle
              icon="volume-high"
              title="Audio Explanations"
              description="Listen to explanations"
              enabled={preferences.audioEnabled}
              onToggle={() => toggleSetting('audioEnabled')}
            />
            <SettingToggle
              icon="text"
              title="Larger Text"
              description="Increase text size"
              enabled={preferences.largerText}
              onToggle={() => toggleSetting('largerText')}
            />
            <SettingToggle
              icon="eye"
              title="Plain Language Mode"
              description="Show simple explanations first"
              enabled={preferences.plainLanguageMode}
              onToggle={() => toggleSetting('plainLanguageMode')}
              isLast
            />
          </Card>
        </View>

        {/* Account */}
        <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
          <Text style={{ fontSize: 13, fontWeight: '500', color: colors.mutedForeground, marginBottom: 8, marginLeft: 4 }}>
            Account
          </Text>
          <Card>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                logout();
                router.replace('/');
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
                padding: 16,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: colors.destructive + '15',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="log-out" size={20} color={colors.destructive} />
              </View>
              <Text style={{ fontSize: 15, fontWeight: '500', color: colors.destructive }}>Sign Out</Text>
            </TouchableOpacity>
          </Card>
        </View>

        {/* App Info */}
        <View style={{ alignItems: 'center', paddingHorizontal: 24 }}>
          <Text style={{ fontSize: 13, color: colors.mutedForeground }}>ClearSign v1.0.0</Text>
          <Text style={{ fontSize: 11, color: colors.mutedForeground, marginTop: 4, textAlign: 'center' }}>
            This app provides educational information only and is not legal advice.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
