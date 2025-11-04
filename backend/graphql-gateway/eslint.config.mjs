import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { 
    files: ["**/*.js"], 
    plugins: { js }, 
    extends: ["js/recommended"], 
    languageOptions: { 
      globals: { 
        ...globals.browser,  
        ...globals.node     
      }
    },
    rules:{
       "no-unused-vars": ["error", { "args": "all", "varsIgnorePattern": "^_", "argsIgnorePattern": "^_" }],
      "no-console": "off",
      "no-undef": "error",
    }
  },
  { 
    files: ["**/*.js"], 
    languageOptions: { sourceType: "commonjs" } 
  },
]);
