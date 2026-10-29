import { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { colors } from '@/constants/colors';
import { useMemories } from '@/hooks/useMemories';
import MemoryMap from '@/components/map/MemoryMap';
import MemoryPreview from '@/components/map/MemoryPreview';

export default function MapScreen() {
  const { memories } = useMemories();
  const [selectedMemory, setSelectedMemory] = useState(memories[0] || null);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Floating Top Badge */}
        <View style={styles.topBadge}>
          <Text style={styles.badgeTitle}>Memory Map</Text>
          <Text style={styles.badgeSubtitle}>{memories.length} pinned places</Text>
        </View>

        {/* Map View */}
        <MemoryMap
          memories={memories}
          selectedMemory={selectedMemory}
          onMarkerPress={(mem) => setSelectedMemory(mem)}
        />

        {/* Selected Memory Preview Card */}
        {selectedMemory && (
          <MemoryPreview
            memory={selectedMemory}
            onClose={() => setSelectedMemory(null)}
          />
        )}
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
    position: 'relative',
  },
  topBadge: {
    position: 'absolute',
    top: 16,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  badgeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  badgeSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
  },
});
