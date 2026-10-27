import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import ScreenHeader from '../components/ScreenHeader';
import SurahCard from '../components/SurahCard';
import ZikrRow from '../components/ZikrRow';
import { colors } from '../theme';
import { getCategory } from '../data/azkar';
import { getSurah } from '../data/surahs';
import { useApp } from '../context/AppContext';

export default function AzkarListScreen({ navigation, route }) {
  const { categoryId } = route.params;
  const category = getCategory(categoryId);
  const { favZikr, toggleFavZikr } = useApp();

  const openZikr = (zikrId) => navigation.navigate('AzkarDetail', { categoryId, zikrId });

  return (
    <View style={styles.container}>
      <ScreenHeader title={category.title} onBack={() => navigation.goBack()} />
      <FlatList
        data={category.items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 30 }}
        renderItem={({ item }) =>
          item.surahId ? (
            //(الإخلاص والفلق والناس)
            <SurahCard
              surah={getSurah(item.surahId)}
              isFav={favZikr.includes(item.id)}
              onToggleFav={() => toggleFavZikr(item.id)}
              onPress={() => openZikr(item.id)}
            />
          ) : (
            <ZikrRow
              title={item.title}
              isFav={favZikr.includes(item.id)}
              onToggleFav={() => toggleFavZikr(item.id)}
              onPress={() => openZikr(item.id)}
            />
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
});
