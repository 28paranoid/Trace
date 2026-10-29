import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';
import { MOCK_USER, MOCK_PLACES } from '@/constants/mockData';

export default function ProfileScreen() {
  const { user } = useAuth();
  const profile = user || MOCK_USER;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Profile Card Header */}
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: profile.avatarUrl || MOCK_USER.avatarUrl }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{profile.name || 'Traveler'}</Text>
          <Text style={styles.handle}>{profile.handle || '@traveler'}</Text>
          <Text style={styles.bio}>
            {profile.bio || 'Capturing moments and mapping life journeys.'}
          </Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{MOCK_USER.stats.memories}</Text>
            <Text style={styles.statLabel}>Memories</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{MOCK_USER.stats.places}</Text>
            <Text style={styles.statLabel}>Places</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{MOCK_USER.stats.countries}</Text>
            <Text style={styles.statLabel}>Countries</Text>
          </View>
        </View>

        {/* Visited Stamps / Places */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PASSPORT STAMPS</Text>
          <View style={styles.stampsGrid}>
            {MOCK_PLACES.map((place) => (
              <View key={place.id} style={styles.stamp}>
                <Ionicons name="airplane" size={14} color={colors.primary} />
                <Text style={styles.stampText}>{place.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Settings & Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>APP PREFERENCES</Text>
          <View style={styles.settingsCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingIconWrapper}>
                <Ionicons name="navigate-outline" size={18} color={colors.primary} />
              </View>
              <Text style={styles.settingText}>Auto-tag GPS Location</Text>
              <Text style={styles.settingValue}>Enabled</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingIconWrapper}>
                <Ionicons name="cloud-upload-outline" size={18} color={colors.primary} />
              </View>
              <Text style={styles.settingText}>Cloud Sync (Supabase)</Text>
              <Text style={styles.settingValue}>Ready</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingIconWrapper}>
                <Ionicons name="shield-checkmark-outline" size={18} color={colors.primary} />
              </View>
              <Text style={styles.settingText}>Storage & Privacy</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
            </View>
          </View>
        </View>

        {/* App Version Info */}
        <View style={styles.footer}>
          <Text style={styles.versionText}>Trace v1.0.0 • Expo SDK 58</Text>
          <Text style={styles.versionSubtext}>Demo Preview Mode Active</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: colors.primary,
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  handle: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 8,
  },
  bio: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 16,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    borderRadius: 20,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: '60%',
    backgroundColor: colors.borderLight,
    alignSelf: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textTertiary,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  stampsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  stamp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stampText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  settingsCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  settingIconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  settingValue: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
  footer: {
    alignItems: 'center',
    marginTop: 8,
  },
  versionText: {
    fontSize: 12,
    color: colors.textTertiary,
    fontWeight: '600',
  },
  versionSubtext: {
    fontSize: 11,
    color: colors.primary,
    marginTop: 2,
    fontWeight: '500',
  },
});
