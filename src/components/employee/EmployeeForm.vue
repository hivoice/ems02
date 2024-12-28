<template>
  <div>
    <EmployeeFormTabs>
      <template #basic>
        <BasicInfoForm
          ref="basicInfoForm"
          :initial-data="initialData"
          @update="handleBasicInfoUpdate"
        />
      </template>

      <template #family>
        <FamilyInfoForm
          ref="familyInfoForm"
          @update="handleFamilyInfoUpdate"
        />
      </template>

      <template #emergency>
        <EmergencyContactForm
          ref="emergencyContactForm"
          :family-members="familyMembers"
          @update="handleEmergencyContactUpdate"
        />
      </template>
    </EmployeeFormTabs>

    <!-- 外国籍社員の追加情報 -->
    <div v-if="isForeigner" class="mt-6 space-y-6 border-t pt-6">
      <h3 class="text-lg font-medium text-gray-900">外国籍社員情報</h3>
      <div class="space-y-4">
        <!-- 国籍・パスポート情報 -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">国籍</label>
            <input
              v-model="foreignerInfo.nationality"
              type="text"
              required
              class="input-field"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">パスポート番号</label>
            <input
              v-model="foreignerInfo.passportNumber"
              type="text"
              required
              class="input-field"
            />
          </div>
        </div>

        <!-- パスポート写真 -->
        <div>
          <label class="block text-sm font-medium text-gray-700">パスポート写真</label>
          <input
            type="file"
            accept="image/*"
            @change="handlePassportPhotoUpload"
            class="mt-1"
          />
        </div>

        <!-- 在留カード情報 -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">在留カード番号</label>
            <input
              v-model="foreignerInfo.residentCardNumber"
              type="text"
              required
              class="input-field"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">在留カード交付日</label>
            <input
              v-model="foreignerInfo.residentCardIssuedDate"
              type="date"
              required
              class="input-field"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">在留期限満了日</label>
          <input
            v-model="foreignerInfo.residentCardExpiryDate"
            type="date"
            required
            class="input-field"
          />
        </div>

        <!-- 在留カード写真 -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">在留カード（表面）</label>
            <input
              type="file"
              accept="image/*"
              @change="handleResidentCardFrontUpload"
              class="mt-1"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">在留カード（裏面）</label>
            <input
              type="file"
              accept="image/*"
              @change="handleResidentCardBackUpload"
              class="mt-1"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- アクションボタン -->
    <div class="mt-6 flex justify-end space-x-4">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import EmployeeFormTabs from './EmployeeFormTabs.vue';
import BasicInfoForm from './BasicInfoForm.vue';
import FamilyInfoForm from './FamilyInfoForm.vue';
import EmergencyContactForm from './EmergencyContactForm.vue';
import type { 
  EmployeeBasic,
  FamilyMember,
  EmergencyContact,
  ForeignerInfo 
} from '@/lib/db/schema/employee';

const props = defineProps<{
  initialData?: Partial<EmployeeBasic>;
}>();

const emit = defineEmits<{
  submit: [data: {
    basic: Partial<EmployeeBasic>;
    family: Partial<FamilyMember>[];
    emergency: Partial<EmergencyContact>[];
    foreigner?: Partial<ForeignerInfo>;
  }];
}>();

const basicInfoForm = ref<any>(null);
const familyInfoForm = ref<any>(null);
const emergencyContactForm = ref<any>(null);

const basicInfo = ref<Partial<EmployeeBasic>>({});
const familyMembers = ref<Partial<FamilyMember>[]>([]);
const emergencyContacts = ref<Partial<EmergencyContact>[]>([]);
const foreignerInfo = ref<Partial<ForeignerInfo>>({});

const isForeigner = computed(() => basicInfo.value.isForeigner);

function handleBasicInfoUpdate(data: Partial<EmployeeBasic>) {
  basicInfo.value = data;
}

function handleFamilyInfoUpdate(data: Partial<FamilyMember>[]) {
  familyMembers.value = data;
}

function handleEmergencyContactUpdate(data: Partial<EmergencyContact>[]) {
  emergencyContacts.value = data;
}

function handlePassportPhotoUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    // ファイルアップロード処理
  }
}

function handleResidentCardFrontUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    // ファイルアップロード処理
  }
}

function handleResidentCardBackUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    // ファイルアップロード処理
  }
}

function validate(): boolean {
  // 各フォームのバリデーション
  return true;
}

function submit() {
  if (!validate()) return;

  const data = {
    basic: basicInfo.value,
    family: familyMembers.value,
    emergency: emergencyContacts.value,
    ...(isForeigner.value && { foreigner: foreignerInfo.value })
  };

  emit('submit', data);
}

defineExpose({
  submit,
  validate
});
</script>