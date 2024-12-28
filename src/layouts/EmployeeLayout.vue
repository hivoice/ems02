<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <div :class="{ 'hidden': !sidebarOpen, 'block': sidebarOpen }" class="lg:block">
      <TheSidebar :items="employeeNavItems" />
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <TheHeader @toggle-sidebar="toggleSidebar" />
      
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <div class="container mx-auto px-6 py-8">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TheSidebar from '../components/TheSidebar.vue';
import TheHeader from '../components/TheHeader.vue';
import { EMPLOYEE_NAV_ITEMS } from '@/constants/navigation';

const sidebarOpen = ref(true);
const employeeNavItems = EMPLOYEE_NAV_ITEMS;

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value;
}
</script>