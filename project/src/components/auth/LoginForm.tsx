import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useFormValidation, validationRules } from '../../hooks/useFormValidation';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export default function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { errors, validateForm, validateFieldOnChange } = useFormValidation({
    email: validationRules.email,
    password: validationRules.password,
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateFieldOnChange(field, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(formData)) {
      return;
    }

    setLoading(true);
    setError('');

    const { error } = await signIn(formData.email, formData.password);
    
    if (error) {
      setError(error.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="binance-card p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Bem-vindo de volta</h2>
        <p className="text-gray-400">Entre na sua conta T3 Core Bank</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
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
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              className={`binance-input w-full pl-10 pr-10 ${errors.password ? 'border-[#F6465D]' : ''}`}
              placeholder="Sua senha"
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
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-400">
          Não tem uma conta?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-[#FCD535] hover:underline"
          >
            Cadastre-se
          </button>
        </p>
      </div>
    </div>
  );
}
