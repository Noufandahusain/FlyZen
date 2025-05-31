import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  InteractionManager,
  BackHandler,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useLocalSearchParams, router } from 'expo-router';
import {
  ArrowLeft,
  CalendarClock,
  Plane,
  Users,
  CreditCard as Edit2,
  Trash2,
} from 'lucide-react-native';
import { getBookingById, cancelBooking } from '@/services/api';
import { BookingDetail } from '@/types';
import { format } from 'date-fns';
import BookingStatusBadge from '@/components/bookings/BookingStatusBadge';

export default function BookingDetailScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelConfirmVisible, setCancelConfirmVisible] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (id) {
      loadBooking(id);
    }
  }, [id]);

  // Handle back button press
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (cancelConfirmVisible) {
          setCancelConfirmVisible(false);
          return true;
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, [cancelConfirmVisible]);

  const loadBooking = async (bookingId: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getBookingById(bookingId);
      setBooking(data);
    } catch (err) {
      setError('Unable to load booking details. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCancel = async () => {
    if (!id) return;

    try {
      setCancelling(true);
      await cancelBooking(id);
      router.push('/(tabs)/bookings');
    } catch (err) {
      setError('Failed to cancel booking. Please try again.');
      console.error(err);
    } finally {
      setCancelling(false);
      setCancelConfirmVisible(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy • h:mm a');
    } catch (err) {
      return dateString;
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
            Booking Details
          </Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading booking details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !booking) {
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
            Booking Details
          </Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error || 'Booking not found'}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={() => id && loadBooking(id)}
          >
            <Text style={[styles.retryButtonText, { color: colors.white }]}>
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const canCancel = booking.status !== 'CANCELLED';
  const canEdit =
    booking.status === 'PENDING' || booking.status === 'CONFIRMED';

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
          Booking Details
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={[styles.flightCode, { color: colors.text }]}>
                {booking.flight_details.flight_code}
              </Text>
              <Text
                style={[styles.airlineName, { color: colors.textSecondary }]}
              >
                {booking.flight_details.airline_name}
              </Text>
            </View>
            <BookingStatusBadge status={booking.status} />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.flightRoute}>
            <View style={styles.locationColumn}>
              <Text style={[styles.city, { color: colors.text }]}>
                {booking.flight_details.origin_city}
              </Text>
              <Text style={[styles.time, { color: colors.text }]}>
                {format(
                  new Date(booking.flight_details.departure_datetime),
                  'h:mm a'
                )}
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
                {booking.flight_details.destination_city}
              </Text>
              <Text style={[styles.time, { color: colors.text }]}>
                {format(
                  new Date(booking.flight_details.arrival_datetime),
                  'h:mm a'
                )}
              </Text>
            </View>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <CalendarClock size={18} color={colors.textSecondary} />
              <Text
                style={[styles.detailLabel, { color: colors.textSecondary }]}
              >
                Date:
              </Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {format(
                  new Date(booking.flight_details.departure_datetime),
                  'EEEE, MMMM d, yyyy'
                )}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Users size={18} color={colors.textSecondary} />
              <Text
                style={[styles.detailLabel, { color: colors.textSecondary }]}
              >
                Passengers:
              </Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {booking.num_tickets}{' '}
                {booking.num_tickets === 1 ? 'passenger' : 'passengers'}
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
              Base Fare ({booking.num_tickets}{' '}
              {booking.num_tickets === 1 ? 'ticket' : 'tickets'})
            </Text>
            <Text style={[styles.priceValue, { color: colors.text }]}>
              ${booking.flight_details.price * booking.num_tickets}
            </Text>
          </View>
          <View style={[styles.priceRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>
              Taxes & Fees
            </Text>
            <Text style={[styles.priceValue, { color: colors.text }]}>$35</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={[styles.totalLabel, { color: colors.text }]}>
              Total
            </Text>
            <Text style={[styles.totalValue, { color: colors.primary }]}>
              ${booking.total_price}
            </Text>
          </View>
        </View>

        {booking.passenger_details && booking.passenger_details.length > 0 && (
          <View
            style={[styles.card, { backgroundColor: colors.cardBackground }]}
          >
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Passenger Information
            </Text>
            {booking.passenger_details.map((passenger, index) => (
              <View
                key={index}
                style={[
                  styles.passengerRow,
                  index < booking.passenger_details!.length - 1 && {
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                <Text style={[styles.passengerName, { color: colors.text }]}>
                  {passenger.name}
                </Text>
                {passenger.seat_preference && (
                  <Text
                    style={[
                      styles.seatPreference,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {passenger.seat_preference} seat
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        <View style={styles.actionsContainer}>
          {canEdit && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.primary }]}
              onPress={() => router.push(`/booking/edit/${id}`)}
            >
              <Edit2 size={18} color={colors.white} />
              <Text style={[styles.actionButtonText, { color: colors.white }]}>
                Edit Booking
              </Text>
            </TouchableOpacity>
          )}

          {canCancel && (
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: colors.error + '15' },
              ]}
              onPress={() => setCancelConfirmVisible(true)}
            >
              <Trash2 size={18} color={colors.error} />
              <Text style={[styles.actionButtonText, { color: colors.error }]}>
                Cancel Booking
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={cancelConfirmVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCancelConfirmVisible(false)}
      >
        <Pressable
          style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
          onPress={() => setCancelConfirmVisible(false)}
        >
          <Pressable
            style={[
              styles.modalContent,
              { backgroundColor: colors.cardBackground },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Cancel Booking
            </Text>
            <Text
              style={[styles.modalMessage, { color: colors.textSecondary }]}
            >
              Are you sure you want to cancel this booking? This action cannot
              be undone.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { backgroundColor: colors.background },
                ]}
                onPress={() => setCancelConfirmVisible(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>
                  No, Keep It
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.error }]}
                onPress={handleConfirmCancel}
                disabled={cancelling}
              >
                {cancelling ? (
                  <ActivityIndicator color={colors.white} size="small" />
                ) : (
                  <Text
                    style={[styles.modalButtonText, { color: colors.white }]}
                  >
                    Yes, Cancel
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
  passengerRow: {
    paddingVertical: 12,
  },
  passengerName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  seatPreference: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 6,
  },
  actionButtonText: {
    fontFamily: 'Inter-Medium',
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 20,
    marginBottom: 8,
  },
  modalMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  modalButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
});
