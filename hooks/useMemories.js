import { useState, useEffect, useCallback } from 'react';
import { memoriesService } from '@/services/memories';
import { useAuth } from '@/context/AuthContext';
import { MOCK_MEMORIES } from '@/constants/mockData';

export function useMemories() {
  const { user } = useAuth();
  const [memories, setMemories] = useState(MOCK_MEMORIES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMemories = useCallback(async () => {
    if (!user) return;
    try {
      setError(null);
      const data = await memoriesService.getAll(user.id);
      if (data && data.length > 0) {
        setMemories(data);
      } else {
        setMemories(MOCK_MEMORIES);
      }
    } catch {
      // Graceful fallback to mock memories for preview
      setMemories(MOCK_MEMORIES);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMemories();
  }, [fetchMemories]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    fetchMemories();
  }, [fetchMemories]);

  return { memories, loading, error, refreshing, refresh };
}
