export default {
  common: {
    dashboard: 'ダッシュボード',
    employees: '従業員',
    departments: '部署',
    positions: '役職',
    attendance: '勤怠',
    salary: '給与',
    performance: '評価',
    reports: 'レポート',
    settings: '設定',
    search: '検索',
    email: 'メールアドレス',
    role: '役割',
    status: 'ステータス',
    actions: '操作',
    active: '有効',
    inactive: '無効',
    admin: '管理者',
    employee: '従業員',
    add: '追加',
    cancel: 'キャンセル',
    save: '保存',
    delete: '削除',
    edit: '編集',
    confirm: '確認',
    close: '閉じる',
    logout: 'ログアウト'
  },

  auth: {
    adminLoginTitle: '管理者ログイン',
    employeeLoginTitle: '従業員ログイン',
    id: 'ID',
    password: 'パスワード',
    idPlaceholder: '管理者IDを入力',
    passwordPlaceholder: 'パスワードを入力',
    login: 'ログイン',
    loggingIn: 'ログイン中...',
    logout: 'ログアウト',
    invalidCredentials: 'IDまたはパスワードが正しくありません',
    requiredFields: '必須項目です',
    emailPlaceholder: 'メールアドレスを入力',
    unauthorized: 'アクセス権限がありません'
  },

  validation: {
    required: '必須項目です',
    minLength: '6文字以上で入力してください',
    invalidEmail: '有効なメールアドレスを入力してください',
    passwordMismatch: 'パスワードが一致しません'
  },

  settings: {
    title: '設定',
    userManagement: 'ユーザー管理',
    userRoleManagement: 'ユーザー役割管理',
    changePassword: 'パスワード変更',
    currentPassword: '現在のパスワード',
    newPassword: '新しいパスワード',
    confirmPassword: 'パスワード確認',
    updatePassword: 'パスワードを更新',
    passwordUpdated: 'パスワードが更新されました',
    invalidCurrentPassword: '現在のパスワードが正しくありません',
    passwordMismatch: '新しいパスワードが一致しません',
    updateFailed: '更新に失敗しました',
    userRole: {
      admin: '管理者',
      employee: '従業員'
    },
    userStatus: {
      active: '有効',
      blocked: '無効'
    },
    addUser: 'ユーザー追加',
    editUser: 'ユーザー編集',
    blockUser: 'ユーザーをブロック',
    unblockUser: 'ブロック解除',
    blockUserConfirm: 'このユーザーをブロックしますか？\nユーザーはシステムにログインできなくなります。',
    unblockUserConfirm: 'このユーザーのブロックを解除しますか？\nユーザーは再びシステムにログインできるようになります。',
    resetPassword: 'パスワードリセット',
    resetPasswordConfirm: 'このユーザーのパスワードをリセットしますか？\n新しいパスワードが生成されます。',
    newPasswordIs: '新しいパスワード',
    blockSuccess: 'ユーザーをブロックしました',
    unblockSuccess: 'ユーザーのブロックを解除しました',
    saveSuccess: '保存しました',
    passwordResetSuccess: 'パスワードをリセットしました',
    cannotModifyAdmin: '管理者の権限は変更できません',
    roleChangeSuccess: '役割を変更しました',
    confirmRoleChange: '役割を変更しますか？'
  },

  dashboard: {
    adminTitle: '管理者ダッシュボード',
    employeeTitle: '従業員ダッシュボード',
    totalEmployees: '従業員数',
    departments: '部署数',
    presentToday: '本日の出勤者数',
    totalPayroll: '給与総額',
    quickActions: 'クイックアクション',
    recentActivity: '最近の活動',
    addEmployee: '従業員追加',
    createReport: 'レポート作成',
    manageDepartments: '部署管理',
    reviewPerformance: '評価管理',
    attendance: '勤怠状況',
    monthlySalary: '月給',
    performance: '評価',
    present: '出勤中'
  },

  errors: {
    general: 'エラーが発生しました',
    userExists: 'このメールアドレスは既に使用されています',
    invalidOperation: '無効な操作です'
  }
};