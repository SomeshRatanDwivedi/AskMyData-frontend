export const USER_INPUTS_INFO_REGISTER = [
  {
    type: "email",
    name: "email",
    id: "email",
    placeHolder: "Enter your email",
    className:
      "w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400",
    autoComplete: "off"
  },
  {
    type: "text",
    name: "firstName",
    id: "firstName",
    placeHolder: "Enter your first name",
    className:
      "w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400",
    autoComplete: "off"
  },
  {
    type: "text",
    name: "lastName",
    id: "lastName",
    placeHolder: "Enter your last name",
    className:
      "w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400",
    autoComplete: "off"
  },
  {
    type: "password",
    name: "password",
    id: "password",
    placeHolder: "Enter your password",
    className:
      "w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400",
    autoComplete: "new-password"
  }
];

export const USER_INPUTS_INFO_LOGIN = [
  {
    type: "email",
    name: "email",
    id: "email",
    placeHolder: "Enter your email",
    className:
      "w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400",
    autoComplete: "on"
  },
  {
    type: "password",
    name: "password",
    id: "password",
    placeHolder: "Enter your password",
    className:
      "w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400",
    autoComplete: "on"
  }
];

export const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

export const BADGE_COLOR_STATUS_MAPPING: Record<string, string> = {
  "UNKNOWN": "bg-gray-100 text-gray-800",
  "PENDING": "bg-yellow-100 text-yellow-800",
  "EMBEDDED": "bg-green-100 text-green-800",
  "FAILED": "bg-red-100 text-red-800",
};