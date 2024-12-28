<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <!-- 背景オーバーレイ -->
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75" @click="$emit('close')"></div>
      </div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <!-- モーダルパネル -->
      <div
        class="inline-block w-full max-w-6xl align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        <!-- ヘッダー -->
        <div class="bg-white px-8 pt-6 pb-4">
          <div class="flex justify-between items-center">
            <h3 class="text-xl font-medium text-gray-900" id="modal-headline">
              <slot name="title"></slot>
            </h3>
            <button
              @click="$emit('close')"
              class="text-gray-400 hover:text-gray-500"
            >
              <span class="sr-only">閉じる</span>
              <XIcon class="h-6 w-6" />
            </button>
          </div>
        </div>

        <!-- コンテンツ -->
        <div class="bg-gray-50 px-8 py-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <slot name="content"></slot>
        </div>

        <!-- フッター -->
        <div class="bg-white px-8 py-4 sm:flex sm:flex-row-reverse">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { XIcon } from 'lucide-vue-next';

defineEmits(['close']);
</script>