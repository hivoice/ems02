import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import i18n from './i18n';
import { seedDatabase } from './lib/db/seed';
import './assets/css/index.css';

async function initializeApp() {
  try {
    // Initialize database
    await seedDatabase();
    
    // Create Vue app instance
    const app = createApp(App);
    
    // Install plugins
    app.use(createPinia());
    app.use(router);
    app.use(i18n);
    
    // Mount app
    app.mount('#app');
  } catch (error) {
    console.error('アプリケーションの初期化に失敗しました:', error);
    
    // Show user-friendly error message
    document.body.innerHTML = `
      <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <div class="text-center">
            <h2 class="text-xl font-bold text-red-600 mb-2">
              初期化エラー
            </h2>
            <p class="text-gray-600 mb-4">
              申し訳ありませんが、システムの初期化中にエラーが発生しました。
              ページを更新して、もう一度お試しください。
            </p>
            <button 
              onclick="window.location.reload()"
              class="bg-[#321fdb] text-white px-4 py-2 rounded hover:bg-[#1b2e8f] transition-colors"
            >
              更新する
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

initializeApp();