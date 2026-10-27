import React, { useState } from 'react';
import { View, Text, Pressable, Modal, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import ScreenHeader from '../components/ScreenHeader';
import CircleProgress from '../components/CircleProgress';
import { colors, ROW, arabicText } from '../theme';
import { useApp } from '../context/AppContext';
import { TASBEEH_LIST } from '../data/tasbeeh';

export default function TasbeehScreen({ navigation, route }) {
  const { tasbeehToday, tasbeehTotal, addTasbeeh, favZikr, toggleFavZikr } = useApp();

  // the choosen azkar
  const startId = route.params?.dhikrId;
  const [selected, setSelected] = useState(
    TASBEEH_LIST.find((t) => t.id === startId) || TASBEEH_LIST[0]
  );
  const [count, setCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const isFav = favZikr.includes(selected.id);

  //when clicking tasbeeh
  const onTap = () => {
    const next = count >= selected.target ? 1 : count + 1; //new count
    setCount(next);
    addTasbeeh(); //the daily total 
    try {
      if (next === selected.target) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); // vibrate
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (e) { }
  };

  const chooseDhikr = (item) => {
    setSelected(item);
    setCount(0);
    setMenuOpen(false);
  };

  // fav
  const sortedList = [...TASBEEH_LIST].sort(
    (a, b) => Number(favZikr.includes(b.id)) - Number(favZikr.includes(a.id))
  );

  return (
    <View style={styles.container}>
      <ScreenHeader title="المسبحة" onBack={() => navigation.goBack()} />

      <View style={styles.body}>
        {/* the list */}
        <Pressable style={styles.dropdown} onPress={() => setMenuOpen(true)}>
          <Ionicons name="chevron-down" size={22} color={colors.text} />
          <Text style={styles.dropdownText}>{selected.text}</Text>
          <View style={{ width: 22 }} />
        </Pressable>

        {/* count circle */}
        <View style={styles.circleWrap}>
          <CircleProgress size={230} strokeWidth={24} progress={count / selected.target}>
            <Text style={styles.bigNumber}>{count}</Text>
            <Text style={styles.ofText}>من {selected.target}</Text>
          </CircleProgress>
        </View>

        {/* count cart*/}
        <View style={styles.stats}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>تسبيحات اليوم</Text>
            <Text style={styles.statValue}>{tasbeehToday}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>الإجمالي الكلي</Text>
            <Text style={styles.statValue}>{tasbeehTotal}</Text>
          </View>
        </View>

        {/* tasbeeh buttom*/}
        <Pressable style={styles.mainBtn} onPress={onTap}>
          <Text style={styles.mainBtnText}>تسبيح</Text>
        </Pressable>

        {/* reset and fav*/}
        <View style={styles.bottomRow}>
          <Pressable style={styles.smallBtn} onPress={() => toggleFavZikr(selected.id)}>
            <Text style={styles.smallBtnText}>مفضلة</Text>
            <Ionicons
              name={isFav ? 'heart' : 'heart-outline'}
              size={30}
              color={isFav ? colors.red : colors.text}
            />
          </Pressable>
          <Pressable style={styles.smallBtn} onPress={() => setCount(0)}>
            <Text style={styles.smallBtnText}>إعادة</Text>
            <Ionicons name="refresh" size={28} color={colors.text} />
          </Pressable>
        </View>
      </View>

      {/* choosing azkar*/}
      <Modal visible={menuOpen} transparent animationType="fade" onRequestClose={() => setMenuOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setMenuOpen(false)}>
          <View style={styles.menu}>
            <FlatList
              data={sortedList}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable style={styles.menuItem} onPress={() => chooseDhikr(item)}>
                  {favZikr.includes(item.id) ? (
                    <Ionicons name="heart" size={18} color={colors.red} />
                  ) : (
                    <View style={{ width: 18 }} />
                  )}
                  <Text style={[arabicText, styles.menuText]}>{item.text}</Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  body: { flex: 1, paddingHorizontal: 20 },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginTop: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  dropdownText: { fontSize: 20, fontWeight: '700', color: colors.text },
  circleWrap: { alignItems: 'center', marginVertical: 24 },
  bigNumber: { fontSize: 56, fontWeight: '800', color: colors.text },
  ofText: { fontSize: 18, fontWeight: '600', color: colors.green },

  stats: {
    flexDirection: ROW,
    backgroundColor: colors.greenSoft,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#8E9A88',
    paddingVertical: 14,
  },
  statBox: { flex: 1, alignItems: 'center' },
  divider: { width: 1, backgroundColor: '#8E9A88' },
  statLabel: { fontSize: 14, color: colors.text },
  statValue: { fontSize: 22, fontWeight: '800', color: colors.text, marginTop: 6 },

  mainBtn: {
    backgroundColor: colors.green,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 18,
  },
  mainBtnText: { color: '#fff', fontSize: 20, fontWeight: '700' },

  bottomRow: { flexDirection: ROW, justifyContent: 'space-between', marginTop: 24 },
  smallBtn: {
    width: '48%',
    flexDirection: ROW,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingVertical: 18,
  },
  smallBtnText: { fontSize: 19, fontWeight: '600', color: colors.text, marginHorizontal: 10 },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', padding: 24 },
  menu: { backgroundColor: colors.card, borderRadius: 20, maxHeight: '70%', paddingVertical: 8 },
  menuItem: {
    flexDirection: ROW,
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.cardBorder,
  },
  menuText: { flex: 1, fontSize: 18, marginRight: 0 },
});
