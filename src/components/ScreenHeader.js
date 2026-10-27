import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme';

export default function ScreenHeader({ title, subtitle, onBack, left, right }) {
  const insets = useSafeAreaInsets();

  const leftNode =
    left ||
    (onBack ? (
      <Pressable onPress={onBack} hitSlop={12} style={styles.slot}>
        <Ionicons name="chevron-back" size={28} color={colors.text} />
      </Pressable>
    ) : (
      <View style={styles.slot} />
    ));

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      {/* from lift */}
      <View style={styles.slot}>{leftNode}</View>
      {/* center */}
      <View style={styles.center}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {/* from right */}
      <View style={styles.slot}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  slot: { width: 44, alignItems: 'center', justifyContent: 'center' },
  center: { flex: 1, alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '700', color: colors.textSoft },
  subtitle: { fontSize: 13, color: colors.textSoft, marginTop: 4 },
});
