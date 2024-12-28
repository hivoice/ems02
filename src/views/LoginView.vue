<template>
  <div class="min-h-screen bg-[#3c4b64] flex items-center justify-center px-4">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <div class="flex flex-col items-center mb-6">
        <UserCircle class="w-16 h-16 text-[#321fdb]" />
        <h2 class="mt-4 text-2xl font-bold text-gray-900">{{ $t('auth.loginTitle') }}</h2>
      </div>

      <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded">
        {{ $t(error) }}
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700" for="email">
            {{ $t('auth.email') }}
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            :placeholder="$t('auth.emailPlaceholder')"
            class="mt-1 block w-full px-4 py-2 border-2 border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#321fdb] focus:border-[#321fdb] placeholder-gray-400"
            required
            autocomplete="email"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700" for="password">
            {{ $t('auth.password') }}
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            :placeholder="$t('auth.passwordPlaceholder')"
            class="mt-1 block w-full px-4 py-2 border-2 border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#321fdb] focus:border-[#321fdb] placeholder-gray-400"
            required
            autocomplete="current-password"
          />
        </div>

        <button
          type="submit"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#321fdb] hover:bg-[#1b2e8f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#321fdb] disabled:opacity-50"
          :disabled="isLoading"
        >
          <span v-if="isLoading">{{ $t('auth.loggingIn') }}</span>
          <span v-else>{{ $t('auth.login') }}</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { UserCircle } from 'lucide-vue-next';
import { useAuth } from '@/composables/useAuth';

const { login, error, isLoading } = useAuth();
const email = ref('');
const password = ref('');

async function handleSubmit() {
  await login(email.value, password.value);
}
</script>