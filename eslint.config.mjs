// eslint.config.js

import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import jsdoc from "eslint-plugin-jsdoc";
import noSecrets from "eslint-plugin-no-secrets";


export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js, jsdoc, noSecrets },
    extends: ["js/recommended"],
    ignores: ["eslint.config.mjs"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
    },

    rules: {
      // Naming Conventions
      "camelcase": [
        "error",
        {
          "properties": "always",
          "ignoreDestructuring": false,
          "ignoreImports": false,
          "ignoreGlobals": false
        }
      ],

      // No secrets or sensitive data
      "no-secrets/no-secrets": "off",

      // Code Quality
      "no-console": ["warn", { "allow": ["warn", "error"] }],
      "no-debugger": "error",
      "no-unused-vars": ["error", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }],
      "no-var": "error",
      "prefer-const": "error",

      // Best Practices
      "eqeqeq": ["error", "always"],
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",

      // ES6+
      "arrow-body-style": ["error", "as-needed"],
      "prefer-arrow-callback": "error",
      "prefer-template": "error",
      
      // Documentation
      "jsdoc/require-jsdoc": "error"
    }
  },
  {
    files: ["tests/*.test.js"], 
    rules: {
      "no-console": "off",
      "no-unused-vars": "off" ,
      "no-undef": "off"
    }
  }
]);