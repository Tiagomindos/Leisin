import { useState, useCallback } from 'react';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

interface ValidationRules {
  [key: string]: ValidationRule;
}

interface FormData {
  [key: string]: any;
}

export const useFormValidation = (rules: ValidationRules) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateField = useCallback((name: string, value: any): string | null => {
    const rule = rules[name];
    if (!rule) return null;

    // Required validation
    if (rule.required && (!value || value.toString().trim() === '')) {
      return 'Este campo é obrigatório';
    }

    // Skip other validations if value is empty and not required
    if (!value || value.toString().trim() === '') {
      return null;
    }

    // Min length validation
    if (rule.minLength && value.toString().length < rule.minLength) {
      return `Mínimo de ${rule.minLength} caracteres`;
    }

    // Max length validation
    if (rule.maxLength && value.toString().length > rule.maxLength) {
      return `Máximo de ${rule.maxLength} caracteres`;
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value.toString())) {
      return 'Formato inválido';
    }

    // Custom validation
    if (rule.custom) {
      return rule.custom(value);
    }

    return null;
  }, [rules]);

  const validateForm = useCallback((data: FormData): boolean => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    Object.keys(rules).forEach(field => {
      const error = validateField(field, data[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [rules, validateField]);

  const validateFieldOnChange = useCallback((name: string, value: any) => {
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error || ''
    }));
  }, [validateField]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: ''
    }));
  }, []);

  return {
    errors,
    validateForm,
    validateFieldOnChange,
    clearErrors,
    clearFieldError,
  };
};

// Common validation rules
export const validationRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    required: true,
    minLength: 6,
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  phone: {
    pattern: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
  },
  cpf: {
    pattern: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
    custom: (value: string) => {
      // Basic CPF validation
      const numbers = value.replace(/\D/g, '');
      if (numbers.length !== 11) return 'CPF deve ter 11 dígitos';
      
      // Check for invalid patterns
      if (/^(\d)\1{10}$/.test(numbers)) return 'CPF inválido';
      
      return null;
    },
  },
  cnpj: {
    pattern: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
    custom: (value: string) => {
      const numbers = value.replace(/\D/g, '');
      if (numbers.length !== 14) return 'CNPJ deve ter 14 dígitos';
      
      if (/^(\d)\1{13}$/.test(numbers)) return 'CNPJ inválido';
      
      return null;
    },
  },
  price: {
    required: true,
    custom: (value: number) => {
      if (value <= 0) return 'Preço deve ser maior que zero';
      if (value > 1000000) return 'Preço muito alto';
      return null;
    },
  },
  amount: {
    required: true,
    custom: (value: number) => {
      if (value <= 0) return 'Quantidade deve ser maior que zero';
      if (value > 1000000) return 'Quantidade muito alta';
      return null;
    },
  },
};
