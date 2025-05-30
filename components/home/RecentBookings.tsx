import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { router } from 'expo-router';
import { Clock, Calendar } from 'lucide-react-native';
import { format } from 'date-fns';

const recentFlights = [
  {
    id: '1',
    origin: 'JKT',
    destination: 'SIN',
    flightCode: 'GA825',
    airline: 'Garuda Indonesia',
    departureDate: '2025-05-15T09:30:00Z',
    price: 320
  },
  {
    id: '2',
    origin: 'SIN',
    destination: 'BKK',
    flightCode: 'SQ305',
    airline: 'Singapore Airlines',
    departureDate: '2025-05-20T14:15:00Z',
    price: 280
  },
  {
    id: '3',
    origin: 'BKK',
    destination: 'HKG',
    flightCode: 'TG601',
    airline: 'Thai Airways',
    departureDate: '2025-05-25T11:45:00Z',
    price: 350
  }
];

export default function RecentBookings() {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {recentFlights.map((flight) => (
        <TouchableOpacity
          key={flight.id}
          style={[styles.card, { backgroundColor: colors.cardBackground }]}
          onPress={() => router.push('/search')}
        >
          <View style={styles.header}>
            <View style={styles.routeContainer}>
              <Text style={[styles.city, { color: colors.text }]}>{flight.origin}</Text>
              <View style={styles.routeLine}>
                <View style={[styles.line, { backgroundColor: colors.border }]} />
                <View style={[styles.dot, { backgroundColor: colors.primary }]} />
              </View>
              <Text style={[styles.city, { color: colors.text }]}>{flight.destination}</Text>
            </View>
          </View>
          
          <Text style={[styles.airline, { color: colors.text }]}>{flight.airline}</Text>
          <Text style={[styles.flightCode, { color: colors.textSecondary }]}>{flight.flightCode}</Text>
          
          <View style={styles.footer}>
            <View style={styles.infoRow}>
              <Calendar size={14} color={colors.textSecondary} />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                {format(new Date(flight.departureDate), 'MMM d, yyyy')}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Clock size={14} color={colors.textSecondary} />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                {format(new Date(flight.departureDate), 'h:mm a')}
              </Text>
            </View>
          </View>
          
          <View style={styles.priceContainer}>
            <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>from</Text>
            <Text style={[styles.price, { color: colors.primary }]}>${flight.price}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingRight: 16,
  },
  card: {
    width: 200,
    padding: 16,
    borderRadius: 16,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    marginBottom: 16,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  city: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
  },
  routeLine: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  line: {
    flex: 1,
    height: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    left: '50%',
    marginLeft: -3,
  },
  airline: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginBottom: 4,
  },
  flightCode: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginBottom: 12,
  },
  footer: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginRight: 4,
  },
  price: {
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
  }
});