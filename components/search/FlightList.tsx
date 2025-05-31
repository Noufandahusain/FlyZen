import { View, Text, StyleSheet, FlatList } from 'react-native';
import { router } from 'expo-router';
import { Flight } from '@/types';
import FlightCard from './FlightCard';

type FlightListProps = {
  flights: Flight[];
  contentContainerStyle?: any;
};

export default function FlightList({
  flights,
  contentContainerStyle,
}: FlightListProps) {
  const handleFlightPress = (flight: Flight) => {
    router.push({
      pathname: '/flight/[id]' as const,
      params: { id: flight.id.toString() },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.resultsText}>{flights.length} flights found</Text>
      <FlatList
        data={flights}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <FlightCard flight={item} onPress={() => handleFlightPress(item)} />
        )}
        contentContainerStyle={[styles.listContent, contentContainerStyle]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  resultsText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 16,
  },
});
