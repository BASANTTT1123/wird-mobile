import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, ROW, arabicText } from '../theme';
import { useApp } from '../context/AppContext';
import { DAILY_GOAL } from '../data/tasbeeh';
import { getSurah } from '../data/surahs';
import { Image } from 'react-native';

export default function HomeScreen({ navigation }) {
  const { height } = useWindowDimensions();
  const { tasbeehToday, lastRead } = useApp();

  const progress = Math.min(1, tasbeehToday / DAILY_GOAL);
  const lastSurah = lastRead ? getSurah(lastRead.surah) : null;

  return (
    <ImageBackground
      source={require('../../assets/home-bg.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      {/* paddingTop */}
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: height * 0.27 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* welcome */}
        <Text style={styles.greeting}>السلام عليكم</Text>
        <Text style={styles.dua}>اللهم اجعلنا من اهل القرآن و الذكر</Text>

        {/* ayah card */}
        <View style={styles.verseCard}>
          <Text style={styles.verse}>«وَاذْكُر رَّبَّكَ إِذَا نَسِيتَ»</Text>
          <Text style={styles.verseRef}>( الكهف , 24 )</Text>
        </View>

        {/* three cards */}
        <View style={styles.row}>
          <MenuCard
            label="المسبحة"
            onPress={() => navigation.navigate('Tasbeeh')}
            icon={
              <Image
                source={require("../../assets/tasbeeh.png")}
                style={{ width: 40, height: 40 }}
                resizeMode="contain"
              />
            }
          />
          <MenuCard
            label="الأذكار"
            onPress={() => navigation.navigate('AzkarCategories')}
            icon={
              <Image
                source={require('../../assets/sun.png')}
                style={{ width: 40, height: 40 }}
                resizeMode="contain"
              />
            }
          />
          <MenuCard
            label="القرآن الكريم"
            onPress={() => navigation.navigate('Quran')}
            icon={<Ionicons name="book-outline" size={40} color="#222" />}
          />
        </View>

        {/* today's tasbeeh card*/}
        <Pressable style={styles.tasbeehCard} onPress={() => navigation.navigate('Tasbeeh')}>
          <Text style={[arabicText, styles.cardLabel]}>تسبيحات اليوم</Text>
          <View style={styles.tasbeehRow}>
            <Text style={styles.tasbeehNumber}>
              {tasbeehToday} من {DAILY_GOAL}
            </Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
            </View>
          </View>
        </Pressable>

        {/* the last surah card*/}
        <Pressable
          style={styles.lastCard}
          onPress={() => navigation.navigate('SurahReader', { surahId: lastRead ? lastRead.surah : 1 })}
        >
          <Ionicons name="book" size={40} color={colors.green} />
          <View style={styles.lastInfo}>
            {lastSurah ? (
              <>
                <Text style={[arabicText, styles.cardLabelSmall]}>آخر سورة قرأتها</Text>
                <Text style={[arabicText, styles.lastTitle]}>سورة {lastSurah.name}</Text>
                <Text style={[arabicText, styles.cardLabelSmall]}>الآية {lastRead.ayah}</Text>
              </>
            ) : (
              <>
                {/* if did not read yet*/}
                <Text style={[arabicText, styles.cardLabelSmall]}>ختمة جديدة</Text>
                <Text style={[arabicText, styles.lastTitle]}>ابدأ القراءة الآن</Text>
                <Text style={[arabicText, styles.cardLabelSmall]}>رحلتك مع كتاب الله تبدأ هنا</Text>
              </>
            )}
          </View>
          <View style={styles.continueBtn}>
            <Text style={styles.continueText}>{lastSurah ? 'متابعة' : 'ابدأ'}</Text>
          </View>
        </Pressable>
      </ScrollView>
    </ImageBackground>
  );
}

// small card
function MenuCard({ label, icon, onPress }) {
  return (
    <Pressable style={styles.menuCard} onPress={onPress}>
      {icon}
      <Text style={styles.menuLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 24 },
  greeting: { fontSize: 24, fontWeight: '700', color: colors.text, textAlign: 'center' },
  dua: { fontSize: 15, color: colors.textSoft, textAlign: 'center', marginTop: 8, marginBottom: 18 },

  verseCard: {
    backgroundColor: 'rgba(246,242,232,0.9)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingVertical: 22,
    alignItems: 'center',
    marginBottom: 14,
  },
  verse: { fontSize: 22, color: colors.text },
  verseRef: { fontSize: 12, color: colors.textSoft, marginTop: 6 },

  row: { flexDirection: ROW, justifyContent: 'space-between', marginBottom: 14 },
  menuCard: {
    width: '31%',
    height: 100,
    borderRadius: 24,
    backgroundColor: 'rgba(246,242,232,0.9)',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: { marginTop: 8, fontSize: 14, fontWeight: '600', color: colors.text },

  tasbeehCard: {
    backgroundColor: colors.greenSoft,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#8E9A88',
    padding: 16,
    marginBottom: 14,
  },
  cardLabel: { fontSize: 14, fontWeight: '600' },
  tasbeehRow: { flexDirection: ROW, alignItems: 'center', marginTop: 8 },
  tasbeehNumber: { fontSize: 22, fontWeight: '700', color: colors.green, marginLeft: 16 },
  progressTrack: { flex: 1, height: 12, borderRadius: 6, backgroundColor: '#C3C8B7', overflow: 'hidden' },
  progressFill: { height: 12, borderRadius: 6, backgroundColor: '#3E5844' },

  lastCard: {
    flexDirection: ROW,
    alignItems: 'center',
    backgroundColor: 'rgba(246,242,232,0.95)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 16,
  },
  lastInfo: { flex: 1, marginHorizontal: 12 },
  cardLabelSmall: { fontSize: 13, color: colors.textSoft },
  lastTitle: { fontSize: 18, fontWeight: '700', marginVertical: 2 },
  continueBtn: {
    backgroundColor: colors.green,
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  continueText: { color: '#fff', fontWeight: '700' },
});
