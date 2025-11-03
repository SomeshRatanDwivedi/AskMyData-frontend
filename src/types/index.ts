
export type Role = 'user' | 'model';

export interface Message {
  role: Role;
  content: string;
  isThinking?: boolean;
  id?:string
}

export type UserLoginFormValueType = {
  email:string
  password: string;
}

export type UserLoginFormValueErrorType={
  emailError: string,
  passwordError: string;
}

export type UserRegisterFormValueType = UserLoginFormValueType &{
  firstName: string;
  lastName: string
}

export type UserRegisterFormValueErrorType = UserLoginFormValueErrorType &{
  firstNameError: string,
  lastNameError: string;
}

export type ChatType = {
  question: string;
  answer: string
}
// Types
export type FileStatus = "PENDING" | "EMBEDDED" | "FAILED" | "UNKNOWN";
export type FileType = {
  id: string;
  originalName: string;
  size: number; // bytes
  createdAt: string | number | Date;
  status: FileStatus;
  filePath: string;
}



export type UserType = UserRegisterFormValueType & {
  accessToken: string,
  userId: number | null,
  createdAt: string,
  updatedAt: string,
  isAdmin: boolean,
  files?: FileType[],
  filesCount?: number,
  isActive?: boolean,
  groqApiKey:string
}