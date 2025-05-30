import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { BellRing, TrendingUp, MapPin } from 'lucide-react-native';
import FeaturedDestinations from '@/components/home/FeaturedDestinations';
import RecentBookings from '@/components/home/RecentBookings';
import PromoCard from '@/components/home/PromoCard';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>
            {user ? `Welcome back, ${user.firstName}` : 'Welcome to FlyEasy'}
          </Text>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Find and book your next flight
          </Text>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <BellRing size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity 
          style={[styles.searchCard, { backgroundColor: colors.cardBackground }]}
          onPress={() => router.push('/search')}
        >
          <View style={styles.searchRow}>
            <MapPin size={20} color={colors.primary} />
            <Text style={[styles.searchText, { color: colors.text }]}>
              Where do you want to fly?
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Popular Destinations
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>See all</Text>
            </TouchableOpacity>
          </View>
          <FeaturedDestinations />
        </View>

        <PromoCard />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Trending Flights
            </Text>
            <View style={styles.trendingTag}>
              <TrendingUp size={14} color={colors.accent} />
              <Text style={[styles.trendingText, { color: colors.accent }]}>+12%</Text>
            </View>
          </View>
          
          <RecentBookings />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  welcomeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  headerTitle: {
    fontFamily: 'Roboto-Bold',
    fontSize: 20,
    marginTop: 4,
  },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  searchCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginLeft: 12,
  },
  section: {
    marginTop: 16,
    marginHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 18,
  },
  seeAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  trendingTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(244, 208, 63, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    marginLeft: 4,
  }
});