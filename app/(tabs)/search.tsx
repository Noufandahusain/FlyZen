import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { ArrowLeft } from 'lucide-react-native';
import SearchForm from '@/components/search/SearchForm';
import FlightCard from '@/components/search/FlightCard';
import { searchFlights } from '@/services/api';
import { Flight } from '@/types';
import EmptyState from '@/components/common/EmptyState';

export default function SearchScreen() {
  const { colors } = useTheme();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (searchParams: any) => {
    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const results = await searchFlights(searchParams);
      setFlights(results);
    } catch (err) {
      setError('Unable to fetch flights. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderResults = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Searching for the best flights...
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={() => handleSearch({})}
          >
            <Text style={[styles.retryButtonText, { color: colors.white }]}>
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (searched && flights.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <EmptyState
            icon="search"
            title="No flights found"
            message="Try adjusting your search criteria"
          />
        </View>
      );
    }

    if (flights.length > 0) {
      return (
        <>
          <Text style={[styles.resultsText, { color: colors.text }]}>
            {flights.length} flights found
          </Text>
          {flights.map((flight) => (
            <FlightCard
              key={flight.id}
              flight={flight}
              onPress={() =>
                router.push({
                  pathname: '/flight/[id]' as const,
                  params: { id: flight.id.toString() },
                })
              }
            />
          ))}
        </>
      );
    }

    return null;
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Find Flights
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SearchForm onSearch={handleSearch} />
        {renderResults()}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  centerContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  resultsText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
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
