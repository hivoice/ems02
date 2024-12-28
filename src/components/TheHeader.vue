<template>
  <header class="bg-white border-b border-gray-200 flex items-center justify-between px-4 py-3">
    <div class="flex items-center">
      <button
        @click="$emit('toggle-sidebar')"
        class="text-gray-600 hover:text-gray-900 lg:hidden"
      >
        <Menu class="w-6 h-6" />
      </button>
    </div>

    <div class="flex items-center space-x-6">
      <LanguageSwitcher />
      <button class="text-gray-600 hover:text-gray-900">
        <Bell class="w-6 h-6" />
      </button>
      <div class="relative">
        <button 
          @click="showUserMenu = !showUserMenu"
          class="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <User class="w-6 h-6" />
          <span>{{ authStore.user?.email }}</span>
        </button>
        
        <div v-if="showUserMenu" class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div class="py-1">
            <button
              @click="logout"
              class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {{ t('common.logout') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Menu, Bell, User } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import { useAuth } from '@/composables/useAuth';
import { useAuthStore } from '../stores/auth';
import LanguageSwitcher from './LanguageSwitcher.vue';

const { t } = useI18n();
const { logout } = useAuth();
const authStore = useAuthStore();
const showUserMenu = ref(false);

defineEmits(['toggle-sidebar']);
</script>