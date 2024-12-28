<template>
  <div>
    <h1 class="text-2xl font-semibold mb-6">給与情報</h1>

    <!-- 期間選択 -->
    <div class="flex items-center space-x-4 mb-6">
      <input
        type="month"
        :value="formatYearMonth"
        @input="handleDateChange"
        class="px-3 py-1 border rounded"
      />
    </div>

    <!-- 給与明細 -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <div v-if="isLoading" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p class="mt-2 text-gray-600">読み込み中...</p>
      </div>

      <template v-else>
        <div v-if="currentSalary" class="space-y-6">
          <div class="grid grid-cols-2 gap-6">
            <!-- 基本情報 -->
            <div class="space-y-4">
              <h3 class="text-lg font-medium border-b pb-2">基本情報</h3>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-600">支給年月</p>
                  <p class="text-lg">{{ currentSalary.year }}年{{ currentSalary.month }}月</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">支給日</p>
                  <p class="text-lg">{{ formatDate(currentSalary.paymentDate) }}</p>
                </div>
              </div>
            </div>

            <!-- 支給額合計 -->
            <div class="space-y-4">
              <h3 class="text-lg font-medium border-b pb-2">支給額合計</h3>
              <p class="text-3xl font-bold text-right">
                ¥{{ formatNumber(currentSalary.totalAmount) }}
              </p>
            </div>
          </div>

          <!-- 明細 -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium border-b pb-2">給与明細</h3>
            <div class="grid grid-cols-2 gap-6">
              <!-- 支給項目 -->
              <div>
                <h4 class="text-sm font-medium text-gray-600 mb-2">支給</h4>
                <table class="w-full">
                  <tr>
                    <td class="py-1">基本給</td>
                    <td class="py-1 text-right">¥{{ formatNumber(currentSalary.baseAmount) }}</td>
                  </tr>
                  <tr>
                    <td class="py-1">残業代</td>
                    <td class="py-1 text-right">¥{{ formatNumber(currentSalary.overtimeAmount) }}</td>
                  </tr>
                  <tr v-for="allowance in currentSalary.allowances" :key="allowance.type">
                    <td class="py-1">{{ allowance.type }}</td>
                    <td class="py-1 text-right">¥{{ formatNumber(allowance.amount) }}</td>
                  </tr>
                </table>
              </div>

              <!-- 控除項目 -->
              <div>
                <h4 class="text-sm font-medium text-gray-600 mb-2">控除</h4>
                <table class="w-full">
                  <tr v-for="deduction in currentSalary.deductions" :key="deduction.type">
                    <td class="py-1">{{ deduction.type }}</td>
                    <td class="py-1 text-right">-¥{{ formatNumber(deduction.amount) }}</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>

          <!-- 印刷ボタン -->
          <div class="flex justify-end">
            <button
              @click="printSalarySlip"
              class="btn-primary py-2 px-4 flex items-center"
            >
              <Printer class="w-5 h-5 mr-2" />
              印刷
            </button>
          </div>
        </div>

        <div v-else class="text-center py-8">
          <p class="text-gray-600">選択された期間の給与データがありません</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Printer } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import { salaryService } from '@/lib/services/salary';
import type { Salary } from '@/types/salary';

const authStore = useAuthStore();
const isLoading = ref(false);
const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth() + 1);
const currentSalary = ref<Salary | null>(null);

const formatYearMonth = computed(() => {
  return `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}`;
});

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

async function loadSalary() {
  if (!authStore.user) return;
  
  isLoading.value = true;
  try {
    const salaries = await salaryService.getEmployeeSalaries(
      authStore.user.id,
      currentYear.value,
      currentMonth.value
    );
    currentSalary.value = salaries[0] || null;
  } catch (error) {
    console.error('給与データの取得に失敗しました:', error);
  } finally {
    isLoading.value = false;
  }
}

function handleDateChange(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  if (value) {
    const [year, month] = value.split('-').map(Number);
    currentYear.value = year;
    currentMonth.value = month;
    loadSalary();
  }
}

function printSalarySlip() {
  if (!currentSalary.value) return;

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
        <p>${currentSalary.value.year}年${currentSalary.value.month}月分</p>
      </div>
      
      <div class="info">
        <p>支給日: ${formatDate(currentSalary.value.paymentDate)}</p>
      </div>

      <table class="table">
        <tr>
          <th>項目</th>
          <th>金額</th>
        </tr>
        <tr>
          <td>基本給</td>
          <td>¥${formatNumber(currentSalary.value.baseAmount)}</td>
        </tr>
        <tr>
          <td>残業代</td>
          <td>¥${formatNumber(currentSalary.value.overtimeAmount)}</td>
        </tr>
        ${currentSalary.value.allowances.map(a => `
          <tr>
            <td>${a.type}</td>
            <td>¥${formatNumber(a.amount)}</td>
          </tr>
        `).join('')}
        ${currentSalary.value.deductions.map(d => `
          <tr>
            <td>${d.type}</td>
            <td>-¥${formatNumber(d.amount)}</td>
          </tr>
        `).join('')}
      </table>

      <div class="total">
        支給総額: ¥${formatNumber(currentSalary.value.totalAmount)}
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(content);
  printWindow.document.close();
  printWindow.print();
}

// 初期データ読み込み
loadSalary();
</script>