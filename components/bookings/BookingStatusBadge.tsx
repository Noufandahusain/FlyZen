import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { CircleCheck as CheckCircle, Clock, Circle as XCircle } from 'lucide-react-native';

type BookingStatusBadgeProps = {
  status: string;
};

export default function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  const { colors } = useTheme();

  const getStatusStyles = () => {
    switch (status) {
      case 'CONFIRMED':
        return {
          backgroundColor: colors.success + '15',
          textColor: colors.success,
          icon: <CheckCircle size={14} color={colors.success} />
        };
      case 'PENDING':
      case 'PENDING_PAYMENT':
        return {
          backgroundColor: colors.warning + '15',
          textColor: colors.warning,
          icon: <Clock size={14} color={colors.warning} />
        };
      case 'CANCELLED':
        return {
          backgroundColor: colors.error + '15',
          textColor: colors.error,
          icon: <XCircle size={14} color={colors.error} />
        };
      default:
        return {
          backgroundColor: colors.textSecondary + '15',
          textColor: colors.textSecondary,
          icon: null
        };
    }
  };

  const { backgroundColor, textColor, icon } = getStatusStyles();

  const getStatusText = () => {
    switch (status) {
      case 'CONFIRMED': return 'Confirmed';
      case 'PENDING': return 'Pending';
      case 'PENDING_PAYMENT': return 'Pending Payment';
      case 'CANCELLED': return 'Cancelled';
      default: return status;
    }
  };

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      {icon}
      <Text style={[styles.text, { color: textColor }]}>
        {getStatusText()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  text: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    marginLeft: 4,
  }
});