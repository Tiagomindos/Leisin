# AI Development Rules for T3 Core Bank

This document outlines the rules and conventions for AI-driven development on this project. Adhering to these guidelines ensures consistency, maintainability, and quality.

## 🤖 Core Principles

- **Simplicity First**: Prioritize simple, elegant solutions. Avoid over-engineering.
- **Consistency is Key**: Follow the existing patterns, coding style, and file structure.
- **One Component, One File**: Every React component, no matter how small, gets its own file.
- **Mobile-First & Responsive**: All components and layouts must be fully responsive.

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript, built using Vite.
- **Styling**: Tailwind CSS for all styling. A custom design system inspired by Binance is defined in `src/index.css`.
- **State Management**: React Context API for global state (`AppContext`, `AuthContext`) and React Hooks (`useState`, `useReducer`) for local state.
- **Backend & Database**: Supabase is used for authentication, database, and other backend services.
- **Icons**: `lucide-react` is the exclusive icon library.
- **Forms**: Custom hooks (`useFormValidation`) are used for form handling and validation.
- **Linting**: ESLint with TypeScript plugins to enforce code quality.
- **File Structure**:
    - `src/pages/`: Top-level page components.
    - `src/components/`: Reusable UI components.
    - `src/contexts/`: Global state management via React Context.
    - `src/hooks/`: Custom React hooks for shared logic.
    - `src/lib/`: Third-party library configurations (e.g., Supabase client).

## 📜 Library & Pattern Usage Rules

### Styling (Tailwind CSS)
- **Rule**: **ONLY** use Tailwind CSS utility classes for styling.
- **Do not** add new `.css` files or use inline `style` attributes.
- **Utilize** the custom `binance-*` and `price-*` classes defined in `src/index.css` for consistent branding.
- **Example**: For a primary button, use `className="binance-btn-primary"`.

### Icons (Lucide React)
- **Rule**: **ALL** icons must be imported from `lucide-react`.
- **Do not** install other icon libraries or use inline SVGs.
- **Example**: `import { Home, Wallet } from 'lucide-react';`

### State Management (Context API & Hooks)
- **Rule**: Use the existing context providers for global state.
    - `useAuth()` for user session and authentication methods.
    - `useApp()` for shared application data like properties, market pairs, and user portfolio.
- **Rule**: Use `useState` for simple, local component state.
- **Do not** introduce libraries like Redux, Zustand, or MobX.

### Backend (Supabase)
- **Rule**: All backend communication **MUST** use the `supabase` client from `src/lib/supabase.ts`.
- **Rule**: Encapsulate data fetching logic within custom hooks in the `src/hooks/` directory (e.g., `useUserProfile`, `useProperties`).
- **Do not** make direct API calls from components.

### Components
- **Rule**: Create small, focused, reusable components in `src/components/`.
- **Do not** install external UI libraries like Shadcn/UI, Material-UI, or Ant Design. The project has its own established design system.

### Forms
- **Rule**: Use the `useFormValidation` hook for all form validation logic.
- **Rule**: Add new reusable validation rules to `validationRules` in `src/hooks/useFormValidation.ts`.
- **Do not** install libraries like Formik or React Hook Form.

### Routing
- **Rule**: The application uses a state-based navigation system controlled in `App.tsx`.
- **Do not** install or use `react-router-dom` or any other routing library. Navigation is handled by changing the `activeTab` state.