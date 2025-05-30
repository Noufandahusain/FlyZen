import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar, Map, Users } from 'lucide-react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useTheme } from '@/context/ThemeContext';
import { format } from 'date-fns';

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
          <View style={styles.formField}>
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
                onChangeText={handleChange('origin_city')}
                onBlur={handleBlur('origin_city')}
              />
            </View>
          </View>
          {touched.origin_city && errors.origin_city && (
            <Text style={[styles.errorText, { color: colors.error }]}>{errors.origin_city}</Text>
          )}

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.formField}>
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
                onChangeText={handleChange('destination_city')}
                onBlur={handleBlur('destination_city')}
              />
            </View>
          </View>
          {touched.destination_city && errors.destination_city && (
            <Text style={[styles.errorText, { color: colors.error }]}>{errors.destination_city}</Text>
          )}

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

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
  }
});