import { userRepository } from './repositories/userRepository';
import { hashPassword } from '@/lib/auth/password';
import { closeDB, deleteDB } from './client';
import { ADMIN_CREDENTIALS } from '@/constants/auth';

export async function seedDatabase() {
  try {
    console.log('データベースの初期化を開始します...');
    
    // Delete existing database to ensure clean state
    await deleteDB();
    console.log('既存のデータベースを削除しました');
    
    // Create admin user
    const hashedPassword = hashPassword(ADMIN_CREDENTIALS.password);
    await userRepository.createWithHashedPassword({
      email: ADMIN_CREDENTIALS.id,
      hashedPassword,
      role: 'admin',
      active: true
    });
    console.log('管理者ユーザーを作成しました');
    
    // Close database connection
    await closeDB();
    console.log('データベースの初期化が完了しました');
    
    return true;
  } catch (error) {
    console.error('データベースの初期化に失敗しました:', error);
    // Always try to close the connection
    await closeDB().catch(() => {});
    throw error;
  }
}