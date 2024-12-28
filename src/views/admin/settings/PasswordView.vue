<template>
  <div class="max-w-2xl mx-auto">
    <h2 class="text-xl font-semibold mb-6">{{ $t('settings.changePassword') }}</h2>

    <div v-if="message" :class="[
      'p-4 mb-4 rounded-md',
      success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
    ]">
      {{ $t(message) }}
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6 bg-white p-6 rounded-lg shadow" novalidate>
      <div>
        <label class="block text-sm font-medium text-gray-700" for="currentPassword">
          {{ $t('settings.currentPassword') }}
        </label>
        <input
          id="currentPassword"
          v-model="form.currentPassword"
          type="password"
          class="input-field"
          required
          @invalid="handleInvalid"
        />
        <p v-if="validationErrors.currentPassword" class="mt-1 text-sm text-red-600">
          {{ $t(validationErrors.currentPassword) }}
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700" for="newPassword">
          {{ $t('settings.newPassword') }}
        </label>
        <input
          id="newPassword"
          v-model="form.newPassword"
          type="password"
          class="input-field"
          required
          minlength="6"
          @invalid="handleInvalid"
        />
        <p v-if="validationErrors.newPassword" class="mt-1 text-sm text-red-600">
          {{ $t(validationErrors.newPassword) }}
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700" for="confirmPassword">
          {{ $t('settings.confirmPassword') }}
        </label>
        <input
          id="confirmPassword"
          v-model="form.confirmPassword"
          type="password"
          class="input-field"
          required
          @invalid="handleInvalid"
        />
        <p v-if="validationErrors.confirmPassword" class="mt-1 text-sm text-red-600">
          {{ $t(validationErrors.confirmPassword) }}
        </p>
      </div>

      <button
        type="submit"
        class="btn-primary py-2 px-4"
        :disabled="isLoading"
      >
        {{ $t('settings.updatePassword') }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { authService } from '@/lib/auth/service';

const isLoading = ref(false);
const message = ref('');
const success = ref(false);
const validationErrors = ref<Record<string, string>>({});

const form = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

function handleInvalid(e: Event) {
  e.preventDefault();
  const target = e.target as HTMLInputElement;
  
  if (!target.value) {
    validationErrors.value[target.id] = 'validation.required';
  } else if (target.id === 'newPassword' && target.value.length < 6) {
    validationErrors.value[target.id] = 'validation.minLength';
  }
}

function validateForm(): boolean {
  validationErrors.value = {};
  let isValid = true;

  if (!form.value.currentPassword) {
    validationErrors.value.currentPassword = 'validation.required';
    isValid = false;
  }

  if (!form.value.newPassword) {
    validationErrors.value.newPassword = 'validation.required';
    isValid = false;
  } else if (form.value.newPassword.length < 6) {
    validationErrors.value.newPassword = 'validation.minLength';
    isValid = false;
  }

  if (!form.value.confirmPassword) {
    validationErrors.value.confirmPassword = 'validation.required';
    isValid = false;
  } else if (form.value.newPassword !== form.value.confirmPassword) {
    validationErrors.value.confirmPassword = 'validation.passwordMismatch';
    isValid = false;
  }

  return isValid;
}

async function handleSubmit() {
  if (isLoading.value) return;
  
  if (!validateForm()) return;

  isLoading.value = true;
  message.value = '';
  success.value = false;

  try {
    await authService.changeAdminPassword(
      form.value.currentPassword,
      form.value.newPassword
    );
    
    success.value = true;
    message.value = 'settings.passwordUpdated';
    form.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  } catch (error: any) {
    message.value = error.message || 'settings.updateFailed';
  } finally {
    isLoading.value = false;
  }
}
</script>