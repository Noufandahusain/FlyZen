import { View, Text, StyleSheet, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { router } from 'expo-router';

const destinations = [
  {
    id: '1',
    city: 'Bali',
    country: 'Indonesia',
    code: 'DPS',
    image: 'https://images.pexels.com/photos/3225531/pexels-photo-3225531.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '2',
    city: 'Tokyo',
    country: 'Japan',
    code: 'HND',
    image: 'https://images.pexels.com/photos/1510595/pexels-photo-1510595.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '3',
    city: 'Paris',
    country: 'France',
    code: 'CDG',
    image: 'https://images.pexels.com/photos/699466/pexels-photo-699466.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '4',
    city: 'New York',
    country: 'USA',
    code: 'JFK',
    image: 'https://images.pexels.com/photos/802024/pexels-photo-802024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
];

export default function FeaturedDestinations() {
  const { colors } = useTheme();

  const handleDestinationPress = (destination: typeof destinations[0]) => {
    router.push({
      pathname: '/search',
      params: { destination: destination.code }
    });
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {destinations.map((destination) => (
        <TouchableOpacity
          key={destination.id}
          style={styles.card}
          onPress={() => handleDestinationPress(destination)}
        >
          <ImageBackground
            source={{ uri: destination.image }}
            style={styles.image}
            imageStyle={styles.imageStyle}
          >
            <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.3)' }]}>
              <View style={styles.content}>
                <Text style={[styles.city, { color: colors.white }]}>
                  {destination.city}
                </Text>
                <Text style={[styles.country, { color: colors.white }]}>
                  {destination.country}
                </Text>
              </View>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingRight: 16,
  },
  card: {
    width: 160,
    height: 200,
    borderRadius: 16,
    marginRight: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageStyle: {
    borderRadius: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    justifyContent: 'flex-end',
  },
  content: {
    padding: 12,
  },
  city: {
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
    marginBottom: 4,
  },
  country: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  }
});