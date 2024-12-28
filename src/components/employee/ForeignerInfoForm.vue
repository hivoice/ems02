<template>
  <div class="space-y-6">
    <h3 class="text-lg font-medium text-gray-900">外国籍社員情報</h3>
    
    <!-- 国籍・パスポート情報 -->
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">国籍</label>
        <input
          v-model="form.nationality"
          type="text"
          required
          class="input-field"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">パスポート番号</label>
        <input
          v-model="form.passportNumber"
          type="text"
          required
          class="input-field"
        />
      </div>
    </div>

    <!-- パスポート写真 -->
    <ImageUpload
      label="パスポート写真"
      :preview-url="form.passportPhoto"
      @update="handlePassportPhotoUpload"
    />

    <!-- 在留カード情報 -->
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">在留カード番号</label>
        <input
          v-model="form.residentCardNumber"
          type="text"
          required
          class="input-field"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">在留カード交付日</label>
        <input
          v-model="form.residentCardIssuedDate"
          type="date"
          required
          class="input-field"
        />
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">在留期限満了日</label>
      <input
        v-model="form.residentCardExpiryDate"
        type="date"
        required
        class="input-field"
      />
    </div>

    <!-- 在留カード写真 -->
    <div class="grid grid-cols-2 gap-4">
      <ImageUpload
        label="在留カード（表面）"
        :preview-url="form.residentCardFrontPhoto"
        @update="handleResidentCardFrontUpload"
      />
      <ImageUpload
        label="在留カード（裏面）"
        :preview-url="form.residentCardBackPhoto"
        @update="handleResidentCardBackUpload"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import ImageUpload from './ImageUpload.vue';
import type { ForeignerInfo } from '@/lib/db/schema/employee';

const emit = defineEmits<{
  update: [data: Partial<ForeignerInfo>];
}>();

const form = ref<Partial<ForeignerInfo>>({
  nationality: '',
  passportNumber: '',
  passportPhoto: '',
  residentCardNumber: '',
  residentCardFrontPhoto: '',
  residentCardBackPhoto: '',
  residentCardIssuedDate: '',
  residentCardExpiryDate: ''
});

function handlePassportPhotoUpload(file: File) {
  // 実際の実装ではファイルアップロード処理を行う
  form.value.passportPhoto = URL.createObjectURL(file);
}

function handleResidentCardFrontUpload(file: File) {
  form.value.residentCardFrontPhoto = URL.createObjectURL(file);
}

function handleResidentCardBackUpload(file: File) {
  form.value.residentCardBackPhoto = URL.createObjectURL(file);
}

watch(form, () => {
  emit('update', form.value);
}, { deep: true });

defineExpose({ form });
</script>