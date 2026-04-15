import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginSchema } from '../schemas/authSchema';
import { login } from '../features/auth/api';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginSchema>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginSchema) => {
    const result = await login(data);
    setSession(result.token, result.user);
    navigate('/dashboard');
  };

  return (
    <div className="grid min-h-screen place-items-center bg-slate-100 px-4 py-8">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <img src="/logo-simon.svg" alt="Logo SIMON Keuangan RS" className="mb-3 h-16 w-16 rounded-lg bg-slate-50 p-2" />
          <h1 className="text-xl font-bold">Login SIMON Keuangan RS</h1>
          <p className="text-sm text-slate-500">Akses sistem monitoring laporan keuangan rumah sakit.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <input {...register('email')} placeholder="Email" className="w-full rounded border p-2" />
          {errors.email && <p className="text-xs text-rose-600">{errors.email.message}</p>}

          <input {...register('password')} placeholder="Password" type="password" className="w-full rounded border p-2" />
          {errors.password && <p className="text-xs text-rose-600">{errors.password.message}</p>}

          <button disabled={isSubmitting} className="mt-2 w-full rounded bg-primary p-2 text-white disabled:opacity-70">
            {isSubmitting ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-500">Akses login tersedia di bagian bawah form agar mudah ditemukan di mobile.</p>
      </div>
    </div>
  );
}
