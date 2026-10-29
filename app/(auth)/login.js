import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { colors } from '@/constants/colors';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>
      {/* TODO: Add login form */}
      <Link href="/(auth)/register" style={styles.link}>
        <Text style={styles.linkText}>{"Don't have an account? Register"}</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 32,
  },
  link: {
    marginTop: 24,
  },
  linkText: {
    color: colors.primary,
    fontSize: 14,
  },
});
