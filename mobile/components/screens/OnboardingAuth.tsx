import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/lib/app-context';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { OnboardingHeader } from './OnboardingHeader';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

type AuthStep = 'signup' | 'verify';

export default function OnboardingAuth() {
  const { setCurrentScreen, auth, initiateSignUp, confirmSignUp, skipAuth, clearAuthError } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<AuthStep>('signup');
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Missing fields', 'Please fill in all fields.');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Weak password', 'Password must be at least 8 characters.');
      return;
    }

    clearAuthError();
    const success = await initiateSignUp(name.trim(), email.trim(), password);
    
    if (success) {
      // Move to verification step
      setStep('verify');
    } else if (auth.error) {
      Alert.alert('Sign Up Error', auth.error);
    }
  };

  const handleVerify = async () => {
    if (!verificationCode.trim()) {
      Alert.alert('Missing code', 'Please enter the verification code.');
      return;
    }

    clearAuthError();
    const success = await confirmSignUp(verificationCode.trim());

    if (success) {
      setCurrentScreen('home');
    } else if (auth.error) {
      Alert.alert('Verification Error', auth.error);
    }
  };

  const handleSkip = () => {
    skipAuth();
    setCurrentScreen('home');
  };

  if (step === 'verify') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={{ flex: 1, paddingHorizontal: 24 }}>
            <OnboardingHeader step={4} total={4} />

            <Text style={{ fontSize: 26, fontWeight: '700', color: colors.foreground, marginBottom: 8 }}>
              Verify your email
            </Text>
            <Text style={{ fontSize: 15, color: colors.mutedForeground, marginBottom: 24 }}>
              We sent a 6-digit code to {email}
            </Text>

            <Input
              label="Verification Code"
              value={verificationCode}
              onChangeText={setVerificationCode}
              placeholder="123456"
              keyboardType="number-pad"
              maxLength={6}
              autoFocus
            />

            <Card style={{ marginTop: 24, padding: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
                <Ionicons name="mail" size={20} color={colors.primary} style={{ marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '500', color: colors.foreground }}>
                    Check your inbox
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.mutedForeground, marginTop: 4 }}>
                    The code was sent from no-reply@verificationemail.com. Check spam if you don't see it.
                  </Text>
                </View>
              </View>
            </Card>
          </View>

          <View style={{ paddingHorizontal: 24, paddingBottom: 16, gap: 12 }}>
            <Button
              size="lg"
              onPress={handleVerify}
              isLoading={auth.isLoading}
              style={{ width: '100%' }}
            >
              <Text style={{ fontSize: 17, fontWeight: '600', color: colors.primaryForeground }}>
                Verify & Create Account
              </Text>
            </Button>
            <Button variant="ghost" size="md" onPress={() => setStep('signup')} style={{ width: '100%' }}>
              <Text style={{ fontSize: 15, color: colors.mutedForeground }}>Go Back</Text>
            </Button>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <OnboardingHeader step={4} total={4} />

          <Text style={{ fontSize: 26, fontWeight: '700', color: colors.foreground, marginBottom: 8 }}>
            Create your account
          </Text>
          <Text style={{ fontSize: 15, color: colors.mutedForeground, marginBottom: 24 }}>
            Save your documents and preferences
          </Text>

          <View style={{ gap: 16 }}>
            <Input
              label="Name"
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              autoCapitalize="words"
              autoComplete="name"
            />
            <Input
              label="School Email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@university.edu"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="At least 8 characters"
              secureTextEntry
              autoComplete="new-password"
            />
          </View>

          <Card style={{ marginTop: 24, padding: 16, backgroundColor: colors.primary + '08' }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
              <Ionicons name="shield-checkmark" size={20} color={colors.primary} style={{ marginTop: 2 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '500', color: colors.foreground }}>
                  Your privacy matters
                </Text>
                <Text style={{ fontSize: 12, color: colors.mutedForeground, marginTop: 4 }}>
                  Your documents are encrypted and never shared. You control your data.
                </Text>
              </View>
            </View>
          </Card>
        </ScrollView>

        <View style={{ paddingHorizontal: 24, paddingBottom: 16, gap: 12 }}>
          <Button
            size="lg"
            onPress={handleSignUp}
            isLoading={auth.isLoading}
            style={{ width: '100%' }}
          >
            <Text style={{ fontSize: 17, fontWeight: '600', color: colors.primaryForeground }}>
              Create Account
            </Text>
          </Button>
          <Button variant="ghost" size="md" onPress={handleSkip} style={{ width: '100%' }}>
            <Text style={{ fontSize: 15, color: colors.mutedForeground }}>Continue as Guest</Text>
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
