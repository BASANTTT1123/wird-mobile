import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, ROW, arabicText } from '../theme';

export default function ZikrRow({ title, isFav, onPress, onToggleFav }) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Text style={[arabicText, styles.title]} numberOfLines={1}>
        {title}
      </Text>
      <Pressable onPress={onToggleFav} hitSlop={10}>
        <Ionicons
          name={isFav ? 'heart' : 'heart-outline'}
          size={30}
          color={isFav ? colors.red : colors.text}
        />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: ROW,
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 10,
  },
  title: { flex: 1, fontSize: 22, fontWeight: '700', marginRight: 0 },
});
