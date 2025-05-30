import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { router } from 'expo-router';

export default function PromoCard() {
  const { colors } = useTheme();

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => router.push('/search')}
    >
      <ImageBackground
        source={{ uri: 'https://images.pexels.com/photos/1031593/pexels-photo-1031593.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
        style={styles.background}
        imageStyle={styles.imageStyle}
      >
        <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.4)' }]}>
          <View style={styles.content}>
            <View style={[styles.badge, { backgroundColor: colors.accent }]}>
              <Text style={[styles.badgeText, { color: colors.white }]}>Limited Time</Text>
            </View>
            <Text style={[styles.title, { color: colors.white }]}>
              Summer Sale
            </Text>
            <Text style={[styles.subtitle, { color: colors.white }]}>
              Get up to 25% off on international flights
            </Text>
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: colors.white }]}
              onPress={() => router.push('/search')}
            >
              <Text style={[styles.buttonText, { color: colors.primary }]}>
                Book Now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  background: {
    width: '100%',
    height: '100%',
  },
  imageStyle: {
    borderRadius: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    justifyContent: 'center',
  },
  content: {
    padding: 16,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  badgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  title: {
    fontFamily: 'Roboto-Bold',
    fontSize: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginBottom: 16,
    width: '80%',
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  buttonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  }
});