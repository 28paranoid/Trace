import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { MOCK_MEMORIES } from '@/constants/mockData';
import { timeAgo } from '@/utils/date';

export default function MemoryDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const memory =
    MOCK_MEMORIES.find((m) => m.id === id) || MOCK_MEMORIES[0];

  const [isFavorite, setIsFavorite] = useState(memory.is_favorite ?? false);

  // Photos taken at the same place
  const samePlacePhotos = MOCK_MEMORIES.filter(
    (m) =>
      m.id !== memory.id &&
      m.place_name &&
      memory.place_name &&
      m.place_name.toLowerCase() === memory.place_name.toLowerCase()
  );

  // Photos taken on the same date
  const memoryDateStr = new Date(memory.taken_at || memory.created_at).toDateString();
  const sameDatePhotos = MOCK_MEMORIES.filter((m) => {
    if (m.id === memory.id) return false;
    const dStr = new Date(m.taken_at || m.created_at).toDateString();
    return dStr === memoryDateStr;
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Hero Image */}
      <View style={styles.heroContainer}>
        <Image
          source={{ uri: memory.image_url }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.heroOverlay} />

        {/* Navigation Bar over Hero */}
        <SafeAreaView style={styles.navBar}>
          <TouchableOpacity
            style={styles.circleButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.navRight}>
            <TouchableOpacity
              style={[styles.circleButton, isFavorite && styles.circleButtonFavorite]}
              onPress={() => setIsFavorite(!isFavorite)}
            >
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={20}
                color={isFavorite ? "#EF4444" : "#FFFFFF"}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.circleButton}>
              <Ionicons name="share-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Hero Title & Tag */}
        <View style={styles.heroContent}>
          <View style={styles.badgeRow}>
            {memory.tag && (
              <View style={styles.tagBadge}>
                <Text style={styles.tagText}>{memory.tag}</Text>
              </View>
            )}
            {isFavorite && (
              <View style={styles.favoritePill}>
                <Ionicons name="heart" size={12} color="#FFFFFF" />
                <Text style={styles.favoritePillText}>Favorite</Text>
              </View>
            )}
          </View>
          <Text style={styles.title}>{memory.caption || memory.title}</Text>
        </View>
      </View>

      {/* Memory Content */}
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* Location & Time bar */}
        <View style={styles.metaCard}>
          <View style={styles.metaRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="location" size={18} color={colors.primary} />
            </View>
            <View style={styles.metaTextGroup}>
              <Text style={styles.metaLabel}>LOCATION</Text>
              <Text style={styles.metaValue}>{memory.place_name}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.metaRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="calendar-outline" size={18} color={colors.primary} />
            </View>
            <View style={styles.metaTextGroup}>
              <Text style={styles.metaLabel}>CAPTURED</Text>
              <Text style={styles.metaValue}>
                {new Date(memory.taken_at || memory.created_at).toLocaleDateString([], {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}{' '}
                • {timeAgo(memory.created_at)}
              </Text>
            </View>
          </View>
        </View>

        {/* Memory Story */}
        <View style={styles.storySection}>
          <Text style={styles.sectionHeading}>The Story</Text>
          <Text style={styles.storyText}>{memory.description}</Text>
        </View>

        {/* 1. All photos on this Place */}
        {samePlacePhotos.length > 0 && (
          <View style={styles.gallerySection}>
            <View style={styles.galleryHeader}>
              <Ionicons name="location" size={16} color={colors.primary} />
              <Text style={styles.galleryTitle}>
                All photos from {memory.place_name} ({samePlacePhotos.length + 1})
              </Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryScroll}>
              {/* Current photo */}
              <View style={[styles.galleryThumbFrame, styles.galleryThumbActive]}>
                <Image source={{ uri: memory.image_url }} style={styles.galleryThumbImg} />
                <View style={styles.activeTag}>
                  <Text style={styles.activeTagText}>Viewing</Text>
                </View>
              </View>
              {samePlacePhotos.map((m) => (
                <TouchableOpacity
                  key={m.id}
                  style={styles.galleryThumbFrame}
                  onPress={() => router.push(`/memory/${m.id}`)}
                >
                  <Image source={{ uri: m.image_url }} style={styles.galleryThumbImg} />
                  <Text style={styles.thumbCaption} numberOfLines={1}>{m.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* 2. All photos on this Date */}
        {sameDatePhotos.length > 0 && (
          <View style={styles.gallerySection}>
            <View style={styles.galleryHeader}>
              <Ionicons name="calendar" size={16} color={colors.primary} />
              <Text style={styles.galleryTitle}>
                Other photos captured on this date ({sameDatePhotos.length})
              </Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryScroll}>
              {sameDatePhotos.map((m) => (
                <TouchableOpacity
                  key={m.id}
                  style={styles.galleryThumbFrame}
                  onPress={() => router.push(`/memory/${m.id}`)}
                >
                  <Image source={{ uri: m.image_url }} style={styles.galleryThumbImg} />
                  <Text style={styles.thumbCaption} numberOfLines={1}>{m.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* GPS Coordinates Badge */}
        {memory.latitude && memory.longitude && (
          <View style={styles.gpsCard}>
            <Ionicons name="compass-outline" size={20} color={colors.textSecondary} />
            <Text style={styles.gpsText}>
              GPS Coordinates: {memory.latitude.toFixed(4)}° N, {memory.longitude.toFixed(4)}° E
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  heroContainer: {
    height: 380,
    width: '100%',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  navBar: {
    position: 'absolute',
    top: 10,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  navRight: {
    flexDirection: 'row',
    gap: 8,
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleButtonFavorite: {
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
  },
  heroContent: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  tagBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  favoritePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EF4444',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  favoritePillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 32,
  },
  body: {
    padding: 20,
    paddingBottom: 40,
    gap: 20,
  },
  metaCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaTextGroup: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textTertiary,
    letterSpacing: 1,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 12,
  },
  storySection: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  storyText: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  gallerySection: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  galleryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  galleryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  galleryScroll: {
    gap: 12,
  },
  galleryThumbFrame: {
    width: 100,
    position: 'relative',
  },
  galleryThumbActive: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 14,
    padding: 2,
  },
  galleryThumbImg: {
    width: '100%',
    height: 100,
    borderRadius: 12,
    backgroundColor: colors.borderLight,
  },
  activeTag: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  activeTagText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  thumbCaption: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
  },
  gpsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    justifyContent: 'center',
  },
  gpsText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
});
