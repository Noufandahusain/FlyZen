import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Plane, Clock, DollarSign } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { Flight } from '@/types';
import { format, differenceInMinutes } from 'date-fns';

type FlightCardProps = {
  flight: Flight;
  onPress: () => void;
};

export default function FlightCard({ flight, onPress }: FlightCardProps) {
  const { colors } = useTheme();

  const formatDuration = () => {
    const departureTime = new Date(flight.departure_datetime);
    const arrivalTime = new Date(flight.arrival_datetime);
    const durationMinutes = differenceInMinutes(arrivalTime, departureTime);
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: colors.cardBackground }]} 
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={styles.airlineInfo}>
          <Text style={[styles.airlineName, { color: colors.text }]}>
            {flight.airline_name}
          </Text>
          <Text style={[styles.flightNumber, { color: colors.textSecondary }]}>
            {flight.flight_code}
          </Text>
        </View>
        <View style={[styles.priceTag, { backgroundColor: colors.primary + '15' }]}>
          <Text style={[styles.price, { color: colors.primary }]}>
            Rp{flight.price.toLocaleString('id-ID')}
          </Text>
        </View>
      </View>

      <View style={styles.flightRoute}>
        <View style={styles.locationColumn}>
          <Text style={[styles.time, { color: colors.text }]}>
            {format(new Date(flight.departure_datetime), 'HH:mm')}
          </Text>
          <Text style={[styles.city, { color: colors.text }]}>
            {flight.origin_city}
          </Text>
        </View>
        
        <View style={styles.flightPathView}>
          <View style={[styles.circle, { backgroundColor: colors.primary }]} />
          <View style={[styles.line, { backgroundColor: colors.border }]} />
          <Plane size={18} color={colors.primary} style={{ transform: [{ rotate: '45deg' }] }} />
          <View style={[styles.line, { backgroundColor: colors.border }]} />
          <View style={[styles.circle, { backgroundColor: colors.primary }]} />
        </View>

        <View style={styles.locationColumn}>
          <Text style={[styles.time, { color: colors.text }]}>
            {format(new Date(flight.arrival_datetime), 'HH:mm')}
          </Text>
          <Text style={[styles.city, { color: colors.text }]}>
            {flight.destination_city}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.infoItem}>
          <Clock size={14} color={colors.textSecondary} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            {formatDuration()}
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
    marginBottom: 16,
  },
  airlineInfo: {
    flex: 1,
  },
  airlineName: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
  },
  flightNumber: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginTop: 2,
  },
  priceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 16,
  },
  price: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    marginLeft: 2,
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
  time: {
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
    marginBottom: 4,
  },
  city: {
    fontFamily: 'Inter-Medium',
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginLeft: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  }
});