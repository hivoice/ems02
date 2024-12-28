<template>
  <div>
    <label class="block text-sm font-medium text-gray-700">{{ label }}</label>
    <div class="mt-1 flex items-center space-x-4">
      <div
        class="flex justify-center items-center w-32 h-32 border-2 border-gray-300 border-dashed rounded-lg overflow-hidden"
      >
        <template v-if="previewUrl">
          <img
            :src="previewUrl"
            alt="Preview"
            class="w-full h-full object-cover"
          />
        </template>
        <template v-else>
          <Upload class="w-8 h-8 text-gray-400" />
        </template>
      </div>
      
      <div class="flex flex-col space-y-2">
        <label
          class="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#321fdb]"
        >
          <span>画像を選択</span>
          <input
            type="file"
            class="sr-only"
            accept="image/*"
            @change="handleFileSelect"
          />
        </label>
        <button
          v-if="previewUrl"
          type="button"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          @click="clearImage"
        >
          削除
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Upload } from 'lucide-vue-next';

const props = defineProps<{
  label: string;
  previewUrl?: string;
}>();

const emit = defineEmits<{
  update: [file: File];
  clear: [];
}>();

function handleFileSelect(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    emit('update', file);
  }
}

function clearImage() {
  emit('clear');
}
</script>