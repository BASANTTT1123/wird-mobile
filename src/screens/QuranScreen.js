import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, FlatList, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import SurahCard from '../components/SurahCard';
import { colors, ROW } from '../theme';
import { SURAHS } from '../data/surahs';
import { normalizeArabic } from '../utils';
import { useApp } from '../context/AppContext';

const FILTERS = [
  { key: 'all', label: 'كل السور' },
  { key: 'مكية', label: 'مكية' },
  { key: 'مدنية', label: 'مدنية' },
];

export default function QuranScreen({ navigation }) {
  const { favSurahs, toggleFavSurah } = useApp();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  //filter + search
  const data = useMemo(() => {
    const q = normalizeArabic(query);
    return SURAHS.filter((s) => {
      const okType = filter === 'all' || s.type === filter;
      const okName = !q || normalizeArabic(s.name).includes(q);
      return okType && okName;
    });
  }, [query, filter]);

  return (
    <View style={styles.container}>
      <ScreenHeader title="القرآن الكريم" onBack={() => navigation.goBack()} />

      {/* searching bar */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={24} color={colors.textSoft} />
        <TextInput
          style={styles.input}
          placeholder="ابحث عن اسم السورة...."
          placeholderTextColor={colors.textSoft}
          value={query}
          onChangeText={setQuery}
          textAlign="right"
        />
      </View>

      {/* filter button*/}
      <View style={styles.filters}>
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <Pressable
              key={f.key}
              onPress={() => setFilter(f.key)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{f.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30 }}
        ListEmptyComponent={<Text style={styles.empty}>لا توجد نتائج</Text>}
        renderItem={({ item }) => (
          <SurahCard
            surah={item}
            isFav={favSurahs.includes(item.id)}
            onToggleFav={() => toggleFavSurah(item.id)}
            onPress={() => navigation.navigate('SurahReader', { surahId: item.id })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  searchBox: {
    flexDirection: ROW,
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  input: { flex: 1, fontSize: 16, paddingVertical: 12, marginRight: 10, color: colors.text },
  filters: { flexDirection: ROW, paddingHorizontal: 20, marginVertical: 16 },
  chip: {
    backgroundColor: colors.card,
    borderRadius: 22,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginLeft: 12,
  },
  chipActive: { backgroundColor: colors.green },
  chipText: { fontSize: 15, fontWeight: '600', color: colors.textSoft },
  chipTextActive: { color: '#fff' },
  empty: { textAlign: 'center', color: colors.textSoft, marginTop: 40, fontSize: 16 },
});
