export type VerificationMethod = "email" | "phone";

export interface RegisterType {
  name: string;
  email: string;
  phone: string;
  password: string;
  verificationMethod: VerificationMethod;
}
