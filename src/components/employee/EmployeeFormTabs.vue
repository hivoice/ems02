<template>
  <div class="flex">
    <!-- サイドナビゲーション -->
    <div class="w-64 bg-gray-50 border-r border-gray-200 p-4">
      <nav class="space-y-1">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="w-full flex items-center px-4 py-3 text-sm font-medium rounded-md"
          :class="[
            activeTab === tab.id
              ? 'bg-[#321fdb] text-white'
              : 'text-gray-600 hover:bg-gray-100'
          ]"
        >
          <component :is="tab.icon" class="w-5 h-5 mr-3" />
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- フォームコンテンツ -->
    <div class="flex-1 p-8">
      <TabPanel :is-active="activeTab === 'basic'" class="max-w-3xl">
        <slot name="basic"></slot>
      </TabPanel>
      <TabPanel :is-active="activeTab === 'family'" class="max-w-3xl">
        <slot name="family"></slot>
      </TabPanel>
      <TabPanel :is-active="activeTab === 'emergency'" class="max-w-3xl">
        <slot name="emergency"></slot>
      </TabPanel>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { User, Users, Phone } from 'lucide-vue-next';
import TabPanel from './TabPanel.vue';

const tabs = [
  { id: 'basic', label: '基本情報', icon: User },
  { id: 'family', label: '家族情報', icon: Users },
  { id: 'emergency', label: '緊急連絡先', icon: Phone }
];

const activeTab = ref('basic');
</script>