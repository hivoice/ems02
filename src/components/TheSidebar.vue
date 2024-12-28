<template>
  <div class="bg-[#3c4b64] text-white w-64 min-h-screen">
    <div class="p-4 border-b border-gray-700">
      <h1 class="text-xl font-bold">人事管理システム</h1>
    </div>
    <nav class="mt-4">
      <template v-for="item in items" :key="item.path">
        <!-- Regular menu item -->
        <template v-if="!item.children">
          <router-link
            :to="item.path"
            class="flex items-center px-6 py-3 text-sm"
            :class="[
              $route.path.startsWith(item.path)
                ? 'bg-[#321fdb] text-white'
                : 'text-gray-300 hover:bg-[#321fdb] hover:text-white'
            ]"
          >
            <component :is="item.icon" class="w-5 h-5 mr-3" />
            {{ $t(`common.${item.key}`) }}
          </router-link>
        </template>
        
        <!-- Menu item with submenu -->
        <div v-else class="relative">
          <button
            @click="toggleSubmenu(item.key)"
            class="w-full flex items-center px-6 py-3 text-sm text-gray-300 hover:bg-[#321fdb] hover:text-white"
            :class="{ 'bg-[#2b3c57]': isSubmenuOpen(item.key) }"
          >
            <component :is="item.icon" class="w-5 h-5 mr-3" />
            <span>{{ $t(`common.${item.key}`) }}</span>
            <ChevronDown
              class="w-4 h-4 ml-auto transition-transform duration-200"
              :class="{ 'rotate-180': isSubmenuOpen(item.key) }"
            />
          </button>
          
          <div
            v-show="isSubmenuOpen(item.key)"
            class="bg-[#2b3c57]"
          >
            <router-link
              v-for="child in item.children"
              :key="child.path"
              :to="child.path"
              class="flex items-center pl-14 pr-6 py-2 text-sm text-gray-300 hover:bg-[#321fdb] hover:text-white"
              :class="{ 'bg-[#321fdb] text-white': $route.path === child.path }"
            >
              <component :is="child.icon" class="w-4 h-4 mr-3" />
              {{ $t(`settings.${child.key}`) }}
            </router-link>
          </div>
        </div>
      </template>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ChevronDown } from 'lucide-vue-next';
import type { NavItem } from '@/types';

defineProps<{
  items: NavItem[]
}>();

const openSubmenus = ref<string[]>([]);

function toggleSubmenu(key: string) {
  const index = openSubmenus.value.indexOf(key);
  if (index === -1) {
    openSubmenus.value.push(key);
  } else {
    openSubmenus.value.splice(index, 1);
  }
}

function isSubmenuOpen(key: string) {
  return openSubmenus.value.includes(key);
}
</script>