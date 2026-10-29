import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { MOCK_PLACES } from '@/constants/mockData';

export default function PlacesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.subheading}>DESTINATIONS</Text>
          <Text style={styles.heading}>Places Visited</Text>
          <Text style={styles.subtitle}>
            {MOCK_PLACES.length} cities and regions captured around the world
          </Text>
        </View>

        {/* Places Grid / List */}
        <FlatList
          data={MOCK_PLACES}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.88}
              onPress={() => router.push('/(tabs)/map')}
            >
              <Image source={{ uri: item.coverUrl }} style={styles.cover} />
              <View style={styles.overlay} />

              <View style={styles.badge}>
                <Ionicons name="images" size={12} color="#FFFFFF" />
                <Text style={styles.badgeText}>{item.memoryCount} memories</Text>
              </View>

              <View style={styles.info}>
                <Text style={styles.placeName}>{item.name}</Text>
                <View style={styles.countryRow}>
                  <Ionicons name="location-sharp" size={13} color="#CBD5E1" />
                  <Text style={styles.countryName}>{item.country}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  subheading: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 2,
    marginBottom: 4,
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 16,
  },
  card: {
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  cover: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  badge: {
    position: 'absolute',
    top: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  info: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  placeName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  countryName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#E2E8F0',
  },
});
