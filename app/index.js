import { Redirect } from 'expo-router';

export default function Index() {
  // Directly enter the main app tabs for instant preview
  return <Redirect href="/(tabs)/home" />;
}
