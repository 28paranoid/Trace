import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { timeAgo } from '@/utils/date';

export default function MemoryCard({ memory }) {
  return (
    <Link href={`/memory/${memory.id}`} asChild>
      <TouchableOpacity style={styles.card} activeOpacity={0.88}>
        {memory.image_url && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: memory.image_url }}
              style={styles.image}
              resizeMode="cover"
            />
            {memory.tag && (
              <View style={styles.tagBadge}>
                <Text style={styles.tagText}>{memory.tag}</Text>
              </View>
            )}
          </View>
        )}
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>{memory.title}</Text>
          {memory.description && (
            <Text style={styles.description} numberOfLines={2}>
              {memory.description}
            </Text>
          )}
          <View style={styles.footer}>
            {memory.place_name ? (
              <View style={styles.locationPill}>
                <Ionicons name="location-sharp" size={13} color={colors.primary} />
                <Text style={styles.place} numberOfLines={1}>{memory.place_name}</Text>
              </View>
            ) : <View />}
            <Text style={styles.date}>{timeAgo(memory.created_at)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 18,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 220,
    backgroundColor: '#EEF2F6',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  tagBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    marginRight: 8,
  },
  place: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primary,
  },
  date: {
    fontSize: 11,
    color: colors.textTertiary,
  },
});
