<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- 氏名セクション -->
    <div class="grid grid-cols-[200px,1fr] gap-8">
      <div>
        <h3 class="text-lg font-medium text-gray-900">氏名</h3>
      </div>
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <FormField label="姓" required>
            <input v-model="form.lastName" type="text" required class="input-field" />
          </FormField>
          <FormField label="名" required>
            <input v-model="form.firstName" type="text" required class="input-field" />
          </FormField>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <FormField label="セイ" required>
            <input v-model="form.lastNameKana" type="text" required class="input-field" />
          </FormField>
          <FormField label="メイ" required>
            <input v-model="form.firstNameKana" type="text" required class="input-field" />
          </FormField>
        </div>
      </div>
    </div>

    <!-- 基本情報セクション -->
    <div class="grid grid-cols-[200px,1fr] gap-8">
      <div>
        <h3 class="text-lg font-medium text-gray-900">基本情報</h3>
      </div>
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <FormField label="生年月日" required>
            <input v-model="form.birthDate" type="date" required class="input-field" />
          </FormField>
          <FormField label="性別" required>
            <select v-model="form.gender" required class="input-field">
              <option value="男性">男性</option>
              <option value="女性">女性</option>
              <option value="その他">その他</option>
            </select>
          </FormField>
        </div>
        <FormField label="メールアドレス" required>
          <input v-model="form.email" type="email" required class="input-field" />
        </FormField>
        <FormField label="個人番号" required>
          <input v-model="form.personalNumber" type="text" required class="input-field" />
        </FormField>
      </div>
    </div>

    <!-- 所属情報セクション -->
    <div class="grid grid-cols-[200px,1fr] gap-8">
      <div>
        <h3 class="text-lg font-medium text-gray-900">所属情報</h3>
      </div>
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <FormField label="部署" required>
            <select v-model="form.departmentId" required class="input-field">
              <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                {{ dept.name }}
              </option>
            </select>
          </FormField>
          <FormField label="役職" required>
            <input v-model="form.position" type="text" required class="input-field" />
          </FormField>
        </div>
        <FormField label="入社日" required>
          <input v-model="form.hireDate" type="date" required class="input-field" />
        </FormField>
      </div>
    </div>

    <!-- 外国籍社員フラグ -->
    <div class="grid grid-cols-[200px,1fr] gap-8">
      <div>
        <h3 class="text-lg font-medium text-gray-900">その他</h3>
      </div>
      <div class="flex items-center">
        <input
          v-model="form.isForeigner"
          type="checkbox"
          class="h-4 w-4 text-[#321fdb] focus:ring-[#321fdb] border-gray-300 rounded"
        />
        <label class="ml-2 block text-sm text-gray-900">外国籍社員</label>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { EmployeeBasic } from '@/lib/db/schema/employee';
import FormField from '@/components/forms/FormField.vue';

const props = withDefaults(defineProps<{
  initialData?: Partial<EmployeeBasic>;
}>(), {
  initialData: () => ({})
});

const emit = defineEmits<{
  update: [data: Partial<EmployeeBasic>];
}>();

// 仮の部署データ（実際の実装では API から取得）
const departments = ref([
  { id: '1', name: '営業部' },
  { id: '2', name: '開発部' },
  { id: '3', name: '人事部' },
  { id: '4', name: '総務部' }
]);

const form = ref<Partial<EmployeeBasic>>({
  lastName: '',
  firstName: '',
  lastNameKana: '',
  firstNameKana: '',
  gender: '男性',
  birthDate: '',
  email: '',
  personalNumber: '',
  departmentId: '',
  position: '',
  hireDate: '',
  isForeigner: false,
  ...props.initialData
});

watch(form, () => {
  emit('update', form.value);
}, { deep: true });

defineExpose({ form });
</script>