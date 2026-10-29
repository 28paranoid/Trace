import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { colors } from '@/constants/colors';

export default function MemoryPreview({ memory, onClose }) {
  if (!memory) return null;

  return (
    <View style={styles.container}>
      <Link href={`/memory/${memory.id}`} asChild>
        <TouchableOpacity style={styles.card} activeOpacity={0.9}>
          {memory.image_url && (
            <Image source={{ uri: memory.image_url }} style={styles.image} />
          )}
          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={1}>{memory.title}</Text>
            {memory.place_name && (
              <Text style={styles.place} numberOfLines={1}>{memory.place_name}</Text>
            )}
          </View>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  image: {
    width: 80,
    height: 80,
    backgroundColor: colors.borderLight,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  place: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});
