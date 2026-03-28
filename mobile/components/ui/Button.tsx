import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  isLoading?: boolean;
}

export function Button({
  variant = 'default',
  size = 'md',
  children,
  isLoading,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const variantStyles: Record<ButtonVariant, { bg: string; text: string; border?: string }> = {
    default: { bg: colors.primary, text: colors.primaryForeground },
    secondary: { bg: colors.secondary, text: colors.secondaryForeground },
    outline: { bg: 'transparent', text: colors.foreground, border: colors.border },
    ghost: { bg: 'transparent', text: colors.foreground },
    destructive: { bg: colors.destructive, text: colors.destructiveForeground },
  };

  const sizeStyles: Record<ButtonSize, { height: number; px: number; fontSize: number; radius: number }> = {
    sm: { height: 36, px: 12, fontSize: 13, radius: 8 },
    md: { height: 44, px: 20, fontSize: 15, radius: 12 },
    lg: { height: 56, px: 24, fontSize: 17, radius: 14 },
  };

  const v = variantStyles[variant];
  const s = sizeStyles[size];

  const buttonStyle: ViewStyle = {
    backgroundColor: v.bg,
    height: s.height,
    paddingHorizontal: s.px,
    borderRadius: s.radius,
    borderWidth: v.border ? 1.5 : 0,
    borderColor: v.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled || isLoading ? 0.5 : 1,
  };

  const textStyle: TextStyle = {
    color: v.text,
    fontSize: s.fontSize,
    fontWeight: '600',
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled || isLoading}
      style={[buttonStyle, style]}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={v.text} size="small" />
      ) : typeof children === 'string' ? (
        <Text style={textStyle}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}
