import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Playwright build artifacts
    "playwright/.cache/**",
  ]),
  // Custom rule overrides for migrated codebase
  {
    rules: {
      // Disable noisy warnings for migrated code - can be fixed incrementally
      "@typescript-eslint/no-explicit-any": "off",
      // Allow anonymous default exports for utility files
      "import/no-anonymous-default-export": "off",
      // Use @ts-expect-error instead of @ts-ignore
      "@typescript-eslint/ban-ts-comment": ["error", {
        "ts-expect-error": "allow-with-description",
        "ts-ignore": "allow-with-description",
      }],
      // Allow unused vars during migration
      "@typescript-eslint/no-unused-vars": "off",
      // Allow missing deps during migration
      "react-hooks/exhaustive-deps": "off",
      // Allow img tags during migration
      "@next/next/no-img-element": "off",
      // Allow ref mutations in render (common pattern for virtualized lists)
      "react-hooks/immutability": "off",
    },
  },
]);

export default eslintConfig;
