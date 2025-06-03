import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { ArrowLeft, Plane, Users, Clock } from 'lucide-react-native';
import { format, differenceInMinutes } from 'date-fns';
import { Flight } from '@/types';
import { createBooking, searchFlights } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { useApi } from '@/context/AuthContext';

type PassengerDetail = {
  name: string;
  seat_preference: string;
};

type FieldError = {
  name?: string;
};

export default function NewBookingScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { baseUrl } = useApi();
  const { flightId, flight: flightString, num_passengers } = useLocalSearchParams<{ 
    flightId: string;
    flight?: string;
    num_passengers?: string;
  }>();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [numPassengers, setNumPassengers] = useState(Number(num_passengers) || 1);
  const [passengerDetails, setPassengerDetails] = useState<PassengerDetail[]>([
    { name: '', seat_preference: 'Window' },
  ]);
  const [fieldErrors, setFieldErrors] = useState<FieldError[]>([{}]);

  useEffect(() => {
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
    } else {
      setError('Flight data not passed during navigation.');
      setLoading(false);
    }
  }, [flightString]);

  useEffect(() => {
    // Update passenger details array when number of passengers changes
    const newDetails = [...passengerDetails];
    const newErrors = [...fieldErrors];
    if (numPassengers > passengerDetails.length) {
      // Add new passengers
      for (let i = passengerDetails.length; i < numPassengers; i++) {
        newDetails.push({ name: '', seat_preference: 'Window' });
        newErrors.push({});
      }
    } else if (numPassengers < passengerDetails.length) {
      // Remove excess passengers
      newDetails.splice(numPassengers);
      newErrors.splice(numPassengers);
    }
    setPassengerDetails(newDetails);
    setFieldErrors(newErrors);
  }, [numPassengers]);

  const formatDuration = (departure: string, arrival: string) => {
    const departureTime = new Date(departure);
    const arrivalTime = new Date(arrival);
    const durationMinutes = differenceInMinutes(arrivalTime, departureTime);
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const validateFields = (): boolean => {
    let isValid = true;
    const newErrors: FieldError[] = passengerDetails.map((passenger) => {
      const errors: FieldError = {};
      if (!passenger.name.trim()) {
        errors.name = 'Name is required';
        isValid = false;
      }
      return errors;
    });

    setFieldErrors(newErrors);
    return isValid;
  };

  const handlePassengerDetailChange = (
    index: number,
    field: keyof PassengerDetail,
    value: string
  ) => {
    const newDetails = [...passengerDetails];
    newDetails[index] = { ...newDetails[index], [field]: value };
    setPassengerDetails(newDetails);

    // Clear error when user starts typing
    if (fieldErrors[index]?.[field as keyof FieldError]) {
      const newErrors = [...fieldErrors];
      newErrors[index] = { ...newErrors[index], [field]: undefined };
      setFieldErrors(newErrors);
    }
  };

  const handleSubmit = async () => {
    if (!flight || !user?.email) return;

    // if (!validateFields()) {
    //   return;
    // }

    setSubmitting(true);
    setError(null);

    try {
      const bookingData = {
        flight_id: flight.id.toString(),
        num_seats: numPassengers
      };

      await createBooking(bookingData, user?.email || '', baseUrl);
      router.replace('/(tabs)/bookings');
    } catch (err) {
      setError('Failed to create booking. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
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
            New Booking
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
            New Booking
          </Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error || 'Flight not found'}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={() => {
              // Implement retry logic
            }}
          >
            <Text style={[styles.retryButtonText, { color: colors.white }]}>
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Hitung base fare
  const baseFare = flight ? flight.price * numPassengers : 0;
  const total = baseFare;

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
          New Booking
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
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Number of Passengers
          </Text>
          <View style={styles.counterContainer}>
            <TouchableOpacity
              style={[styles.counterButton, { backgroundColor: colors.background }]}
              onPress={() => {
                if (numPassengers > 1) {
                  setNumPassengers(numPassengers - 1);
                }
              }}
            >
              <Text style={[styles.counterButtonText, { color: colors.text }]}>-</Text>
            </TouchableOpacity>
            <Text style={[styles.passengerCount, { color: colors.text }]}>
              {numPassengers}
            </Text>
            <TouchableOpacity
              style={[styles.counterButton, { backgroundColor: colors.background }]}
              onPress={() => {
                if (numPassengers < flight.available_seats) {
                  setNumPassengers(numPassengers + 1);
                }
              }}
            >
              <Text style={[styles.counterButtonText, { color: colors.text }]}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Passenger Details
          </Text>
          {passengerDetails.map((passenger, index) => (
            <View key={index} style={styles.passengerForm}>
              <Text style={[styles.passengerLabel, { color: colors.text }]}>
                Passenger {index + 1}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    borderColor: fieldErrors[index]?.name
                      ? colors.error
                      : colors.border,
                  },
                ]}
                placeholder="Full Name"
                placeholderTextColor={colors.textSecondary}
                value={passenger.name}
                onChangeText={(value) =>
                  handlePassengerDetailChange(index, 'name', value)
                }
              />
              {fieldErrors[index]?.name && (
                <Text style={[styles.errorText, { color: colors.error }]}>
                  {fieldErrors[index].name}
                </Text>
              )}
            </View>
          ))}
        </View> */}

        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Price Details
          </Text>
          <View style={[styles.priceRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>
              Price ({numPassengers} {numPassengers === 1 ? 'ticket' : 'tickets'})
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
          style={[styles.submitButton, { backgroundColor: colors.primary }]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={[styles.submitButtonText, { color: colors.white }]}>
              Confirm Booking
            </Text>
          )}
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
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterButtonText: {
    fontSize: 24,
    fontFamily: 'Inter-Medium',
  },
  passengerCount: {
    fontFamily: 'Roboto-Medium',
    fontSize: 20,
    marginHorizontal: 24,
  },
  passengerForm: {
    paddingVertical: 16,
  },
  passengerLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
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
  submitButton: {
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  submitButtonText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
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
