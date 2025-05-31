import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Platform,
  InteractionManager,
  BackHandler,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { ArrowLeft, Users, Save } from 'lucide-react-native';
import { getBookingById, updateBooking } from '@/services/api';
import { BookingDetail, PassengerDetail } from '@/types';

export default function EditBookingScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [passengers, setPassengers] = useState<PassengerDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    loadBooking();
  }, [id]);

  // Handle back button press
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (showConfirmDialog) {
          setShowConfirmDialog(false);
          return true;
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, [showConfirmDialog]);

  const loadBooking = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getBookingById(id);
      setBooking(data);
      setPassengers(data.passenger_details || []);
    } catch (err) {
      setError('Unable to load booking details. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSave = async () => {
    if (!booking || !id) return;

    try {
      setSaving(true);
      await updateBooking(id, {
        passenger_details: passengers,
      });
      router.push('/(tabs)/bookings');
    } catch (err) {
      setError('Failed to update booking. Please try again.');
      console.error(err);
    } finally {
      setSaving(false);
      setShowConfirmDialog(false);
    }
  };

  const updatePassenger = (
    index: number,
    field: keyof PassengerDetail,
    value: string
  ) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      [field]: value,
    };
    setPassengers(updatedPassengers);
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
            Edit Booking
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
            Edit Booking
          </Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error || 'Booking not found'}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={loadBooking}
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
          Edit Booking
        </Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => setShowConfirmDialog(true)}
          disabled={saving}
        >
          <Save size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={[
          { type: 'header' as const },
          ...passengers.map((p, i) => ({
            type: 'passenger' as const,
            passenger: p,
            index: i,
          })),
        ]}
        keyExtractor={(item, index) =>
          item.type === 'header' ? 'header' : `passenger-${index}`
        }
        contentContainerStyle={styles.content}
        renderItem={({
          item,
        }: {
          item:
            | { type: 'header' }
            | { type: 'passenger'; passenger: PassengerDetail; index: number };
        }) => {
          if (item.type === 'header') {
            return (
              <View
                style={[
                  styles.card,
                  { backgroundColor: colors.cardBackground },
                ]}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.headerInfo}>
                    <Text style={[styles.flightCode, { color: colors.text }]}>
                      {booking.flight_details.flight_code}
                    </Text>
                    <Text
                      style={[
                        styles.bookingId,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Booking #{booking.booking_id.substring(0, 8)}
                    </Text>
                  </View>
                  <View style={styles.passengerCount}>
                    <Users size={16} color={colors.textSecondary} />
                    <Text
                      style={[
                        styles.passengerCountText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {booking.num_tickets} passengers
                    </Text>
                  </View>
                </View>

                <View
                  style={[styles.divider, { backgroundColor: colors.border }]}
                />

                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Passenger Information
                </Text>
              </View>
            );
          }

          const { passenger, index } = item;
          return (
            <View
              style={[
                styles.passengerForm,
                styles.card,
                { backgroundColor: colors.cardBackground },
              ]}
            >
              <Text style={[styles.passengerTitle, { color: colors.text }]}>
                Passenger {index + 1}
              </Text>

              <View style={styles.inputGroup}>
                <Text
                  style={[styles.inputLabel, { color: colors.textSecondary }]}
                >
                  Full Name
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    { color: colors.text, borderColor: colors.border },
                  ]}
                  value={passenger.name}
                  onChangeText={(value) =>
                    updatePassenger(index, 'name', value)
                  }
                  placeholder="Enter passenger name"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text
                  style={[styles.inputLabel, { color: colors.textSecondary }]}
                >
                  Seat Preference
                </Text>
                <View style={styles.seatPreferenceContainer}>
                  {['Window', 'Middle', 'Aisle'].map((preference) => (
                    <TouchableOpacity
                      key={preference}
                      style={[
                        styles.seatPreferenceButton,
                        passenger.seat_preference === preference && {
                          backgroundColor: colors.primary,
                        },
                      ]}
                      onPress={() =>
                        updatePassenger(index, 'seat_preference', preference)
                      }
                    >
                      <Text
                        style={[
                          styles.seatPreferenceText,
                          {
                            color:
                              passenger.seat_preference === preference
                                ? colors.white
                                : colors.text,
                          },
                        ]}
                      >
                        {preference}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          );
        }}
      />

      <Modal
        visible={showConfirmDialog}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirmDialog(false)}
      >
        <Pressable
          style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
          onPress={() => setShowConfirmDialog(false)}
        >
          <Pressable
            style={[
              styles.modalContent,
              { backgroundColor: colors.cardBackground },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Save Changes
            </Text>
            <Text
              style={[styles.modalMessage, { color: colors.textSecondary }]}
            >
              Are you sure you want to save these changes to your booking?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { backgroundColor: colors.background },
                ]}
                onPress={() => setShowConfirmDialog(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { backgroundColor: colors.primary },
                ]}
                onPress={handleConfirmSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color={colors.white} size="small" />
                ) : (
                  <Text
                    style={[styles.modalButtonText, { color: colors.white }]}
                  >
                    Save Changes
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
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerInfo: {
    flex: 1,
  },
  flightCode: {
    fontFamily: 'Roboto-Medium',
    fontSize: 18,
  },
  bookingId: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginTop: 4,
  },
  passengerCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passengerCountText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginLeft: 4,
  },
  divider: {
    height: 1,
    width: '100%',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    marginBottom: 16,
  },
  passengerForm: {
    paddingVertical: 16,
  },
  passengerTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
  },
  seatPreferenceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  seatPreferenceButton: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
  },
  seatPreferenceText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
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
