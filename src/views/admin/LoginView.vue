<template>
  <div class="min-h-screen bg-[#3c4b64] flex items-center justify-center px-4">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <div class="flex flex-col items-center mb-6">
        <UserCircle class="w-16 h-16 text-[#321fdb]" />
        <h2 class="mt-4 text-2xl font-bold text-gray-900">{{ $t('auth.adminLoginTitle') }}</h2>
      </div>

      <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded">
        {{ $t(error) }}
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6" novalidate>
        <div>
          <label class="block text-sm font-medium text-gray-700" for="id">
            {{ $t('auth.id') }}
          </label>
          <input
            id="id"
            v-model="id"
            type="text"
            :placeholder="$t('auth.idPlaceholder')"
            class="input-field"
            required
            autocomplete="off"
            @invalid="handleInvalid"
          />
          <p v-if="validationErrors.id" class="mt-1 text-sm text-red-600">
            {{ $t(validationErrors.id) }}
          </p>
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
            class="input-field"
            required
            autocomplete="current-password"
            @invalid="handleInvalid"
          />
          <p v-if="validationErrors.password" class="mt-1 text-sm text-red-600">
            {{ $t(validationErrors.password) }}
          </p>
        </div>

        <button
          type="submit"
          class="btn-primary w-full py-2 px-4"
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
const id = ref('');
const password = ref('');
const validationErrors = ref<Record<string, string>>({});

function handleInvalid(e: Event) {
  e.preventDefault();
  const target = e.target as HTMLInputElement;
  validationErrors.value[target.id] = 'auth.requiredFields';
}

async function handleSubmit() {
  validationErrors.value = {};
  
  if (!id.value || !password.value) {
    if (!id.value) validationErrors.value.id = 'auth.requiredFields';
    if (!password.value) validationErrors.value.password = 'auth.requiredFields';
    return;
  }
  
  await login(id.value, password.value, 'admin');
}
</script>