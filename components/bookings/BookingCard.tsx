import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { BookingSummary } from '@/types';
import { Plane, Calendar } from 'lucide-react-native';
import { format } from 'date-fns';
import BookingStatusBadge from './BookingStatusBadge';

type BookingCardProps = {
  booking: BookingSummary;
  onPress: () => void;
};

export default function BookingCard({ booking, onPress }: BookingCardProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: colors.cardBackground }]} 
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.flightCode, { color: colors.text }]}>
            {booking.flight.name}
          </Text>
          <Text style={[styles.bookingId, { color: colors.textSecondary }]}>
            Booking #{booking.booking_id.substring(0, 8)}
          </Text>
          {/* {booking.user_email && (
            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
              {booking.user_email}
            </Text>
          )} */}
        </View>
        <BookingStatusBadge status={booking.status} />
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Plane size={16} color={colors.textSecondary} />
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>
            {booking.flight.origin} → {booking.flight.destination}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Calendar size={16} color={colors.textSecondary} />
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>
            {format(new Date(booking.flight.departure_time), 'MMM d, yyyy')}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>
          Price
        </Text>
        <Text style={[styles.price, { color: colors.primary }]}>
          Rp{booking.total_price.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  flightCode: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
  },
  bookingId: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginTop: 4,
  },
  divider: {
    height: 1,
    width: '100%',
    marginBottom: 12,
  },
  details: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  price: {
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
  }
});