import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disables specific type-related rules
      "@typescript-eslint/no-explicit-any": "off", // Allow `any` type
      "@typescript-eslint/explicit-module-boundary-types": "off", // Disables explicit return types on functions
      "@typescript-eslint/explicit-function-return-type": "off", // Disables explicit return type on functions
      "@typescript-eslint/no-unsafe-assignment": "off", // Allow unsafe assignments
      "@typescript-eslint/no-unsafe-member-access": "off", // Allow unsafe member access
      "@typescript-eslint/no-unsafe-call": "off", // Allow unsafe calls
      "@typescript-eslint/ban-types": "off", // Disables banning of specific types like `Object`, `Function`, etc.
      "@typescript-eslint/no-inferrable-types": "off", // Allow explicit type declarations even when inferred
    },
  },
];

export default eslintConfig;
