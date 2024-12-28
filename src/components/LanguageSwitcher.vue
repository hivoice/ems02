<template>
  <div class="relative" ref="dropdown">
    <button
      @click="isOpen = !isOpen"
      class="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
    >
      <Languages class="w-5 h-5" />
      <span class="text-sm">{{ currentLocale === 'ja' ? '日本語' : 'English' }}</span>
    </button>

    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
    >
      <div class="py-1" role="menu">
        <button
          v-for="locale in availableLocales"
          :key="locale.code"
          @click="switchLanguage(locale.code)"
          class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          role="menuitem"
        >
          {{ locale.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Languages } from 'lucide-vue-next';
import { onClickOutside } from '@vueuse/core';

const { locale } = useI18n();
const isOpen = ref(false);
const dropdown = ref<HTMLElement | null>(null);

const currentLocale = computed(() => locale.value);

const availableLocales = [
  { code: 'ja', name: '日本語' },
  { code: 'en', name: 'English' }
];

function switchLanguage(lang: string) {
  locale.value = lang;
  isOpen.value = false;
}

onClickOutside(dropdown, () => {
  isOpen.value = false;
});
</script>