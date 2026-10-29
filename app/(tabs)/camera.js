import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { MOCK_MEMORIES } from '@/constants/mockData';

export default function CameraScreen() {
  const router = useRouter();
  const [flash, setFlash] = useState(false);
  const [grid, setGrid] = useState(true);
  const [facing, setFacing] = useState('back');

  const handleCapture = () => {
    // Navigate to create new memory with demo capture
    router.push('/memory/new');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Camera Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setFlash(!flash)}
        >
          <Ionicons
            name={flash ? 'flash' : 'flash-off'}
            size={22}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>PHOTO</Text>
        </View>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setGrid(!grid)}
        >
          <Ionicons
            name={grid ? 'grid' : 'grid-outline'}
            size={22}
            color={grid ? colors.primaryLight : '#FFFFFF'}
          />
        </TouchableOpacity>
      </View>

      {/* Viewfinder Preview */}
      <View style={styles.viewfinder}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
          }}
          style={styles.previewImage}
          resizeMode="cover"
        />

        {/* Viewfinder Grid Overlay */}
        {grid && (
          <View style={styles.gridOverlay}>
            <View style={styles.gridRow}>
              <View style={styles.gridCell} />
              <View style={styles.gridCell} />
              <View style={styles.gridCell} />
            </View>
            <View style={styles.gridRow}>
              <View style={styles.gridCell} />
              <View style={styles.gridCell} />
              <View style={styles.gridCell} />
            </View>
            <View style={styles.gridRow}>
              <View style={styles.gridCell} />
              <View style={styles.gridCell} />
              <View style={styles.gridCell} />
            </View>
          </View>
        )}

        {/* Center Focus Reticle */}
        <View style={styles.focusReticle}>
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />
        </View>

        <View style={styles.locationOverlay}>
          <Ionicons name="navigate" size={14} color="#FFFFFF" />
          <Text style={styles.locationText}>Auto-tagging GPS coordinates</Text>
        </View>
      </View>

      {/* Bottom Shutter Controls */}
      <View style={styles.bottomBar}>
        {/* Gallery shortcut */}
        <TouchableOpacity
          style={styles.galleryThumb}
          onPress={handleCapture}
          activeOpacity={0.8}
        >
          <Image
            source={{ uri: MOCK_MEMORIES[0].image_url }}
            style={styles.galleryImage}
          />
        </TouchableOpacity>

        {/* Shutter Button */}
        <TouchableOpacity
          style={styles.shutterOuter}
          onPress={handleCapture}
          activeOpacity={0.8}
        >
          <View style={styles.shutterInner} />
        </TouchableOpacity>

        {/* Flip Camera */}
        <TouchableOpacity
          style={styles.flipButton}
          onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
          activeOpacity={0.7}
        >
          <Ionicons name="camera-reverse-outline" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  iconButton: {
    padding: 8,
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  viewfinder: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    marginHorizontal: 12,
    position: 'relative',
    backgroundColor: '#1E293B',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  gridRow: {
    flex: 1,
    flexDirection: 'row',
  },
  gridCell: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  focusReticle: {
    position: 'absolute',
    top: '35%',
    left: '30%',
    width: '40%',
    height: '30%',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#FFFFFF',
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
  locationOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  locationText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  galleryThumb: {
    width: 48,
    height: 48,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  shutterOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
  flipButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
