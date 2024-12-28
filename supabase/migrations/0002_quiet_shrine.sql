-- Initial schema for HRMS
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT CHECK(role IN ('admin', 'employee')) NOT NULL DEFAULT 'employee',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE departments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE positions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  department_id TEXT REFERENCES departments(id),
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employees (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE REFERENCES users(id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  department_id TEXT REFERENCES departments(id),
  position_id TEXT REFERENCES positions(id),
  hire_date DATE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE attendance (
  id TEXT PRIMARY KEY,
  employee_id TEXT REFERENCES employees(id),
  date DATE NOT NULL,
  check_in DATETIME,
  check_out DATETIME,
  status TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE salaries (
  id TEXT PRIMARY KEY,
  employee_id TEXT REFERENCES employees(id),
  amount DECIMAL(10,2) NOT NULL,
  effective_date DATE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE performance_reviews (
  id TEXT PRIMARY KEY,
  employee_id TEXT REFERENCES employees(id),
  reviewer_id TEXT REFERENCES employees(id),
  review_date DATE NOT NULL,
  rating INTEGER CHECK(rating >= 1 AND rating <= 5),
  comments TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_employees_user_id ON employees(user_id);
CREATE INDEX idx_employees_department_id ON employees(department_id);
CREATE INDEX idx_employees_position_id ON employees(position_id);
CREATE INDEX idx_attendance_employee_id ON attendance(employee_id);
CREATE INDEX idx_salaries_employee_id ON salaries(employee_id);
CREATE INDEX idx_performance_reviews_employee_id ON performance_reviews(employee_id);