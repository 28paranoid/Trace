import { View, StyleSheet } from 'react-native';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function MemoryForm({ onSubmit, loading }) {
  return (
    <View style={styles.container}>
      <Input label="Title" placeholder="Give this memory a name..." />
      <Input
        label="Description"
        placeholder="What happened here?"
        multiline
        numberOfLines={4}
        style={styles.textarea}
      />
      <Button title="Save Memory" onPress={onSubmit} loading={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  textarea: {
    // Override input height for multiline
  },
});
