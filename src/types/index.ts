
export type Role = 'user' | 'model';

export interface Message {
  role: Role;
  content: string;
  isThinking?: boolean;
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