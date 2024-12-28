-- 基本情報テーブル
CREATE TABLE IF NOT EXISTS employees (
  id TEXT PRIMARY KEY,
  last_name TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name_kana TEXT NOT NULL,
  first_name_kana TEXT NOT NULL,
  gender TEXT CHECK(gender IN ('男性', '女性', 'その他')) NOT NULL,
  birth_date DATE NOT NULL,
  personal_number TEXT UNIQUE,
  department_id TEXT NOT NULL,
  position TEXT NOT NULL,
  hire_date DATE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  is_foreigner BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- 外国人情報テーブル
CREATE TABLE IF NOT EXISTS foreigner_info (
  id TEXT PRIMARY KEY,
  employee_id TEXT NOT NULL,
  nationality TEXT NOT NULL,
  passport_number TEXT NOT NULL,
  passport_photo TEXT NOT NULL,
  resident_card_number TEXT NOT NULL,
  resident_card_front_photo TEXT NOT NULL,
  resident_card_back_photo TEXT NOT NULL,
  resident_card_issued_date DATE NOT NULL,
  resident_card_expiry_date DATE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- 家族情報テーブル
CREATE TABLE IF NOT EXISTS family_members (
  id TEXT PRIMARY KEY,
  employee_id TEXT NOT NULL,
  last_name TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name_kana TEXT NOT NULL,
  first_name_kana TEXT NOT NULL,
  relationship TEXT NOT NULL,
  birth_date DATE NOT NULL,
  is_emergency_contact BOOLEAN DEFAULT FALSE,
  phone_number TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- 緊急連絡先テーブル
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id TEXT PRIMARY KEY,
  employee_id TEXT NOT NULL,
  family_member_id TEXT,
  last_name TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name_kana TEXT NOT NULL,
  first_name_kana TEXT NOT NULL,
  relationship TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  address TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  FOREIGN KEY (family_member_id) REFERENCES family_members(id) ON DELETE SET NULL,
  CONSTRAINT max_emergency_contacts CHECK (
    (SELECT COUNT(*) FROM emergency_contacts WHERE employee_id = employee_id) <= 2
  )
);

-- インデックス
CREATE INDEX idx_employees_department ON employees(department_id);
CREATE INDEX idx_foreigner_info_employee ON foreigner_info(employee_id);
CREATE INDEX idx_family_members_employee ON family_members(employee_id);
CREATE INDEX idx_emergency_contacts_employee ON emergency_contacts(employee_id);
CREATE INDEX idx_emergency_contacts_family ON emergency_contacts(family_member_id);