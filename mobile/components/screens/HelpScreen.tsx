import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { glossaryTerms } from '@/lib/mock-data';

export default function HelpScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const faqItems = [
    {
      question: 'Is this legal advice?',
      answer: 'No. ClearSign provides educational information to help you understand documents. Always consult a licensed attorney for legal advice.',
    },
    {
      question: 'How accurate are the translations?',
      answer: 'We use advanced AI for translations. While highly accurate, we recommend verifying critical details with a professional translator.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes. Your documents are encrypted in transit and at rest. We never share your data with third parties.',
    },
    {
      question: 'Can I use this for any document?',
      answer: 'ClearSign works best with legal documents like leases, employment contracts, and medical consent forms.',
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 12 }}>
        <Text style={{ fontSize: 26, fontWeight: '700', color: colors.foreground }}>Help</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
      >
        {/* FAQ */}
        <Text style={{ fontSize: 14, fontWeight: '500', color: colors.mutedForeground, marginBottom: 12 }}>
          Frequently Asked Questions
        </Text>
        <Card style={{ marginBottom: 24 }}>
          {faqItems.map((item, index) => (
            <View
              key={index}
              style={{
                padding: 16,
                borderBottomWidth: index < faqItems.length - 1 ? 1 : 0,
                borderBottomColor: colors.border,
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: '600', color: colors.foreground, marginBottom: 6 }}>
                {item.question}
              </Text>
              <Text style={{ fontSize: 13, color: colors.mutedForeground, lineHeight: 18 }}>
                {item.answer}
              </Text>
            </View>
          ))}
        </Card>

        {/* Glossary */}
        <Text style={{ fontSize: 14, fontWeight: '500', color: colors.mutedForeground, marginBottom: 12 }}>
          Legal Glossary
        </Text>
        <View style={{ gap: 10 }}>
          {glossaryTerms.slice(0, 5).map((term) => (
            <Card key={term.term} style={{ padding: 16 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.foreground, marginBottom: 4 }}>
                {term.term}
              </Text>
              <Text style={{ fontSize: 13, color: colors.mutedForeground, lineHeight: 18 }}>
                {term.definition}
              </Text>
            </Card>
          ))}
        </View>

        {/* Emergency Resources */}
        <Text style={{ fontSize: 14, fontWeight: '500', color: colors.mutedForeground, marginBottom: 12, marginTop: 24 }}>
          Emergency Resources
        </Text>
        <Card style={{ padding: 16, backgroundColor: colors.riskHighBg }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
            <Ionicons name="call" size={20} color={colors.riskHigh} style={{ marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: '600', color: colors.foreground }}>
                Need immediate legal help?
              </Text>
              <Text style={{ fontSize: 13, color: colors.mutedForeground, marginTop: 4, lineHeight: 18 }}>
                Contact your local Legal Aid Society or call 211 for free legal referrals.
              </Text>
              <TouchableOpacity
                onPress={() => Linking.openURL('tel:211')}
                style={{ marginTop: 8 }}
              >
                <Text style={{ fontSize: 14, color: colors.primary, fontWeight: '600' }}>
                  Call 211 →
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
