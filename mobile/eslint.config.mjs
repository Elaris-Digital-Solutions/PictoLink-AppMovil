import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import nextPlugin from '@next/eslint-plugin-next';
import globals from 'globals';
import prettierCompat from 'eslint-config-prettier/flat';

// Las mismas reglas que web/eslint.config.mjs (eslint-config-next 16.4.3 core-web-vitals
// + typescript), armadas a mano: eslint-config-next carga el parser de Babel de `next`
// al importarse y aquí no hay Next. Ese parser sólo se usaba para .js; todo el código de
// mobile/ es .ts/.tsx y lo parsea typescript-eslint, igual que en web/.
// El plugin @next/next se carga porque el código trae `eslint-disable … @next/next/…`.
const eslintConfig = [
    { ignores: ['dist/**', 'node_modules/**'] },

    {
        // + cjs respecto de eslint-config-next: aquí existe postcss.config.cjs.
        files: ['**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}'],
        plugins: {
            react,
            'react-hooks': reactHooks,
            import: importPlugin,
            'jsx-a11y': jsxA11y,
            '@next/next': nextPlugin,
        },
        languageOptions: {
            parserOptions: { sourceType: 'module', ecmaFeatures: { jsx: true } },
            globals: { ...globals.browser, ...globals.node },
        },
        settings: { react: { version: 'detect' } },
        rules: {
            ...react.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,
            ...nextPlugin.configs.recommended.rules,
            ...nextPlugin.configs['core-web-vitals'].rules,
            'import/no-anonymous-default-export': 'warn',
            'react/no-unknown-property': 'off',
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
            'jsx-a11y/alt-text': ['warn', { elements: ['img'], img: ['Image'] }],
            'jsx-a11y/aria-props': 'warn',
            'jsx-a11y/aria-proptypes': 'warn',
            'jsx-a11y/aria-unsupported-elements': 'warn',
            'jsx-a11y/role-has-required-aria-props': 'warn',
            'jsx-a11y/role-supports-aria-props': 'warn',
            'react/jsx-no-target-blank': 'off',
            // Pide una carpeta pages/ de Next; aquí no existe.
            '@next/next/no-html-link-for-pages': 'off',
        },
    },

    ...tseslint.configs.recommended,
    {
        rules: {
            '@typescript-eslint/no-unused-expressions': 'warn',
        },
    },

    {
        // Política de deuda heredada de web/ (QA-4 en el ESTADO): todo sigue activo
        // pero como aviso, y `npm run lint` fija --max-warnings en la cifra actual.
        rules: {
            '@typescript-eslint/no-unused-vars': [
                'warn',
                { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
            ],
            '@typescript-eslint/no-explicit-any': 'warn',
            'react-hooks/static-components': 'warn',
            'react-hooks/preserve-manual-memoization': 'warn',
            'react-hooks/set-state-in-effect': 'warn',
        },
    },

    {
        files: ['tests/**/*.ts', 'tests/**/*.tsx', 'vitest.config.ts'],
        rules: { '@typescript-eslint/no-explicit-any': 'off' },
    },

    prettierCompat,
];

export default eslintConfig;
