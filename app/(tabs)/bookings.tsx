import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useApi } from '@/context/AuthContext';
import { router } from 'expo-router';
import { Filter } from 'lucide-react-native';
import BookingCard from '@/components/bookings/BookingCard';
import { getBookings } from '@/services/api';
import { BookingSummary } from '@/types';
import EmptyState from '@/components/common/EmptyState';

type FilterStatus = 'ALL' | 'CONFIRMED' | 'PENDING_PAYMENT' | 'EXPIRED' | 'CANCELLED';

export default function BookingsScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { baseUrl } = useApi();
  const [bookings, setBookings] = useState<BookingSummary[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<BookingSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('ALL');

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    if (filterStatus === 'ALL') {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(bookings.filter(booking => booking.status === filterStatus));
    }
  }, [filterStatus, bookings]);

  const loadBookings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${baseUrl}/bookings`, {
        headers: {
          'x-user-email': user?.email || ''
        }
      });
      const data = await response.json();
      setBookings(Array.isArray(data) ? data.reverse() : []);
    } catch (err) {
      setError('Unable to load bookings. Please try again.');
      setBookings([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderFilter = (status: FilterStatus, label: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filterStatus === status && { backgroundColor: colors.primary }
      ]}
      onPress={() => setFilterStatus(status)}
    >
      <Text
        style={[
          styles.filterText,
          { color: filterStatus === status ? colors.white : colors.text }
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const ListHeaderComponent = () => (
    <View style={styles.filtersContainer}>
      {renderFilter('ALL', 'All')}
      {renderFilter('CONFIRMED', 'Confirmed')}
      {renderFilter('PENDING_PAYMENT', 'Pending')}
      {renderFilter('EXPIRED', 'Expired')}
      {/* {renderFilter('CANCELLED', 'Cancelled')} */}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>My Bookings</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={loadBookings}>
          <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: 28 }}>⟳</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading your bookings...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={loadBookings}
          >
            <Text style={[styles.retryButtonText, { color: colors.white }]}>
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      ) : filteredBookings.length > 0 ? (
        <FlatList
          data={filteredBookings}
          keyExtractor={(item) => item.booking_id}
          renderItem={({ item }) => (
            <BookingCard 
              booking={item} 
              onPress={() => router.push(`/booking/${item.booking_id}`)}
            />
          )}
          contentContainerStyle={styles.bookingsList}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={ListHeaderComponent}
        />
      ) : (
        <View>
          <ListHeaderComponent />
          <EmptyState
            icon="ticket"
            title="No bookings found"
            message={filterStatus === 'ALL' 
              ? "You haven't made any bookings yet" 
              : `No ${filterStatus.toLowerCase()} bookings found`}
            actionText="Search Flights"
            onAction={() => router.push('/search')}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontFamily: 'Roboto-Bold',
    fontSize: 24,
  },
  refreshButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.04)',
    marginLeft: 8,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  filterText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  bookingsList: {
    paddingHorizontal: 16,
    paddingBottom: 24,
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