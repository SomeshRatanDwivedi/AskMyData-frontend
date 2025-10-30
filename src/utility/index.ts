import { SECRET_KEY } from "@/constants";
import type { UserRegisterFormValueErrorType, UserRegisterFormValueType } from "@/types";
import type { AxiosError } from "axios";
import CryptoJS from 'crypto-js';
import { toast } from "react-toastify";


const validateUserForm = (
  formValue: Partial<UserRegisterFormValueType>
): { valid: boolean; errors: Partial<UserRegisterFormValueErrorType> } => {
  const nameRegex = /^[a-zA-Z0-9_]+$/;
  const passwordRegex = /^.{6,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (formValue.firstName && !nameRegex.test(formValue.firstName)) {
    return {
      valid: false,
      errors: {
        firstNameError:
          "First name can only contain letters, numbers, and underscores.",
      },
    };
  }

  if (formValue.lastName && !nameRegex.test(formValue.lastName)) {
    return {
      valid: false,
      errors: {
        lastNameError:
          "Last name can only contain letters, numbers, and underscores.",
      },
    };
  }

  if (formValue.email && !emailRegex.test(formValue.email)) {
    return {
      valid: false,
      errors: { emailError: "Please enter a valid email address." },
    };
  }

  if (formValue.password && !passwordRegex.test(formValue.password)) {
    return {
      valid: false,
      errors: { passwordError: "Password must be at least 6 characters long." },
    };
  }

  return { valid: true, errors: {} };
};

const encryptMethod = (value: string | number) => {
  return CryptoJS.AES.encrypt(value + "", SECRET_KEY).toString();
}

const decryptMethod = (value: string | number) => {
  try {
    const bytes = CryptoJS.AES.decrypt(value + "", SECRET_KEY);

    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    if (!decrypted) {
      console.log("❌ Failed decryption — likely wrong key or corrupted cipher");
      throw new Error("User input is mailformed")
    }

    return decrypted;
  } catch (err) {
    console.error("Error in decryptMethod: ", err);
    throw err;
  }
};

const handleCatchBlockError = (error: unknown, userErrorMessage = "") => {
  const axiosError = error as AxiosError<{ message: string }>;
  toast.error(axiosError.response?.data?.message || userErrorMessage);
}

export { validateUserForm, encryptMethod, decryptMethod, handleCatchBlockError };
