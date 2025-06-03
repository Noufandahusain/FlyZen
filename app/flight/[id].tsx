import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useApi } from '@/context/AuthContext';
import {
  ArrowLeft,
  Plane,
  Users,
  Clock,
  CreditCard,
} from 'lucide-react-native';
import { format, differenceInMinutes } from 'date-fns';
import { Flight, FlightSearchParams } from '@/types';
import { searchFlights, getBookings } from '@/services/api';
import AlertDialog from '@/components/common/AlertDialog';

export default function FlightDetailsScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { baseUrl } = useApi();
  const params = useLocalSearchParams();
  const numPassengers = Array.isArray(params.num_passengers) ? params.num_passengers[0] : params.num_passengers || '1';
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const flightString = Array.isArray(params.flight) ? params.flight[0] : params.flight;
  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPendingAlert, setShowPendingAlert] = useState(false);

  useEffect(() => {
    console.log('Flight details page received params:', { id, flightString });

    if (flightString) {
      try {
        const parsedFlight: Flight = JSON.parse(flightString);
        setFlight(parsedFlight);
        setLoading(false);
      } catch (e) {
        console.error('Failed to parse flight object from params:', e);
        setError('Unable to load flight details.');
        setLoading(false);
      }
    } else if (id) {
        setError('Flight data not passed during navigation.');
        setLoading(false);
    } else {
        setError('Flight ID is missing.');
        setLoading(false);
    }

  }, [id, flightString]);

  const formatDuration = (departure: string, arrival: string) => {
    const departureTime = new Date(departure);
    const arrivalTime = new Date(arrival);
    const durationMinutes = differenceInMinutes(arrivalTime, departureTime);
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  // Hitung base fare
  const baseFare = flight ? flight.price : 0;
  const total = baseFare;

  const handleBookNow = async () => {
    if (!user?.email) return;

    try {
      // Check for pending payments
      const bookings = await getBookings(user?.email, baseUrl);
      const hasPendingPayment = bookings.some(
        booking => booking.status === 'PENDING_PAYMENT'
      );

      if (hasPendingPayment) {
        setShowPendingAlert(true);
        return;
      }

      // If no pending payments, proceed with booking
      router.push({
        pathname: '/booking/new',
        params: { 
          flightId: flight?.id.toString(),
          flight: JSON.stringify(flight),
          num_passengers: numPassengers,
        },
      });
    } catch (err) {
      console.error('Error checking bookings:', err);
      setError('Unable to check booking status. Please try again.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Flight Details
          </Text>
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
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Flight Details
          </Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error || 'Flight not found'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Flight Details
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={[styles.flightCode, { color: colors.text }]}>
                {flight.flight_code}
              </Text>
              <Text
                style={[styles.airlineName, { color: colors.textSecondary }]}
              >
                {flight.airline_name}
              </Text>
            </View>
            <View
              style={[
                styles.badge,
                {
                  backgroundColor:
                    flight.available_seats > 10
                      ? colors.success + '15'
                      : colors.warning + '15',
                },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  {
                    color:
                      flight.available_seats > 10
                        ? colors.success
                        : colors.warning,
                  },
                ]}
              >
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
              <View
                style={[styles.circle, { backgroundColor: colors.primary }]}
              />
              <View style={[styles.line, { backgroundColor: colors.border }]} />
              <Plane
                size={20}
                color={colors.primary}
                style={{ transform: [{ rotate: '45deg' }] }}
              />
              <View style={[styles.line, { backgroundColor: colors.border }]} />
              <View
                style={[styles.circle, { backgroundColor: colors.primary }]}
              />
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
              <Text
                style={[styles.detailLabel, { color: colors.textSecondary }]}
              >
                Duration:
              </Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {formatDuration(
                  flight.departure_datetime,
                  flight.arrival_datetime
                )}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Users size={18} color={colors.textSecondary} />
              <Text
                style={[styles.detailLabel, { color: colors.textSecondary }]}
              >
                Available Seats:
              </Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {flight.available_seats} seats
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Price Details
          </Text>
          <View style={[styles.priceRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>
              Price
            </Text>
            <Text style={[styles.priceValue, { color: colors.text }]}>
              Rp{baseFare.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={[styles.totalLabel, { color: colors.text }]}>
              Total
            </Text>
            <Text style={[styles.totalValue, { color: colors.primary }]}>
              Rp{total.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.bookButton, { backgroundColor: colors.primary }]}
          onPress={handleBookNow}
        >
          <CreditCard size={20} color={colors.white} />
          <Text style={[styles.bookButtonText, { color: colors.white }]}>
            Book Now
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <AlertDialog
        visible={showPendingAlert}
        title="Pending Payment Required"
        message="You have a pending payment that needs to be completed before making a new booking."
        confirmText="Go to Bookings"
        cancelText="Cancel"
        confirmButtonColor={colors.primary}
        onConfirm={() => {
          setShowPendingAlert(false);
          router.push('/(tabs)/bookings');
        }}
        onCancel={() => setShowPendingAlert(false)}
      />
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
  },
});
