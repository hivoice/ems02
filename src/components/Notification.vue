<template>
  <TransitionGroup
    tag="div"
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
    class="fixed inset-0 z-50 flex flex-col items-end justify-start p-4 space-y-4 pointer-events-none sm:p-6"
  >
    <div
      v-for="notification in notifications"
      :key="notification.id"
      class="w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-lg pointer-events-auto ring-1 ring-black ring-opacity-5"
    >
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <component
              :is="notification.type === 'success' ? CheckCircle : XCircle"
              class="w-6 h-6"
              :class="notification.type === 'success' ? 'text-green-400' : 'text-red-400'"
            />
          </div>
          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p 
              class="text-sm font-medium text-gray-900"
              v-html="$t(notification.message, notification.params)"
            ></p>
          </div>
          <div class="ml-4 flex-shrink-0 flex">
            <button
              @click="removeNotification(notification.id)"
              class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span class="sr-only">閉じる</span>
              <X class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { CheckCircle, XCircle, X } from 'lucide-vue-next';

interface Notification {
  id: number;
  type: 'success' | 'error';
  message: string;
  params?: Record<string, any>;
}

const notifications = ref<Notification[]>([]);
let nextId = 0;

function addNotification(
  type: 'success' | 'error',
  message: string,
  params?: Record<string, any>
) {
  const id = nextId++;
  notifications.value.push({ id, type, message, params });
  setTimeout(() => removeNotification(id), 5000);
}

function removeNotification(id: number) {
  const index = notifications.value.findIndex(n => n.id === id);
  if (index > -1) {
    notifications.value.splice(index, 1);
  }
}

defineExpose({
  addNotification
});
</script>