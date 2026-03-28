import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/lib/app-context';
import { useRouter } from 'expo-router';
import { Card } from '@/components/ui/Card';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import Animated, { FadeIn, FadeInDown, FadeInLeft } from 'react-native-reanimated';

const educationalCards = [
  { id: '1', title: 'What is arbitration?', icon: 'scale' as const },
  { id: '2', title: 'Before signing a lease', icon: 'home' as const },
  { id: '3', title: 'Employment contracts', icon: 'briefcase' as const },
  { id: '4', title: 'Medical consent forms', icon: 'heart' as const },
];

function StatusBadge({ status }: { status: string }) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const config: Record<string, { label: string; bg: string; text: string }> = {
    'needs-review': { label: 'Needs Review', bg: colors.riskMedium + '18', text: colors.riskMedium },
    reviewed: { label: 'Reviewed', bg: colors.info + '18', text: colors.info },
    signed: { label: 'Signed', bg: colors.safe + '18', text: colors.safe },
    exported: { label: 'Exported', bg: colors.safe + '18', text: colors.safe },
    processing: { label: 'Processing', bg: colors.muted, text: colors.mutedForeground },
  };

  const { label, bg, text } = config[status] || config['processing'];

  return (
    <View style={{ backgroundColor: bg, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 }}>
      <Text style={{ fontSize: 11, color: text, fontWeight: '500' }}>{label}</Text>
    </View>
  );
}

function formatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function HomeScreen() {
  const { userName, documents, setCurrentScreen, setCurrentDocument } = useApp();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const pendingDocuments = documents.filter((d) => d.status === 'needs-review');
  const recentDocuments = documents.slice(0, 3);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <Animated.View entering={FadeIn.duration(400)} style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 12 }}>
          <Text style={{ fontSize: 15, color: colors.mutedForeground }}>{getGreeting()}</Text>
          <Text style={{ fontSize: 26, fontWeight: '700', color: colors.foreground }}>
            {userName || 'Welcome back'}
          </Text>
        </Animated.View>

        {/* Main Actions */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={{ paddingHorizontal: 24, marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push('/scan-choice')}
              style={{ flex: 1 }}
            >
              <Card style={{ padding: 20, backgroundColor: colors.primary, borderColor: colors.primary }}>
                <Ionicons name="camera" size={32} color={colors.primaryForeground} />
                <Text style={{ fontSize: 18, fontWeight: '600', color: colors.primaryForeground, marginTop: 12 }}>
                  Scan Document
                </Text>
                <Text style={{ fontSize: 13, color: colors.primaryForeground, opacity: 0.85, marginTop: 4 }}>
                  Use your camera
                </Text>
              </Card>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push('/upload')}
              style={{ flex: 1 }}
            >
              <Card style={{ padding: 20 }}>
                <Ionicons name="cloud-upload" size={32} color={colors.primary} />
                <Text style={{ fontSize: 18, fontWeight: '600', color: colors.foreground, marginTop: 12 }}>
                  Upload PDF
                </Text>
                <Text style={{ fontSize: 13, color: colors.mutedForeground, marginTop: 4 }}>
                  From your files
                </Text>
              </Card>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Pending Review */}
        {pendingDocuments.length > 0 && (
          <Animated.View entering={FadeInDown.delay(200).duration(400)} style={{ paddingHorizontal: 24, marginBottom: 24 }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setCurrentDocument(pendingDocuments[0]);
                router.push('/review');
              }}
            >
              <Card
                style={{
                  padding: 16,
                  borderLeftWidth: 4,
                  borderLeftColor: colors.riskMedium,
                  backgroundColor: colors.riskMediumBg,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 14 }}>
                  <View
                    style={{
                      width: 48,
                      height: 64,
                      backgroundColor: colors.card,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: colors.border,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name="document-text" size={24} color={colors.mutedForeground} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', gap: 8, marginBottom: 4 }}>
                      <View
                        style={{
                          backgroundColor: colors.riskMedium,
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                          borderRadius: 10,
                        }}
                      >
                        <Text style={{ fontSize: 11, color: '#fff', fontWeight: '600' }}>Needs Review</Text>
                      </View>
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: '500', color: colors.foreground }}>
                      {pendingDocuments[0].title}
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 12, marginTop: 4 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Ionicons name="alert-circle" size={14} color={colors.riskHigh} />
                        <Text style={{ fontSize: 12, color: colors.mutedForeground }}>
                          {pendingDocuments[0].riskCount.high} high risk
                        </Text>
                      </View>
                      <Text style={{ fontSize: 12, color: colors.mutedForeground }}>
                        {pendingDocuments[0].pages} pages
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} />
                </View>
              </Card>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Recent Documents */}
        <Animated.View entering={FadeInDown.delay(250).duration(400)} style={{ paddingHorizontal: 24, marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 17, fontWeight: '600', color: colors.foreground }}>Recent Documents</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/documents')}>
              <Text style={{ fontSize: 14, color: colors.primary, fontWeight: '500' }}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={{ gap: 10 }}>
            {recentDocuments.map((doc, index) => (
              <Animated.View key={doc.id} entering={FadeInLeft.delay(300 + index * 50).duration(300)}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    setCurrentDocument(doc);
                    router.push('/review');
                  }}
                >
                  <Card style={{ padding: 14 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 10,
                          backgroundColor: colors.muted,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Ionicons name="document-text" size={20} color={colors.mutedForeground} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 15, fontWeight: '500', color: colors.foreground }} numberOfLines={1}>
                          {doc.title}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 }}>
                          <Ionicons name="time-outline" size={12} color={colors.mutedForeground} />
                          <Text style={{ fontSize: 12, color: colors.mutedForeground }}>
                            {formatDate(doc.uploadDate)}
                          </Text>
                          <StatusBadge status={doc.status} />
                        </View>
                      </View>
                      <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
                    </View>
                  </Card>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Educational Cards */}
        <Animated.View entering={FadeInDown.delay(400).duration(400)} style={{ paddingHorizontal: 24 }}>
          <Text style={{ fontSize: 17, fontWeight: '600', color: colors.foreground, marginBottom: 12 }}>Learn</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
            {educationalCards.map((card) => (
              <TouchableOpacity key={card.id} activeOpacity={0.8}>
                <Card style={{ width: 160, padding: 16 }}>
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      backgroundColor: colors.primary + '18',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 12,
                    }}
                  >
                    <Ionicons name={card.icon as any} size={20} color={colors.primary} />
                  </View>
                  <Text style={{ fontSize: 14, fontWeight: '500', color: colors.foreground, lineHeight: 18 }}>
                    {card.title}
                  </Text>
                </Card>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
