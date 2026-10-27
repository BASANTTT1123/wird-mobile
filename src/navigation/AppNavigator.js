// ============================================================
// AppNavigator — تنقل التطبيق
//  Splash  ->  Tabs (الرئيسية + المفضلة)  ->  باقي الشاشات
// ============================================================
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, ROW } from '../theme';
import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import TasbeehScreen from '../screens/TasbeehScreen';
import QuranScreen from '../screens/QuranScreen';
import SurahReaderScreen from '../screens/SurahReaderScreen';
import AzkarCategoriesScreen from '../screens/AzkarCategoriesScreen';
import AzkarListScreen from '../screens/AzkarListScreen';
import AzkarDetailScreen from '../screens/AzkarDetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// بيانات التابين: الاسم - الأيقونة - اسم الشاشة
const TABS = {
  Home: { label: 'الرئيسية', icon: 'home' },
  Favorites: { label: 'المفضلة', icon: 'heart' },
};

// شريط التنقل السفلي (الرئيسية + المفضلة)
function MyTabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.tabBar, { paddingBottom: insets.bottom + 8 }]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const tab = TABS[route.name];
        const color = focused ? colors.green : colors.text;
        return (
          <Pressable
            key={route.key}
            style={styles.tabItem}
            onPress={() => navigation.navigate(route.name)}
          >
            <Ionicons name={focused ? tab.icon : `${tab.icon}-outline`} size={30} color={color} />
            <Text style={[styles.tabLabel, { color }]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <MyTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="Splash" component={SplashScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="Tabs" component={Tabs} options={{ animation: 'fade' }} />
      <Stack.Screen name="Tasbeeh" component={TasbeehScreen} />
      <Stack.Screen name="Quran" component={QuranScreen} />
      <Stack.Screen name="SurahReader" component={SurahReaderScreen} />
      <Stack.Screen name="AzkarCategories" component={AzkarCategoriesScreen} />
      <Stack.Screen name="AzkarList" component={AzkarListScreen} />
      <Stack.Screen name="AzkarDetail" component={AzkarDetailScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: ROW,
    backgroundColor: '#F7F2E7',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 14,
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
  },
  tabItem: { flex: 1, alignItems: 'center' },
  tabLabel: { fontSize: 14, fontWeight: '600', marginTop: 4 },
});
