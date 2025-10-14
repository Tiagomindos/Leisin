import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useFormValidation, validationRules } from '../../hooks/useFormValidation';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { errors, validateForm, validateFieldOnChange } = useFormValidation({
    fullName: validationRules.name,
    email: validationRules.email,
    password: validationRules.password,
    confirmPassword: {
      required: true,
      custom: (value: string) => {
        if (value !== formData.password) {
          return 'As senhas não coincidem';
        }
        return null;
      },
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    validateFieldOnChange(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(formData)) {
      return;
    }

    setLoading(true);
    setError('');

    const { error } = await signUp(formData.email, formData.password, formData.fullName);
    
    if (error) {
      setError(error.message);
    } else {
      setError('');
      // Show success message or redirect
    }
    
    setLoading(false);
  };

  return (
    <div className="binance-card p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Criar conta</h2>
        <p className="text-gray-400">Junte-se à T3 Core Bank</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Nome completo</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`binance-input w-full pl-10 ${errors.fullName ? 'border-[#F6465D]' : ''}`}
              placeholder="Seu nome completo"
            />
          </div>
          {errors.fullName && (
            <p className="text-[#F6465D] text-xs mt-1">{errors.fullName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`binance-input w-full pl-10 ${errors.email ? 'border-[#F6465D]' : ''}`}
              placeholder="seu@email.com"
            />
          </div>
          {errors.email && (
            <p className="text-[#F6465D] text-xs mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Senha</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`binance-input w-full pl-10 pr-10 ${errors.password ? 'border-[#F6465D]' : ''}`}
              placeholder="Mínimo 6 caracteres"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[#F6465D] text-xs mt-1">{errors.password}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Confirmar senha</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`binance-input w-full pl-10 pr-10 ${errors.confirmPassword ? 'border-[#F6465D]' : ''}`}
              placeholder="Confirme sua senha"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-[#F6465D] text-xs mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        {error && (
          <div className="p-3 bg-[#F6465D]/10 border border-[#F6465D]/20 rounded text-[#F6465D] text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full binance-btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Criando conta...' : 'Criar conta'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-400">
          Já tem uma conta?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-[#FCD535] hover:underline"
          >
            Entre aqui
          </button>
        </p>
      </div>
    </div>
  );
}
