<template>
  <div class="max-w-3xl mx-auto">
    <h1 class="text-2xl font-semibold mb-6">プロフィール</h1>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">姓</label>
              <input
                v-model="profileForm.lastName"
                type="text"
                required
                class="input-field"
                :disabled="!isEditing"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">名</label>
              <input
                v-model="profileForm.firstName"
                type="text"
                required
                class="input-field"
                :disabled="!isEditing"
              />
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">年齢</label>
              <input
                v-model.number="profileForm.age"
                type="number"
                min="18"
                max="100"
                required
                class="input-field"
                :disabled="!isEditing"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">性別</label>
              <select
                v-model="profileForm.gender"
                required
                class="input-field"
                :disabled="!isEditing"
              >
                <option value="男性">男性</option>
                <option value="女性">女性</option>
                <option value="その他">その他</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">メールアドレス</label>
            <input
              v-model="profileForm.email"
              type="email"
              required
              class="input-field"
              disabled
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">部署</label>
            <input
              v-model="profileForm.department"
              type="text"
              class="input-field"
              disabled
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">役職</label>
            <input
              v-model="profileForm.position"
              type="text"
              class="input-field"
              disabled
            />
          </div>

          <div class="flex justify-end space-x-4">
            <template v-if="isEditing">
              <button
                type="button"
                @click="cancelEdit"
                class="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                キャンセル
              </button>
              <button
                type="submit"
                class="btn-primary px-4 py-2"
                :disabled="isLoading"
              >
                保存
              </button>
            </template>
            <button
              v-else
              type="button"
              @click="startEdit"
              class="btn-primary px-4 py-2"
            >
              編集
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Notifications -->
    <Notification ref="notification" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { employeeService } from '@/lib/services/employee';
import Notification from '@/components/Notification.vue';
import type { Employee } from '@/types';

const authStore = useAuthStore();
const notification = ref<{ addNotification: Function } | null>(null);
const isLoading = ref(false);
const isEditing = ref(false);
const originalProfile = ref<Employee | null>(null);

const profileForm = ref({
  firstName: '',
  lastName: '',
  gender: '男性' as const,
  age: 20,
  email: '',
  department: '',
  position: '',
});

async function loadProfile() {
  if (!authStore.user) return;
  
  try {
    const profile = await employeeService.getEmployeeByUserId(authStore.user.id);
    if (profile) {
      originalProfile.value = profile;
      profileForm.value = { ...profile };
    }
  } catch (error) {
    console.error('プロフィールの読み込みに失敗しました:', error);
    notification.value?.addNotification('error', 'プロフィールの読み込みに失敗しました');
  }
}

function startEdit() {
  isEditing.value = true;
}

function cancelEdit() {
  if (originalProfile.value) {
    profileForm.value = { ...originalProfile.value };
  }
  isEditing.value = false;
}

async function handleSubmit() {
  if (isLoading.value || !originalProfile.value) return;
  isLoading.value = true;

  try {
    await employeeService.updateEmployee(originalProfile.value.id, {
      firstName: profileForm.value.firstName,
      lastName: profileForm.value.lastName,
      gender: profileForm.value.gender,
      age: profileForm.value.age
    });
    
    notification.value?.addNotification('success', 'プロフィールを更新しました');
    isEditing.value = false;
    await loadProfile();
  } catch (error) {
    console.error('プロフィールの更新に失敗しました:', error);
    notification.value?.addNotification('error', 'プロフィールの更新に失敗しました');
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadProfile);
</script>