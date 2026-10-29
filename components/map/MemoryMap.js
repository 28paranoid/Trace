import { View, Text, StyleSheet, Platform, TouchableOpacity, ScrollView, Image } from 'react-native';
import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';

let MapView = null;
let Marker = null;

if (Platform.OS !== 'web') {
  try {
    const Maps = require('react-native-maps');
    MapView = Maps.default;
    Marker = Maps.Marker;
  } catch {
    MapView = null;
  }
}

export default function MemoryMap({ memories = [], onMarkerPress, selectedMemory }) {
  // If native MapView is available
  if (MapView && Marker) {
    const defaultRegion = {
      latitude: memories[0]?.latitude || 35.6762,
      longitude: memories[0]?.longitude || 139.6503,
      latitudeDelta: 30,
      longitudeDelta: 30,
    };

    return (
      <View style={styles.container}>
        <MapView style={styles.map} initialRegion={defaultRegion}>
          {memories.map((memory) => (
            memory.latitude && memory.longitude && (
              <Marker
                key={memory.id}
                coordinate={{
                  latitude: memory.latitude,
                  longitude: memory.longitude,
                }}
                title={memory.title}
                description={memory.place_name}
                onPress={() => onMarkerPress?.(memory)}
              />
            )
          ))}
        </MapView>
      </View>
    );
  }

  // Web / Fallback visual map preview
  return (
    <View style={styles.webContainer}>
      <View style={styles.webHeader}>
        <Ionicons name="earth" size={24} color={colors.primary} />
        <Text style={styles.webTitle}>Global Memory Map</Text>
        <Text style={styles.webSubtitle}>{memories.length} pinned locations</Text>
      </View>

      <ScrollView contentContainerStyle={styles.pinsList}>
        {memories.map((mem) => {
          const isSelected = selectedMemory?.id === mem.id;
          return (
            <TouchableOpacity
              key={mem.id}
              style={[styles.pinCard, isSelected && styles.pinCardSelected]}
              onPress={() => onMarkerPress?.(mem)}
              activeOpacity={0.8}
            >
              <Image source={{ uri: mem.image_url }} style={styles.pinImage} />
              <View style={styles.pinInfo}>
                <Text style={styles.pinPlace}>{mem.place_name}</Text>
                <Text style={styles.pinTitle} numberOfLines={1}>{mem.title}</Text>
                <Text style={styles.pinCoords}>
                  {mem.latitude?.toFixed(2)}° N, {mem.longitude?.toFixed(2)}° E
                </Text>
              </View>
              <Ionicons
                name="location"
                size={22}
                color={isSelected ? colors.primary : colors.textTertiary}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  webContainer: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 16,
  },
  webHeader: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  webTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 6,
  },
  webSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  pinsList: {
    gap: 12,
  },
  pinCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  pinCardSelected: {
    borderColor: colors.primary,
    backgroundColor: '#EEF2FF',
  },
  pinImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 12,
  },
  pinInfo: {
    flex: 1,
  },
  pinPlace: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 2,
  },
  pinTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  pinCoords: {
    fontSize: 11,
    color: colors.textTertiary,
  },
});
