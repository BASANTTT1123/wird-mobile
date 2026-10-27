import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import SurahCard from '../components/SurahCard';
import ZikrRow from '../components/ZikrRow';
import { colors, ROW } from '../theme';
import { SURAHS } from '../data/surahs';
import { TASBEEH_LIST } from '../data/tasbeeh';
import { findZikr } from '../data/azkar';
import { useApp } from '../context/AppContext';

export default function FavoritesScreen({ navigation }) {
  const { favSurahs, favZikr, toggleFavSurah, toggleFavZikr } = useApp();
  const [tab, setTab] = useState('surahs');

  // sorted like in quran
  const surahItems = SURAHS.filter((s) => favSurahs.includes(s.id));

  // fav tasbeeh
  const zikrItems = favZikr
    .map((id) => {
      const tasbeeh = TASBEEH_LIST.find((t) => t.id === id);
      if (tasbeeh) return { id, title: tasbeeh.text, kind: 'tasbeeh' };
      const found = findZikr(id);
      if (found) return { id, title: found.item.title, kind: 'zikr', categoryId: found.categoryId };
      return null;
    })
    .filter(Boolean);

  const openZikr = (z) => {
    if (z.kind === 'tasbeeh') navigation.navigate('Tasbeeh', { dhikrId: z.id });
    else navigation.navigate('AzkarDetail', { categoryId: z.categoryId, zikrId: z.id });
  };

  const empty = (
    <View style={styles.emptyBox}>
      <Ionicons name="heart-outline" size={64} color={colors.textSoft} />
      <Text style={styles.emptyTitle}>لا يوجد شيء في المفضلة بعد</Text>
      <Text style={styles.emptySub}>اضغط على القلب لإضافة سورة أو ذكر</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader title="المفضلة" onBack={() => navigation.navigate('Home')} />

      {/* surah right| azkar left*/}
      <View style={styles.tabs}>
        <TabButton label="السور" active={tab === 'surahs'} onPress={() => setTab('surahs')} />
        <TabButton label="الأذكار" active={tab === 'azkar'} onPress={() => setTab('azkar')} />
      </View>

      {tab === 'surahs' ? (
        <FlatList
          data={surahItems}
          keyExtractor={(i) => String(i.id)}
          contentContainerStyle={styles.list}
          ListEmptyComponent={empty}
          renderItem={({ item }) => (
            <SurahCard
              surah={item}
              isFav
              onToggleFav={() => toggleFavSurah(item.id)}
              onPress={() => navigation.navigate('SurahReader', { surahId: item.id })}
            />
          )}
        />
      ) : (
        <FlatList
          data={zikrItems}
          keyExtractor={(i) => i.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={empty}
          renderItem={({ item }) => (
            <ZikrRow
              title={item.title}
              isFav
              onToggleFav={() => toggleFavZikr(item.id)}
              onPress={() => openZikr(item)}
            />
          )}
        />
      )}
    </View>
  );
}

function TabButton({ label, active, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.tab, active && styles.tabActive]}>
      <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  tabs: { flexDirection: ROW, paddingHorizontal: 20, marginVertical: 14 },
  tab: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 22,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  tabActive: { backgroundColor: colors.green },
  tabText: { fontSize: 15, fontWeight: '600', color: colors.textSoft },
  tabTextActive: { color: '#fff' },
  list: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 30, flexGrow: 1 },
  emptyBox: { alignItems: 'center', marginTop: 80 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginTop: 14 },
  emptySub: { fontSize: 14, color: colors.textSoft, marginTop: 6 },
});
