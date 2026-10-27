import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import { colors, ROW, arabicText } from '../theme';
import { CATEGORIES } from '../data/azkar';

export default function AzkarCategoriesScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <ScreenHeader title="الأذكار" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16 }}>
        {CATEGORIES.map((cat) => (
          <Pressable
            key={cat.id}
            style={styles.card}
            onPress={() => navigation.navigate('AzkarList', { categoryId: cat.id })}
          >
            <MaterialCommunityIcons name={cat.icon} size={42} color={colors.green} />
            <View style={styles.texts}>
              <Text style={[arabicText, styles.title]}>{cat.title}</Text>
              <Text style={[arabicText, styles.subtitle]}>{cat.subtitle}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  card: {
    flexDirection: ROW,
    alignItems: 'center',
    backgroundColor: colors.greenSoft,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#C9CDBB',
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 18,
  },
  texts: { flex: 1, marginHorizontal: 14 },
  title: { fontSize: 19, fontWeight: '700' },
  subtitle: { fontSize: 14, marginTop: 4, color: colors.text },
});
