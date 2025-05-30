import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { ArrowLeft, Plane, Users, Clock, CreditCard } from 'lucide-react-native';
import { format, differenceInMinutes } from 'date-fns';
import { Flight } from '@/types';

import { Logs } from 'expo'
Logs.enableExpoCliLogging()

export default function FlightDetailsScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFlightDetails();
  }, [id]);

  const loadFlightDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock flight data for demonstration
      const mockFlight: Flight = {
        id: parseInt(id),
        flight_code: "GA204",
        airline_name: "Garuda Indonesia",
        origin_city: "CGK",
        destination_city: "DPS",
        departure_datetime: "2025-12-20T08:00:00Z",
        arrival_datetime: "2025-12-20T10:50:00Z",
        price: 1650000,
        available_seats: 35
      };
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setFlight(mockFlight);
    } catch (err) {
      setError('Unable to load flight details. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (departure: string, arrival: string) => {
    const departureTime = new Date(departure);
    const arrivalTime = new Date(arrival);
    const durationMinutes = differenceInMinutes(arrivalTime, departureTime);
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Flight Details</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading flight details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !flight) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Flight Details</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error || 'Flight not found'}
          </Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={loadFlightDetails}
          >
            <Text style={[styles.retryButtonText, { color: colors.white }]}>
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Flight Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={[styles.flightCode, { color: colors.text }]}>
                {flight.flight_code}
              </Text>
              <Text style={[styles.airlineName, { color: colors.textSecondary }]}>
                {flight.airline_name}
              </Text>
            </View>
            <View style={[styles.badge, { backgroundColor: flight.available_seats > 10 ? colors.success + '15' : colors.warning + '15' }]}>
              <Text style={[
                styles.badgeText, 
                { color: flight.available_seats > 10 ? colors.success : colors.warning }
              ]}>
                {flight.available_seats} seats left
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.flightRoute}>
            <View style={styles.locationColumn}>
              <Text style={[styles.city, { color: colors.text }]}>
                {flight.origin_city}
              </Text>
              <Text style={[styles.time, { color: colors.text }]}>
                {format(new Date(flight.departure_datetime), 'HH:mm')}
              </Text>
            </View>
            
            <View style={styles.flightPathView}>
              <View style={[styles.circle, { backgroundColor: colors.primary }]} />
              <View style={[styles.line, { backgroundColor: colors.border }]} />
              <Plane size={20} color={colors.primary} style={{ transform: [{ rotate: '45deg' }] }} />
              <View style={[styles.line, { backgroundColor: colors.border }]} />
              <View style={[styles.circle, { backgroundColor: colors.primary }]} />
            </View>

            <View style={styles.locationColumn}>
              <Text style={[styles.city, { color: colors.text }]}>
                {flight.destination_city}
              </Text>
              <Text style={[styles.time, { color: colors.text }]}>
                {format(new Date(flight.arrival_datetime), 'HH:mm')}
              </Text>
            </View>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Clock size={18} color={colors.textSecondary} />
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Duration:</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {formatDuration(flight.departure_datetime, flight.arrival_datetime)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Users size={18} color={colors.textSecondary} />
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Available Seats:</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {flight.available_seats} seats
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Price Details</Text>
          <View style={[styles.priceRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>Base Fare</Text>
            <Text style={[styles.priceValue, { color: colors.text }]}>${flight.price}</Text>
          </View>
          <View style={[styles.priceRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>Taxes & Fees</Text>
            <Text style={[styles.priceValue, { color: colors.text }]}>$35</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
            <Text style={[styles.totalValue, { color: colors.primary }]}>
              ${flight.price + 35}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.bookButton, { backgroundColor: colors.primary }]}
          onPress={() => {
            console.log(id, flight.id)
            return router.push({
            pathname: `/booking/${id}`,
            // params: { flightId: flight.id.toString() }
          })}}
        >
          <CreditCard size={20} color={colors.white} />
          <Text style={[styles.bookButtonText, { color: colors.white }]}>
            Book Now
          </Text>
        </TouchableOpacity>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 18,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  flightCode: {
    fontFamily: 'Roboto-Medium',
    fontSize: 18,
  },
  airlineName: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  divider: {
    height: 1,
    width: '100%',
    marginBottom: 16,
  },
  flightRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  locationColumn: {
    alignItems: 'center',
  },
  city: {
    fontFamily: 'Roboto-Medium',
    fontSize: 18,
    marginBottom: 4,
  },
  time: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  flightPathView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  line: {
    flex: 1,
    height: 1,
  },
  detailsContainer: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginLeft: 8,
    marginRight: 4,
  },
  detailValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  sectionTitle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  priceLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  priceValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  totalLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
  },
  totalValue: {
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 25,
    marginBottom: 24,
  },
  bookButtonText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  }
});