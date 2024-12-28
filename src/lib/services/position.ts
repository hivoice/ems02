import { getDB } from '../db/client';
import { generateId } from '../utils/ids';
import type { Position } from '@/types/position';

class PositionService {
  async getAllPositions(): Promise<Position[]> {
    try {
      const db = await getDB();
      const tx = db.transaction(['positions', 'departments', 'employees'], 'readonly');
      
      const positions = await tx.objectStore('positions').getAll();
      const departments = await tx.objectStore('departments').getAll();
      const employees = await tx.objectStore('employees').getAll();
      
      return positions.map(pos => ({
        ...pos,
        departmentName: departments.find(d => d.id === pos.departmentId)?.name || '',
        employeeCount: employees.filter(emp => emp.positionId === pos.id).length
      }));
    } catch (error) {
      console.error('役職データの取得に失敗しました:', error);
      return [];
    }
  }

  async createPosition(data: Partial<Position>): Promise<Position> {
    try {
      const db = await getDB();
      const now = new Date().toISOString();
      
      const position: Position = {
        id: generateId(),
        title: data.title!,
        departmentId: data.departmentId!,
        description: data.description || '',
        employeeCount: 0,
        created_at: now,
        updated_at: now
      };

      const tx = db.transaction('positions', 'readwrite');
      await tx.store.add(position);
      await tx.done;
      
      return position;
    } catch (error) {
      console.error('役職の作成に失敗しました:', error);
      throw new Error('役職の作成に失敗しました');
    }
  }

  async updatePosition(id: string, data: Partial<Position>): Promise<void> {
    try {
      const db = await getDB();
      const tx = db.transaction('positions', 'readwrite');
      
      const position = await tx.store.get(id);
      if (!position) {
        throw new Error('役職が見つかりません');
      }

      const updatedPosition = {
        ...position,
        ...data,
        updated_at: new Date().toISOString()
      };

      await tx.store.put(updatedPosition);
      await tx.done;
    } catch (error) {
      console.error('役職の更新に失敗しました:', error);
      throw error;
    }
  }

  async deletePosition(id: string): Promise<void> {
    try {
      const db = await getDB();
      
      // Check if position has employees
      const employeeTx = db.transaction('employees', 'readonly');
      const employees = await employeeTx.store.index('by-position-id').getAll(id);
      
      if (employees.length > 0) {
        throw new Error('所属する従業員が存在するため削除できません');
      }

      const tx = db.transaction('positions', 'readwrite');
      await tx.store.delete(id);
      await tx.done;
    } catch (error) {
      console.error('役職の削除に失敗しました:', error);
      throw error;
    }
  }
}

export const positionService = new PositionService();