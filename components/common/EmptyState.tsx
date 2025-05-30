import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Search, Ticket, CircleAlert as AlertCircle } from 'lucide-react-native';

type EmptyStateProps = {
  icon: 'search' | 'ticket' | 'error';
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
};

export default function EmptyState({ 
  icon, 
  title, 
  message, 
  actionText, 
  onAction 
}: EmptyStateProps) {
  const { colors } = useTheme();

  const renderIcon = () => {
    const size = 48;
    const color = colors.textSecondary;

    switch (icon) {
      case 'search':
        return <Search size={size} color={color} />;
      case 'ticket':
        return <Ticket size={size} color={color} />;
      case 'error':
        return <AlertCircle size={size} color={color} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
        {renderIcon()}
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
      
      {actionText && onAction && (
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={onAction}
        >
          <Text style={[styles.actionButtonText, { color: colors.white }]}>
            {actionText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Roboto-Medium',
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  actionButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  actionButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  }
});