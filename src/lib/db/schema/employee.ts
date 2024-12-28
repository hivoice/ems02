import { z } from 'zod';

// 基本情報のスキーマ
export const employeeBasicSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid().optional(),
  lastName: z.string().min(1, '姓を入力してください'),
  firstName: z.string().min(1, '名を入力してください'),
  lastNameKana: z.string().min(1, 'セイを入力してください'),
  firstNameKana: z.string().min(1, 'メイを入力してください'),
  gender: z.enum(['男性', '女性', 'その他']),
  birthDate: z.date(),
  personalNumber: z.string().regex(/^\d{12}$/, '個人番号は12桁の数字で入力してください'),
  departmentId: z.string().uuid(),
  position: z.string().min(1, '役職を入力してください'),
  hireDate: z.date(),
  email: z.string().email('有効なメールアドレスを入力してください'),
  isForeigner: z.boolean().default(false),
  status: z.enum(['active', 'inactive']).default('active'),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date())
});

// 外国人情報のスキーマ
export const foreignerInfoSchema = z.object({
  id: z.string().uuid(),
  employeeId: z.string().uuid(),
  nationality: z.string().min(1, '国籍を入力してください'),
  passportNumber: z.string().min(1, 'パスポート番号を入力してください'),
  passportPhoto: z.string(),
  residentCardNumber: z.string().min(1, '在留カード番号を入力してください'),
  residentCardFrontPhoto: z.string(),
  residentCardBackPhoto: z.string(),
  residentCardIssuedDate: z.date(),
  residentCardExpiryDate: z.date(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date())
});

// 家族情報のスキーマ
export const familyMemberSchema = z.object({
  id: z.string().uuid(),
  employeeId: z.string().uuid(),
  lastName: z.string().min(1, '姓を入力してください'),
  firstName: z.string().min(1, '名を入力してください'),
  lastNameKana: z.string().min(1, 'セイを入力してください'),
  firstNameKana: z.string().min(1, 'メイを入力してください'),
  relationship: z.string().min(1, '続柄を入力してください'),
  birthDate: z.date(),
  isEmergencyContact: z.boolean().default(false),
  phoneNumber: z.string().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date())
});

// 緊急連絡先のスキーマ
export const emergencyContactSchema = z.object({
  id: z.string().uuid(),
  employeeId: z.string().uuid(),
  familyMemberId: z.string().uuid().optional(),
  lastName: z.string().min(1, '姓を入力してください'),
  firstName: z.string().min(1, '名を入力してください'),
  lastNameKana: z.string().min(1, 'セイを入力してください'),
  firstNameKana: z.string().min(1, 'メイを入力してください'),
  relationship: z.string().min(1, '続柄を入力してください'),
  phoneNumber: z.string().min(1, '電話番号を入力してください'),
  address: z.string().min(1, '住所を入力してください'),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date())
});

export type EmployeeBasic = z.infer<typeof employeeBasicSchema>;
export type ForeignerInfo = z.infer<typeof foreignerInfoSchema>;
export type FamilyMember = z.infer<typeof familyMemberSchema>;
export type EmergencyContact = z.infer<typeof emergencyContactSchema>;

// バリデーション関数
export function validateEmployeeBasic(data: unknown) {
  return employeeBasicSchema.safeParse(data);
}

export function validateForeignerInfo(data: unknown) {
  return foreignerInfoSchema.safeParse(data);
}

export function validateFamilyMember(data: unknown) {
  return familyMemberSchema.safeParse(data);
}

export function validateEmergencyContact(data: unknown) {
  return emergencyContactSchema.safeParse(data);
}