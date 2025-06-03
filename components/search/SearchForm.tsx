import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar, Map, Users } from 'lucide-react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useTheme } from '@/context/ThemeContext';
import { format } from 'date-fns';

// Static list of Indonesian cities (add more as needed)
const IndonesianCities = [
  'Jakarta',
  'Surabaya',
  'Bandung',
  'Medan',
  'Semarang',
  'Yogyakarta',
  'Denpasar',
  'Makassar',
  'Palembang',
  'Tangerang',
];

const SearchSchema = Yup.object().shape({
  origin_city: Yup.string().required('Origin is required'),
  destination_city: Yup.string().required('Destination is required'),
  departure_date: Yup.date().required('Departure date is required'),
  num_passengers: Yup.number().min(1, 'At least 1 passenger is required').max(9, 'Maximum 9 passengers allowed')
});

type SearchFormProps = {
  onSearch: (values: any) => void;
};

export default function SearchForm({ onSearch }: SearchFormProps) {
  const { colors } = useTheme();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [originSuggestions, setOriginSuggestions] = useState<string[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<string[]>([]);

  // Define styles that use the colors object inside the component
  const themedStyles = StyleSheet.create({
    suggestionsContainer: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      backgroundColor: colors.cardBackground,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      marginTop: 2,
      maxHeight: 150,
      zIndex: 9999,
      elevation: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
    },
    suggestionItem: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.cardBackground,
    },
    suggestionText: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.text,
    },
  });

  const initialValues = {
    origin_city: '',
    destination_city: '',
    departure_date: new Date(),
    num_passengers: 1
  };

  const handleDateChange = (setFieldValue: any) => (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setFieldValue('departure_date', selectedDate);
    }
  };

  const filterCities = (text: string, setSuggestions: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (!text) {
      setSuggestions([]);
      return;
    }
    const filtered = IndonesianCities.filter(city =>
      city.toLowerCase().includes(text.toLowerCase())
    );
    setSuggestions(filtered);
  };

  const handleCitySelect = (city: string, field: 'origin_city' | 'destination_city', setFieldValue: any, setSuggestions: React.Dispatch<React.SetStateAction<string[]>>) => {
    setFieldValue(field, city);
    setSuggestions([]);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={SearchSchema}
      onSubmit={(values) => {
        onSearch({
          ...values,
          departure_date: format(values.departure_date, 'yyyy-MM-dd')
        });
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
        <View style={[styles.formContainer, { backgroundColor: colors.cardBackground }]}>
          {/* Origin Field */}
          <View style={[styles.formField, { zIndex: originSuggestions.length > 0 ? 1000 : 1 }]}>
            <View style={styles.inputIconContainer}>
              <Map size={20} color={colors.primary} />
            </View>
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>From</Text>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Enter city or airport code"
                placeholderTextColor={colors.textSecondary}
                value={values.origin_city}
                onChangeText={(text) => {
                  handleChange('origin_city')(text);
                  filterCities(text, setOriginSuggestions);
                }}
                onBlur={(e) => {
                  handleBlur('origin_city')(e);
                  setTimeout(() => setOriginSuggestions([]), 200);
                }}
                onFocus={() => filterCities(values.origin_city, setOriginSuggestions)}
              />
              {originSuggestions.length > 0 && (
                <View style={themedStyles.suggestionsContainer}>
                  <ScrollView 
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                  >
                    {originSuggestions.map((item) => (
                      <TouchableOpacity
                        key={item}
                        style={themedStyles.suggestionItem}
                        onPress={() => handleCitySelect(item, 'origin_city', setFieldValue, setOriginSuggestions)}
                        activeOpacity={0.7}
                      >
                        <Text style={themedStyles.suggestionText}>
                          {item}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          </View>
          {touched.origin_city && errors.origin_city && (
            <Text style={[styles.errorText, { color: colors.error }]}>{errors.origin_city}</Text>
          )}

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Destination Field */}
          <View style={[styles.formField, { zIndex: destinationSuggestions.length > 0 ? 999 : 1 }]}>
            <View style={styles.inputIconContainer}>
              <Map size={20} color={colors.primary} />
            </View>
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>To</Text>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Enter city or airport code"
                placeholderTextColor={colors.textSecondary}
                value={values.destination_city}
                onChangeText={(text) => {
                  handleChange('destination_city')(text);
                  filterCities(text, setDestinationSuggestions);
                }}
                onBlur={(e) => {
                  handleBlur('destination_city')(e);
                  setTimeout(() => setDestinationSuggestions([]), 200);
                }}
                onFocus={() => filterCities(values.destination_city, setDestinationSuggestions)}
              />
              {destinationSuggestions.length > 0 && (
                <View style={themedStyles.suggestionsContainer}>
                  <ScrollView 
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                  >
                    {destinationSuggestions.map((item) => (
                      <TouchableOpacity
                        key={item}
                        style={themedStyles.suggestionItem}
                        onPress={() => handleCitySelect(item, 'destination_city', setFieldValue, setDestinationSuggestions)}
                        activeOpacity={0.7}
                      >
                        <Text style={themedStyles.suggestionText}>
                          {item}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          </View>
          {touched.destination_city && errors.destination_city && (
            <Text style={[styles.errorText, { color: colors.error }]}>{errors.destination_city}</Text>
          )}

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Date Field */}
          <View style={styles.formField}>
            <View style={styles.inputIconContainer}>
              <Calendar size={20} color={colors.primary} />
            </View>
            <TouchableOpacity 
              style={styles.inputContainer}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Departure Date</Text>
              <Text style={[styles.dateText, { color: colors.text }]}>
                {format(values.departure_date, 'EEE, MMM d, yyyy')}
              </Text>
            </TouchableOpacity>
          </View>
          {showDatePicker && (
            <DateTimePicker
              value={values.departure_date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange(setFieldValue)}
              minimumDate={new Date()}
            />
          )}

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Passengers Field */}
          <View style={styles.formField}>
            <View style={styles.inputIconContainer}>
              <Users size={20} color={colors.primary} />
            </View>
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Passengers</Text>
              <View style={styles.counterContainer}>
                <TouchableOpacity
                  style={[styles.counterButton, { backgroundColor: colors.background }]}
                  onPress={() => {
                    if (values.num_passengers > 1) {
                      setFieldValue('num_passengers', values.num_passengers - 1);
                    }
                  }}
                >
                  <Text style={[styles.counterButtonText, { color: colors.text }]}>-</Text>
                </TouchableOpacity>
                <Text style={[styles.passengerCount, { color: colors.text }]}>
                  {values.num_passengers}
                </Text>
                <TouchableOpacity
                  style={[styles.counterButton, { backgroundColor: colors.background }]}
                  onPress={() => {
                    if (values.num_passengers < 9) {
                      setFieldValue('num_passengers', values.num_passengers + 1);
                    }
                  }}
                >
                  <Text style={[styles.counterButtonText, { color: colors.text }]}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.searchButton, { backgroundColor: colors.primary }]}
            onPress={() => handleSubmit()}
          >
            <Text style={[styles.searchButtonText, { color: colors.white }]}>Search Flights</Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    borderRadius: 16,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  formField: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  inputIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    marginLeft: 8,
    position: 'relative',
  },
  inputLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginBottom: 4,
  },
  input: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    padding: 0,
  },
  dateText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  divider: {
    height: 1,
    width: '100%',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  passengerCount: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginHorizontal: 16,
  },
  searchButton: {
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  searchButtonText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 48,
  },
});