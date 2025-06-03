import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useApi } from '@/context/AuthContext';
import { router } from 'expo-router';
import { Clock, Calendar } from 'lucide-react-native';
import { format } from 'date-fns';
import { searchFlights } from '@/services/api';
import { Flight } from '@/types';

export default function RecentBookings() {
  const { colors } = useTheme();
  const { baseUrl } = useApi();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);
      setError(null);
      try {
        // Ambil 3 flight teratas (tanpa filter asal/tujuan/tanggal)
        const result = await searchFlights({}, baseUrl);
        setFlights(result.slice(0, 3));
      } catch (err) {
        setError('Unable to load trending flights');
      } finally {
        setLoading(false);
      }
    };
    fetchFlights();
  }, [baseUrl]);

  if (loading) {
    return <ActivityIndicator style={{ margin: 24 }} color={colors.primary} />;
  }
  if (error) {
    return <Text style={{ color: colors.error, margin: 24 }}>{error}</Text>;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {flights.map((flight) => (
        <TouchableOpacity
          key={flight.id}
          style={[styles.card, { backgroundColor: colors.cardBackground }]}
          onPress={() => router.push({ pathname: '/flight/[id]', params: { id: flight.id.toString(), flight: JSON.stringify(flight) } })}
        >
          <View style={styles.header}>
            <View style={styles.routeContainer}>
              <Text style={[styles.city, { color: colors.text }]}>{flight.origin_city}</Text>
              <View style={styles.routeLine}>
                <View style={[styles.line, { backgroundColor: colors.border }]} />
                <View style={[styles.dot, { backgroundColor: colors.primary }]} />
              </View>
              <Text style={[styles.city, { color: colors.text }]}>{flight.destination_city}</Text>
            </View>
          </View>
          <Text style={[styles.airline, { color: colors.text }]}>{flight.airline_name}</Text>
          <Text style={[styles.flightCode, { color: colors.textSecondary }]}>{flight.flight_code}</Text>
          <View style={styles.footer}>
            <View style={styles.infoRow}>
              <Calendar size={14} color={colors.textSecondary} />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>{format(new Date(flight.departure_datetime), 'MMM d, yyyy')}</Text>
            </View>
            <View style={styles.infoRow}>
              <Clock size={14} color={colors.textSecondary} />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}> {format(new Date(flight.departure_datetime), 'h:mm a')}</Text>
            </View>
          </View>
          <View style={styles.priceContainer}>
            <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>from</Text>
            <Text style={[styles.price, { color: colors.primary }]}>Rp{flight.price.toLocaleString('id-ID')}</Text>
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