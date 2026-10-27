import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, ROW, arabicText } from '../theme';

export default function SurahCard({ surah, isFav, onPress, onToggleFav }) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      {/* number */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{surah.id}</Text>
      </View>

      {/* name and cout of ayat*/}
      <View style={styles.info}>
        <Text style={[arabicText, styles.name]}>
          {surah.name} <Text style={styles.type}>({surah.type})</Text>
        </Text>
        <Text style={[arabicText, styles.count]}>{surah.ayahCount} آيات</Text>
      </View>

      {/* fav */}
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
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  badge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.greenSoft,
    borderWidth: 1,
    borderColor: '#9AA593',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontSize: 18, color: colors.text },
  info: { flex: 1, marginHorizontal: 12 },
  name: { fontSize: 17, fontWeight: '700' },
  type: { fontSize: 15, fontWeight: '400', color: colors.textSoft },
  count: { fontSize: 15, fontWeight: '700', color: colors.green, marginTop: 2 },
});
