import { FlatList, StyleSheet } from 'react-native';
import MemoryCard from './MemoryCard';
import EmptyState from '@/components/ui/EmptyState';

export default function MemoryGrid({ memories, refreshing, onRefresh }) {
  return (
    <FlatList
      data={memories}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <MemoryCard memory={item} />}
      contentContainerStyle={styles.list}
      refreshing={refreshing}
      onRefresh={onRefresh}
      ListEmptyComponent={
        <EmptyState
          icon="📸"
          title="No memories yet"
          message="Start capturing moments to see them here."
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
    flexGrow: 1,
  },
});
