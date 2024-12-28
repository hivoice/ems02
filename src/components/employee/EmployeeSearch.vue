<template>
  <div class="bg-white p-4 rounded-lg shadow mb-6">
    <div class="flex items-center space-x-4">
      <div class="flex-1 relative">
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="placeholder"
          class="w-full pl-10 pr-4 py-2 border rounded-lg"
          @input="handleSearch"
        />
        <Search class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Search } from 'lucide-vue-next';

const props = defineProps<{
  placeholder?: string;
}>();

const emit = defineEmits<{
  search: [query: string];
}>();

const searchQuery = ref('');

function handleSearch() {
  emit('search', searchQuery.value);
}

watch(searchQuery, handleSearch);
</script>