<template>
  <div class="space-y-6">
    <!-- 家族メンバーリスト -->
    <div v-for="(member, index) in familyMembers" :key="index" class="bg-gray-50 p-4 rounded-lg">
      <div class="flex justify-between items-start mb-4">
        <h4 class="text-lg font-medium">家族メンバー {{ index + 1 }}</h4>
        <button
          @click="removeFamilyMember(index)"
          class="text-red-600 hover:text-red-800"
        >
          削除
        </button>
      </div>

      <div class="space-y-4">
        <!-- 氏名 -->
        <div class="grid grid-cols-[200px,1fr] gap-8">
          <div>
            <h3 class="text-lg font-medium text-gray-900">氏名</h3>
          </div>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <FormField label="姓" required>
                <input v-model="member.lastName" type="text" required class="input-field" />
              </FormField>
              <FormField label="名" required>
                <input v-model="member.firstName" type="text" required class="input-field" />
              </FormField>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <FormField label="セイ" required>
                <input v-model="member.lastNameKana" type="text" required class="input-field" />
              </FormField>
              <FormField label="メイ" required>
                <input v-model="member.firstNameKana" type="text" required class="input-field" />
              </FormField>
            </div>
          </div>
        </div>

        <!-- 続柄・生年月日 -->
        <div class="grid grid-cols-[200px,1fr] gap-8">
          <div>
            <h3 class="text-lg font-medium text-gray-900">基本情報</h3>
          </div>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <FormField label="続柄" required>
                <input v-model="member.relationship" type="text" required class="input-field" />
              </FormField>
              <FormField label="生年月日" required>
                <input v-model="member.birthDate" type="date" required class="input-field" />
              </FormField>
            </div>
          </div>
        </div>

        <!-- 緊急連絡先情報 -->
        <div class="grid grid-cols-[200px,1fr] gap-8">
          <div>
            <h3 class="text-lg font-medium text-gray-900">連絡先情報</h3>
          </div>
          <div class="space-y-4">
            <div class="flex items-center mb-4">
              <input
                v-model="member.isEmergencyContact"
                type="checkbox"
                class="h-4 w-4 text-[#321fdb] focus:ring-[#321fdb] border-gray-300 rounded"
                :disabled="isEmergencyContactLimitReached && !member.isEmergencyContact"
              />
              <label class="ml-2 block text-sm text-gray-900">
                緊急連絡先として登録
              </label>
            </div>
            <div v-if="member.isEmergencyContact">
              <FormField label="電話番号" required>
                <input v-model="member.phoneNumber" type="tel" required class="input-field" />
              </FormField>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 家族メンバー追加ボタン -->
    <button
      type="button"
      @click="addFamilyMember"
      class="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#321fdb]"
    >
      家族メンバーを追加
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { FamilyMember } from '@/lib/db/schema/employee';
import FormField from '@/components/forms/FormField.vue';

const emit = defineEmits<{
  update: [data: Partial<FamilyMember>[]];
}>();

const familyMembers = ref<Partial<FamilyMember>[]>([]);

const isEmergencyContactLimitReached = computed(() => {
  return familyMembers.value.filter(m => m.isEmergencyContact).length >= 2;
});

function addFamilyMember() {
  familyMembers.value.push({
    lastName: '',
    firstName: '',
    lastNameKana: '',
    firstNameKana: '',
    relationship: '',
    birthDate: '',
    isEmergencyContact: false,
    phoneNumber: ''
  });
}

function removeFamilyMember(index: number) {
  familyMembers.value.splice(index, 1);
  emit('update', familyMembers.value);
}

defineExpose({ familyMembers });
</script>