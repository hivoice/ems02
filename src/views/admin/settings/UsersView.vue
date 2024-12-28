<template>
  <div>
    <h2 class="text-xl font-semibold mb-6">{{ $t('settings.userManagement') }}</h2>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <!-- Search and Add User -->
      <div class="p-4 border-b">
        <div class="flex justify-between items-center">
          <div class="relative">
            <input
              type="text"
              v-model="searchQuery"
              :placeholder="$t('common.search')"
              class="pl-10 pr-4 py-2 border rounded-lg"
            />
            <Search class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
          <button
            @click="showAddUserModal = true"
            class="btn-primary py-2 px-4 flex items-center"
          >
            <UserPlus class="w-5 h-5 mr-2" />
            {{ $t('settings.addUser') }}
          </button>
        </div>
      </div>

      <!-- Users Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('common.email') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('common.role') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('common.status') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('common.actions') }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in filteredUsers" :key="user.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ user.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getRoleClass(user.role)">
                  {{ $t(`settings.userRole.${user.role}`) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getStatusClass(user.active)">
                  {{ $t(user.active ? 'settings.userStatus.active' : 'settings.userStatus.blocked') }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  v-if="user.role !== 'admin'"
                  @click="showStatusConfirm(user)"
                  class="text-gray-600 hover:text-gray-900 mr-3"
                  :title="$t(user.active ? 'settings.blockUser' : 'settings.unblockUser')"
                >
                  <component :is="user.active ? Lock : Unlock" class="w-5 h-5" />
                </button>
                <button
                  v-if="user.role !== 'admin'"
                  @click="showPasswordReset(user)"
                  class="text-gray-600 hover:text-gray-900 mr-3"
                  :title="$t('settings.resetPassword')"
                >
                  <KeyRound class="w-5 h-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add User Modal -->
    <Modal v-if="showAddUserModal" @close="closeUserModal">
      <template #title>{{ $t('settings.addUser') }}</template>
      <template #content>
        <form @submit.prevent="handleUserSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">
              {{ $t('common.email') }}
            </label>
            <input
              v-model="userForm.email"
              type="email"
              :placeholder="$t('auth.emailPlaceholder')"
              required
              class="input-field"
            />
            <p v-if="validationErrors.email" class="mt-1 text-sm text-red-600">
              {{ $t(validationErrors.email) }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">
              {{ $t('common.password') }}
            </label>
            <input
              v-model="userForm.password"
              type="password"
              :placeholder="$t('auth.passwordPlaceholder')"
              required
              class="input-field"
            />
            <p v-if="validationErrors.password" class="mt-1 text-sm text-red-600">
              {{ $t(validationErrors.password) }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">
              {{ $t('common.role') }}
            </label>
            <select
              v-model="userForm.role"
              class="input-field"
              required
            >
              <option value="employee">{{ $t('settings.userRole.employee') }}</option>
              <option value="admin">{{ $t('settings.userRole.admin') }}</option>
            </select>
          </div>
        </form>
      </template>
      <template #footer>
        <button
          @click="closeUserModal"
          class="mr-3 px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
        >
          {{ $t('common.cancel') }}
        </button>
        <button
          @click="handleUserSubmit"
          class="btn-primary px-4 py-2"
          :disabled="isLoading"
        >
          {{ $t('common.add') }}
        </button>
      </template>
    </Modal>

    <!-- Password Reset Modal -->
    <PasswordResetModal
      v-if="showPasswordResetModal"
      :user-id="selectedUser?.id"
      :on-reset="handlePasswordReset"
      @close="showPasswordResetModal = false"
    />

    <!-- Status Confirmation Dialog -->
    <ConfirmDialog
      v-if="showStatusConfirmModal"
      :title="$t(selectedUser?.active ? 'settings.blockUser' : 'settings.unblockUser')"
      :message="$t(selectedUser?.active ? 'settings.blockUserConfirm' : 'settings.unblockUserConfirm')"
      @close="showStatusConfirmModal = false"
      @confirm="handleStatusChange"
    />

    <!-- Notifications -->
    <Notification ref="notification" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Search, UserPlus, Lock, Unlock, KeyRound } from 'lucide-vue-next';
import Modal from '@/components/Modal.vue';
import PasswordResetModal from '@/components/PasswordResetModal.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import Notification from '@/components/Notification.vue';
import { userService } from '@/lib/services/user';
import type { User } from '@/types';

const searchQuery = ref('');
const showAddUserModal = ref(false);
const showPasswordResetModal = ref(false);
const showStatusConfirmModal = ref(false);
const selectedUser = ref<User | null>(null);
const isLoading = ref(false);
const users = ref<User[]>([]);
const validationErrors = ref<Record<string, string>>({});
const notification = ref<{ addNotification: Function } | null>(null);

const userForm = ref({
  email: '',
  password: '',
  role: 'employee' as const
});

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;
  const query = searchQuery.value.toLowerCase();
  return users.value.filter(user => 
    user.email.toLowerCase().includes(query)
  );
});

function getRoleClass(role: string) {
  return role === 'admin' 
    ? 'bg-purple-100 text-purple-800' 
    : 'bg-green-100 text-green-800';
}

function getStatusClass(active?: boolean) {
  return active 
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800';
}

async function loadUsers() {
  try {
    users.value = await userService.getAllUsers();
  } catch (error) {
    console.error('Failed to load users:', error);
    notification.value?.addNotification('error', 'エラーが発生しました');
  }
}

function closeUserModal() {
  showAddUserModal.value = false;
  userForm.value = {
    email: '',
    password: '',
    role: 'employee'
  };
  validationErrors.value = {};
}

async function handleUserSubmit() {
  if (isLoading.value) return;
  
  validationErrors.value = {};
  isLoading.value = true;

  try {
    await userService.createUser(userForm.value);
    notification.value?.addNotification('success', 'settings.saveSuccess');
    closeUserModal();
    await loadUsers();
  } catch (error: any) {
    console.error('Failed to add user:', error);
    if (error.message === 'User already exists') {
      validationErrors.value.email = 'このメールアドレスは既に使用されています';
    } else {
      notification.value?.addNotification('error', 'エラーが発生しました');
    }
  } finally {
    isLoading.value = false;
  }
}

function showStatusConfirm(user: User) {
  selectedUser.value = user;
  showStatusConfirmModal.value = true;
}

function showPasswordReset(user: User) {
  selectedUser.value = user;
  showPasswordResetModal.value = true;
}

async function handleStatusChange() {
  if (!selectedUser.value) return;
  
  try {
    await userService.updateUserStatus(
      selectedUser.value.id,
      !selectedUser.value.active
    );
    notification.value?.addNotification(
      'success',
      selectedUser.value.active ? 'settings.blockSuccess' : 'settings.unblockSuccess'
    );
    await loadUsers();
  } catch (error) {
    console.error('Failed to update user status:', error);
    notification.value?.addNotification('error', 'エラーが発生しました');
  } finally {
    showStatusConfirmModal.value = false;
    selectedUser.value = null;
  }
}

async function handlePasswordReset(userId: string): Promise<string> {
  try {
    const newPassword = await userService.resetUserPassword(userId);
    notification.value?.addNotification('success', 'settings.passwordResetSuccess');
    return newPassword;
  } catch (error) {
    console.error('Failed to reset password:', error);
    notification.value?.addNotification('error', 'エラーが発生しました');
    throw error;
  }
}

// Load users on component mount
loadUsers();
</script>