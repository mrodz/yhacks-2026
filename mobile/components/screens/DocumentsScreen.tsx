import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/lib/app-context';
import { useRouter } from 'expo-router';
import { Card } from '@/components/ui/Card';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function DocumentsScreen() {
  const { documents, setCurrentDocument, setCurrentScreen } = useApp();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
    'needs-review': { label: 'Needs Review', bg: colors.riskMedium + '18', text: colors.riskMedium },
    reviewed: { label: 'Reviewed', bg: colors.info + '18', text: colors.info },
    signed: { label: 'Signed', bg: colors.safe + '18', text: colors.safe },
    exported: { label: 'Exported', bg: colors.safe + '18', text: colors.safe },
    processing: { label: 'Processing', bg: colors.muted, text: colors.mutedForeground },
  };

  const typeIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
    lease: 'home',
    employment: 'briefcase',
    medical: 'heart',
    school: 'school',
    other: 'document-text',
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 12 }}>
        <Text style={{ fontSize: 26, fontWeight: '700', color: colors.foreground }}>Documents</Text>
        <Text style={{ fontSize: 14, color: colors.mutedForeground, marginTop: 4 }}>
          {documents.length} document{documents.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100, gap: 10 }}
      >
        {documents.map((doc) => {
          const status = statusConfig[doc.status] || statusConfig.processing;
          return (
            <TouchableOpacity
              key={doc.id}
              activeOpacity={0.7}
              onPress={() => {
                setCurrentDocument(doc);
                router.push('/review');
              }}
            >
              <Card style={{ padding: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      backgroundColor: colors.primary + '12',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name={typeIcons[doc.type] || 'document-text'} size={22} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: '500', color: colors.foreground }} numberOfLines={1}>
                      {doc.title}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                      <Text style={{ fontSize: 12, color: colors.mutedForeground }}>
                        {formatDate(doc.uploadDate)}
                      </Text>
                      <View style={{ backgroundColor: status.bg, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 }}>
                        <Text style={{ fontSize: 11, color: status.text, fontWeight: '500' }}>{status.label}</Text>
                      </View>
                    </View>
                    {doc.riskCount.high > 0 && (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                        <Ionicons name="alert-circle" size={12} color={colors.riskHigh} />
                        <Text style={{ fontSize: 11, color: colors.riskHigh }}>
                          {doc.riskCount.high} high risk clause{doc.riskCount.high !== 1 ? 's' : ''}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
                </View>
              </Card>
            </TouchableOpacity>
          );
        })}

        {documents.length === 0 && (
          <View style={{ alignItems: 'center', paddingTop: 60 }}>
            <Ionicons name="folder-open-outline" size={64} color={colors.muted} />
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.foreground, marginTop: 16 }}>
              No documents yet
            </Text>
            <Text style={{ fontSize: 14, color: colors.mutedForeground, marginTop: 4, textAlign: 'center' }}>
              Scan or upload a document to get started
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
