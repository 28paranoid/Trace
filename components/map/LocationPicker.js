import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { config } from '@/constants/config';

export default function LocationPicker({ location, onLocationSelect }) {
  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    onLocationSelect?.({ latitude, longitude });
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={config.defaultMapRegion}
        onPress={handleMapPress}
      >
        {location && (
          <Marker
            coordinate={location}
            draggable
            onDragEnd={(e) => onLocationSelect?.(e.nativeEvent.coordinate)}
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 250,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  map: {
    flex: 1,
  },
});
