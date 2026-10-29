import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { MOCK_MEMORIES } from '@/constants/mockData';

export default function NewMemoryScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [place, setPlace] = useState('Kyoto, Japan');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState('Travel');
  const [imageUri] = useState(
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80'
  );

  const handleSave = () => {
    // Insert new memory into local mock data list
    MOCK_MEMORIES.unshift({
      id: `mem-${Date.now()}`,
      title: title || 'New Memory',
      description: description || 'A memorable moment in ' + place,
      place_name: place,
      latitude: 34.9671,
      longitude: 135.7727,
      image_url: imageUri,
      created_at: new Date().toISOString(),
      tag,
    });
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Memory</Text>
        <TouchableOpacity
          style={styles.saveHeaderButton}
          onPress={handleSave}
        >
          <Text style={styles.saveHeaderText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Photo Preview / Picker */}
        <View style={styles.imageBox}>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <View style={styles.imageOverlayBadge}>
            <Ionicons name="camera" size={16} color="#FFFFFF" />
            <Text style={styles.imageBadgeText}>Photo Captured</Text>
          </View>
        </View>

        {/* Inputs */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>MEMORY TITLE</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Sunrise over the valley..."
            placeholderTextColor={colors.textTertiary}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>LOCATION</Text>
          <View style={styles.locationInputWrapper}>
            <Ionicons name="location-sharp" size={18} color={colors.primary} />
            <TextInput
              style={styles.locationInput}
              placeholder="e.g. Kyoto, Japan"
              placeholderTextColor={colors.textTertiary}
              value={place}
              onChangeText={setPlace}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>TAG / CATEGORY</Text>
          <View style={styles.tagRow}>
            {['Travel', 'Nature', 'Cafes', 'City'].map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.tagChip, tag === t && styles.tagChipActive]}
                onPress={() => setTag(t)}
              >
                <Text
                  style={[
                    styles.tagChipText,
                    tag === t && styles.tagChipTextActive,
                  ]}
                >
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>WHAT HAPPENED HERE?</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Write down the sounds, smells, and feelings from this moment..."
            placeholderTextColor={colors.textTertiary}
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Big Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Add to Memory Journal</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    backgroundColor: colors.surface,
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  saveHeaderButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: colors.primary,
    borderRadius: 16,
  },
  saveHeaderText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  container: {
    padding: 20,
    gap: 18,
  },
  imageBox: {
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: colors.borderLight,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlayBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  imageBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  formGroup: {
    gap: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textTertiary,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
  },
  locationInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  locationInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tagChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tagChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tagChipTextActive: {
    color: '#FFFFFF',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
