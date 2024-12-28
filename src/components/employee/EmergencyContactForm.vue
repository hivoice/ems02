<template>
  <div class="space-y-6">
    <!-- 緊急連絡先リスト -->
    <div v-for="(contact, index) in emergencyContacts" :key="index" class="bg-gray-50 p-4 rounded-lg">
      <div class="flex justify-between items-start mb-4">
        <h4 class="text-lg font-medium">緊急連絡先 {{ index + 1 }}</h4>
        <button
          @click="removeContact(index)"
          class="text-red-600 hover:text-red-800"
        >
          削除
        </button>
      </div>

      <div class="space-y-4">
        <!-- 家族メンバー選択 -->
        <div class="grid grid-cols-[200px,1fr] gap-8">
          <div>
            <h3 class="text-lg font-medium text-gray-900">家族メンバー</h3>
          </div>
          <div>
            <select
              v-model="contact.familyMemberId"
              class="input-field"
              @change="e => handleFamilyMemberSelect(e, index)"
            >
              <option value="">新規連絡先を登録</option>
              <option
                v-for="member in availableFamilyMembers"
                :key="member.id"
                :value="member.id"
              >
                {{ member.lastName }} {{ member.firstName }}
              </option>
            </select>
          </div>
        </div>

        <!-- 連絡先情報 -->
        <template v-if="!isLinkedToFamilyMember(contact)">
          <div class="grid grid-cols-[200px,1fr] gap-8">
            <div>
              <h3 class="text-lg font-medium text-gray-900">氏名</h3>
            </div>
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <FormField label="姓" required>
                  <input v-model="contact.lastName" type="text" required class="input-field" />
                </FormField>
                <FormField label="名" required>
                  <input v-model="contact.firstName" type="text" required class="input-field" />
                </FormField>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <FormField label="セイ" required>
                  <input v-model="contact.lastNameKana" type="text" required class="input-field" />
                </FormField>
                <FormField label="メイ" required>
                  <input v-model="contact.firstNameKana" type="text" required class="input-field" />
                </FormField>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-[200px,1fr] gap-8">
            <div>
              <h3 class="text-lg font-medium text-gray-900">連絡先情報</h3>
            </div>
            <div class="space-y-4">
              <FormField label="続柄" required>
                <input v-model="contact.relationship" type="text" required class="input-field" />
              </FormField>
              <FormField label="電話番号" required>
                <input v-model="contact.phoneNumber" type="tel" required class="input-field" />
              </FormField>
              <FormField label="住所" required>
                <input v-model="contact.address" type="text" required class="input-field" />
              </FormField>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- 緊急連絡先追加ボタン -->
    <button
      v-if="emergencyContacts.length < 2"
      type="button"
      @click="addContact"
      class="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#321fdb]"
    >
      緊急連絡先を追加
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { EmergencyContact, FamilyMember } from '@/lib/db/schema/employee';
import FormField from '@/components/forms/FormField.vue';

const props = defineProps<{
  familyMembers?: Partial<FamilyMember>[];
}>();

const emit = defineEmits<{
  update: [data: Partial<EmergencyContact>[]];
}>();

const emergencyContacts = ref<Partial<EmergencyContact>[]>([]);

const availableFamilyMembers = computed(() => {
  return props.familyMembers?.filter(m => m.isEmergencyContact) || [];
});

function addContact() {
  if (emergencyContacts.value.length >= 2) return;
  
  emergencyContacts.value.push({
    familyMemberId: '',
    lastName: '',
    firstName: '',
    lastNameKana: '',
    firstNameKana: '',
    relationship: '',
    phoneNumber: '',
    address: ''
  });
}

function removeContact(index: number) {
  emergencyContacts.value.splice(index, 1);
  emit('update', emergencyContacts.value);
}

function handleFamilyMemberSelect(event: Event, index: number) {
  const familyMemberId = (event.target as HTMLSelectElement).value;
  const contact = emergencyContacts.value[index];
  
  if (familyMemberId) {
    const familyMember = availableFamilyMembers.value.find(m => m.id === familyMemberId);
    if (familyMember) {
      contact.lastName = familyMember.lastName;
      contact.firstName = familyMember.firstName;
      contact.lastNameKana = familyMember.lastNameKana;
      contact.firstNameKana = familyMember.firstNameKana;
      contact.relationship = familyMember.relationship;
      contact.phoneNumber = familyMember.phoneNumber || '';
    }
  } else {
    contact.lastName = '';
    contact.firstName = '';
    contact.lastNameKana = '';
    contact.firstNameKana = '';
    contact.relationship = '';
  }
}

function isLinkedToFamilyMember(contact: Partial<EmergencyContact>) {
  return !!contact.familyMemberId;
}

watch(emergencyContacts, () => {
  emit('update', emergencyContacts.value);
}, { deep: true });

defineExpose({ emergencyContacts });
</script>