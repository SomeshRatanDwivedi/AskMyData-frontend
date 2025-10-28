/**
 * Author Suresh Sargam
 * Date  01/09/2024
 * @description Capitalize first letter of String
 */

/// <reference types="vite/client" />
/// <reference types="vite-plugin-pages/client-react" />

/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_SYNCFUSION_LICENSE_KEY: string; // Declare your env variable
  // Add other VITE environment variables here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
