<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">給与管理</h1>
      <div class="flex items-center space-x-4">
        <!-- 年月選択 -->
        <input
          type="month"
          :value="formatYearMonth"
          @input="handleDateChange"
          class="px-3 py-1 border rounded"
        />

        <!-- 給与登録ボタン -->
        <button
          @click="showAddModal = true"
          class="btn-primary py-2 px-4 flex items-center"
        >
          <Plus class="w-5 h-5 mr-2" />
          給与登録
        </button>
      </div>
    </div>

    <!-- 給与統計 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <StatCard
        v-for="stat in salaryStats"
        :key="stat.key"
        v-bind="stat"
      />
    </div>

    <!-- 給与一覧 -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                従業員名
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                部署
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                基本給
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                残業代
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                手当
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                控除
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                支給額
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                支給日
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <template v-if="!isLoading">
              <tr v-for="salary in salaries" :key="salary.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ salary.employee.lastName }} {{ salary.employee.firstName }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    {{ salary.employee.departmentName }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    ¥{{ formatNumber(salary.baseAmount) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    ¥{{ formatNumber(salary.overtimeAmount) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    ¥{{ formatNumber(calculateAllowances(salary)) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    ¥{{ formatNumber(calculateDeductions(salary)) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    ¥{{ formatNumber(salary.totalAmount) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    {{ formatDate(salary.paymentDate) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    @click="editSalary(salary)"
                    class="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    編集
                  </button>
                  <button
                    @click="printSalarySlip(salary)"
                    class="text-gray-600 hover:text-gray-900"
                  >
                    印刷
                  </button>
                </td>
              </tr>
            </template>
            <tr v-else>
              <td colspan="9" class="px-6 py-4 text-center text-sm text-gray-500">
                読み込み中...
              </td>
            </tr>
            <tr v-if="!isLoading && salaries.length === 0">
              <td colspan="9" class="px-6 py-4 text-center text-sm text-gray-500">
                給与データがありません
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 給与登録/編集モーダル -->
    <SalaryFormModal
      v-if="showAddModal || showEditModal"
      :salary="selectedSalary"
      :is-edit="showEditModal"
      @close="closeModal"
      @submit="handleSubmit"
    />

    <!-- 通知 -->
    <Notification ref="notification" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Plus, DollarSign, Users, Calculator } from 'lucide-vue-next';
import StatCard from '@/components/StatCard.vue';
import SalaryFormModal from '@/components/salary/SalaryFormModal.vue';
import Notification from '@/components/Notification.vue';
import { useSalaries } from '@/composables/useSalaries';
import type { SalaryWithEmployee } from '@/types/salary';

const showAddModal = ref(false);
const showEditModal = ref(false);
const selectedSalary = ref<SalaryWithEmployee | null>(null);
const notification = ref<{ addNotification: Function } | null>(null);

const {
  salaries,
  isLoading,
  currentYear,
  currentMonth,
  totalSalaryAmount,
  createSalary,
  updateSalary,
  setDate,
  loadSalaries
} = useSalaries();

const formatYearMonth = computed(() => {
  return `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}`;
});

const salaryStats = computed(() => [
  {
    icon: Users,
    label: '支給対象者数',
    value: `${salaries.value.length}名`,
    color: 'bg-blue-500',
    key: 'employees'
  },
  {
    icon: DollarSign,
    label: '支給総額',
    value: `¥${formatNumber(totalSalaryAmount.value)}`,
    color: 'bg-green-500',
    key: 'total'
  },
  {
    icon: Calculator,
    label: '平均支給額',
    value: `¥${formatNumber(calculateAverageSalary())}`,
    color: 'bg-purple-500',
    key: 'average'
  }
]);

function formatNumber(num: number): string {
  return num.toLocaleString('ja-JP');
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function calculateAllowances(salary: SalaryWithEmployee): number {
  return salary.allowances.reduce((sum, a) => sum + a.amount, 0);
}

function calculateDeductions(salary: SalaryWithEmployee): number {
  return salary.deductions.reduce((sum, d) => sum + d.amount, 0);
}

function calculateAverageSalary(): number {
  if (salaries.value.length === 0) return 0;
  return Math.round(totalSalaryAmount.value / salaries.value.length);
}

function handleDateChange(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  if (value) {
    const [year, month] = value.split('-').map(Number);
    setDate(year, month);
  }
}

function closeModal() {
  showAddModal.value = false;
  showEditModal.value = false;
  selectedSalary.value = null;
}

function editSalary(salary: SalaryWithEmployee) {
  selectedSalary.value = salary;
  showEditModal.value = true;
}

async function handleSubmit(formData: any) {
  try {
    if (showEditModal.value && selectedSalary.value) {
      await updateSalary(selectedSalary.value.id, formData);
      notification.value?.addNotification('success', '給与データを更新しました');
    } else {
      await createSalary(formData);
      notification.value?.addNotification('success', '給与データを登録しました');
    }
    closeModal();
  } catch (error) {
    console.error('給与データの保存に失敗しました:', error);
    notification.value?.addNotification('error', 'エラーが発生しました');
  }
}

function printSalarySlip(salary: SalaryWithEmployee) {
  // 給与明細書の印刷処理を実装
  // プレビューウィンドウを開く
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const content = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>給与明細書</title>
      <style>
        body { font-family: sans-serif; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .info { margin-bottom: 20px; }
        .table { width: 100%; border-collapse: collapse; }
        .table th, .table td { 
          border: 1px solid #ddd; 
          padding: 8px; 
          text-align: left; 
        }
        .total { 
          margin-top: 20px; 
          font-weight: bold;
          text-align: right;
        }
        @media print {
          body { margin: 0; padding: 20px; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>給与明細書</h1>
        <p>${salary.year}年${salary.month}月分</p>
      </div>
      
      <div class="info">
        <p>従業員名: ${salary.employee.lastName} ${salary.employee.firstName}</p>
        <p>部署: ${salary.employee.departmentName}</p>
        <p>支給日: ${formatDate(salary.paymentDate)}</p>
      </div>

      <table class="table">
        <tr>
          <th>項目</th>
          <th>金額</th>
        </tr>
        <tr>
          <td>基本給</td>
          <td>¥${formatNumber(salary.baseAmount)}</td>
        </tr>
        <tr>
          <td>残業代</td>
          <td>¥${formatNumber(salary.overtimeAmount)}</td>
        </tr>
        ${salary.allowances.map(a => `
          <tr>
            <td>${a.type}</td>
            <td>¥${formatNumber(a.amount)}</td>
          </tr>
        `).join('')}
        ${salary.deductions.map(d => `
          <tr>
            <td>${d.type}</td>
            <td>-¥${formatNumber(d.amount)}</td>
          </tr>
        `).join('')}
      </table>

      <div class="total">
        支給総額: ¥${formatNumber(salary.totalAmount)}
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(content);
  printWindow.document.close();
  printWindow.print();
}

// 初期データ読み込み
loadSalaries();
</script>