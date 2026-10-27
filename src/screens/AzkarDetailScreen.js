import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import ScreenHeader from '../components/ScreenHeader';
import CircleProgress from '../components/CircleProgress';
import { colors } from '../theme';
import { findZikr } from '../data/azkar';
import { useApp } from '../context/AppContext';

export default function AzkarDetailScreen({ navigation, route }) {
  const { zikrId } = route.params;
  const found = findZikr(zikrId);
  const item = found.item;

  const { favZikr, toggleFavZikr } = useApp();
  const isFav = favZikr.includes(item.id);

  const [count, setCount] = useState(0);
  const done = count >= item.count;

  const onTap = () => {
    if (done) return;
    const next = count + 1;
    setCount(next);
    try {
      if (next === item.count) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (e) { }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={item.title}
        left={
          <Pressable onPress={() => toggleFavZikr(item.id)} hitSlop={12}>
            <Ionicons
              name={isFav ? 'heart' : 'heart-outline'}
              size={32}
              color={isFav ? colors.red : colors.text}
            />
          </Pressable>
        }
        right={
          <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
            <Ionicons name="chevron-forward" size={28} color={colors.text} />
          </Pressable>
        }
      />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 20, alignItems: 'center' }}
        showsVerticalScrollIndicator={false}
      >

        {item.quran && (item.surahId || item.title === 'آية الكرسي') && (
          <Text style={styles.audhu}>أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ</Text>
        )}

        <Text style={styles.text}>{item.text}</Text>
        {!!item.source && <Text style={styles.source}>[{item.source}]</Text>}
      </ScrollView>

      {/* clicking on the circle*/}
      <View style={styles.counterWrap}>
        <Pressable onPress={onTap}>
          <CircleProgress size={170} strokeWidth={18} progress={count / item.count}>
            {done ? (
              <Ionicons name="checkmark" size={56} color={colors.green} />
            ) : (
              <>
                <Text style={styles.count}>{count}</Text>
                <Text style={styles.of}>من {item.count}</Text>
              </>
            )}
          </CircleProgress>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  audhu: { fontSize: 24, color: colors.text, textAlign: 'center', marginVertical: 14 },
  text: {
    fontSize: 25,
    lineHeight: 52,
    color: colors.text,
    textAlign: 'center',
    writingDirection: 'rtl',
    marginTop: 8,
  },
  source: { fontSize: 14, color: colors.textSoft, marginTop: 14, textAlign: 'center' },
  counterWrap: { alignItems: 'center', paddingVertical: 14 },
  count: { fontSize: 44, fontWeight: '800', color: colors.text },
  of: { fontSize: 16, fontWeight: '600', color: colors.green },
});
