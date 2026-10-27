import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import { colors, ROW } from '../theme';
import { getSurah } from '../data/surahs';
import quran from '../data/quran.json';
import { useApp } from '../context/AppContext';

const BASMALA = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';

export default function SurahReaderScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { surahId } = route.params;
  const surah = getSurah(surahId);
  const ayahs = quran[String(surahId)];

  const { favSurahs, toggleFavSurah, lastRead, saveLastRead } = useApp();
  const isFav = favSurahs.includes(surahId);

  // saving the last ayah
  const [selected, setSelected] = useState(
    lastRead && lastRead.surah === surahId ? lastRead.ayah : null
  );
  const [toast, setToast] = useState('');

  //saving the last surah
  useEffect(() => {
    const ayah = lastRead && lastRead.surah === surahId ? lastRead.ayah : 1;
    saveLastRead(surahId, ayah);
  }, [surahId]);

  const onBookmark = () => {
    saveLastRead(surahId, selected || 1);
    setToast('تم حفظ مكان القراءة');
    setTimeout(() => setToast(''), 1500);
  };

  //changing surah
  const goTo = (id) => navigation.replace('SurahReader', { surahId: id });


  const showBasmala = surahId !== 1 && surahId !== 9;

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={`سورة ${surah.name}`}
        subtitle={`الجزء ${surah.juz} - ${surah.ayahCount} آية`}
        left={
          <Pressable onPress={onBookmark} hitSlop={12}>
            <Ionicons name="bookmark" size={30} color={colors.text} />
          </Pressable>
        }
        right={
          <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
            <Ionicons name="chevron-forward" size={28} color={colors.text} />
          </Pressable>
        }
      />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 130 }}
        showsVerticalScrollIndicator={false}
      >
        {showBasmala && <Text style={styles.basmala}>{BASMALA}</Text>}

        {ayahs ? (
          <Text style={styles.ayahs}>
            {ayahs.map((text, i) => (
              <Text
                key={i}
                onPress={() => setSelected(i + 1)}
                style={selected === i + 1 ? styles.selectedAyah : null}
              >
                {text} <Text style={styles.ayahNumber}>({i + 1})</Text>{'  '}
              </Text>
            ))}
          </Text>
        ) : (
          <Text style={styles.missing}>
            نص هذه السورة غير موجود بعد.{'\n'}
            شغّلي سكريبت buildQuran.js لتحميل المصحف كامل (الخطوات في README).
          </Text>
        )}
      </ScrollView>

      {!!toast && <Text style={[styles.toast, { bottom: insets.bottom + 110 }]}>{toast}</Text>}

      {/* الشريط السفلي: السابق - قلب - التالي */}
      <View style={[styles.bar, { bottom: insets.bottom + 16 }]}>
        <Pressable
          style={[styles.navBtn, surahId === 1 && styles.disabled]}
          disabled={surahId === 1}
          onPress={() => goTo(surahId - 1)}
        >
          <Ionicons name="chevron-forward" size={20} color={colors.text} />
          <Text style={styles.navText}>السابق</Text>
        </Pressable>

        <Pressable onPress={() => toggleFavSurah(surahId)} hitSlop={10}>
          <Ionicons
            name={isFav ? 'heart' : 'heart-outline'}
            size={34}
            color={isFav ? colors.red : colors.text}
          />
        </Pressable>

        <Pressable
          style={[styles.navBtn, surahId === 114 && styles.disabled]}
          disabled={surahId === 114}
          onPress={() => goTo(surahId + 1)}
        >
          <Text style={styles.navText}>التالي</Text>
          <Ionicons name="chevron-back" size={20} color={colors.text} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  basmala: {
    fontSize: 28,
    textAlign: 'center',
    color: colors.text,
    marginTop: 8,
    marginBottom: 22,
  },
  ayahs: {
    fontSize: 25,
    lineHeight: 54,
    textAlign: 'center',
    writingDirection: 'rtl',
    color: colors.text,
  },
  ayahNumber: { fontSize: 20, color: colors.green },
  selectedAyah: { backgroundColor: 'rgba(90,118,96,0.22)' },
  missing: { textAlign: 'center', color: colors.textSoft, fontSize: 16, lineHeight: 28, marginTop: 40 },

  bar: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: ROW,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingVertical: 18,
    paddingHorizontal: 22,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  navBtn: { flexDirection: 'row', alignItems: 'center' },
  navText: { fontSize: 18, fontWeight: '600', color: colors.text, marginHorizontal: 6 },
  disabled: { opacity: 0.3 },
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: colors.green,
    color: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 16,
    overflow: 'hidden',
    fontSize: 14,
  },
});
