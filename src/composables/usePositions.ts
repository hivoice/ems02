import { ref } from 'vue';
import type { Position } from '@/types/position';
import { positionService } from '@/lib/services/position';

export function usePositions() {
  const positions = ref<Position[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function loadPositions() {
    isLoading.value = true;
    error.value = null;

    try {
      positions.value = await positionService.getAllPositions();
    } catch (err) {
      console.error('Failed to load positions:', err);
      error.value = '役職データの取得に失敗しました';
    } finally {
      isLoading.value = false;
    }
  }

  async function createPosition(data: Partial<Position>) {
    isLoading.value = true;
    error.value = null;

    try {
      const position = await positionService.createPosition(data);
      positions.value.push(position);
      return position;
    } catch (err) {
      console.error('Failed to create position:', err);
      error.value = '役職の作成に失敗しました';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function updatePosition(id: string, data: Partial<Position>) {
    isLoading.value = true;
    error.value = null;

    try {
      await positionService.updatePosition(id, data);
      const index = positions.value.findIndex(p => p.id === id);
      if (index !== -1) {
        positions.value[index] = { ...positions.value[index], ...data };
      }
    } catch (err) {
      console.error('Failed to update position:', err);
      error.value = '役職の更新に失敗しました';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function deletePosition(id: string) {
    isLoading.value = true;
    error.value = null;

    try {
      await positionService.deletePosition(id);
      positions.value = positions.value.filter(p => p.id !== id);
    } catch (err) {
      console.error('Failed to delete position:', err);
      error.value = '役職の削除に失敗しました';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    positions,
    isLoading,
    error,
    loadPositions,
    createPosition,
    updatePosition,
    deletePosition
  };
}