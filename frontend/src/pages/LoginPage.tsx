import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginSchema } from '../schemas/authSchema';
import { getDemoPassword, login } from '../features/auth/api';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { users } from '../mocks/seedData';

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
    <div className="grid min-h-screen place-items-center bg-gradient-to-b from-blue-50 to-slate-100 px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow sm:p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <img src="/logo-simon.svg" alt="Logo SIMON Keuangan RS" className="mb-3 h-16 w-16 rounded-lg bg-slate-50 p-2" />
          <h1 className="text-xl font-bold">Puskesau SIMON Keuangan RS</h1>
          <p className="text-sm text-slate-500">Akses sistem monitoring laporan keuangan rumah sakit.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <input {...register('email')} placeholder="Email" className="w-full rounded-lg border border-slate-300 p-2" />
          {errors.email && <p className="text-xs text-rose-600">{errors.email.message}</p>}

          <input {...register('password')} placeholder="Password" type="password" className="w-full rounded-lg border border-slate-300 p-2" />
          {errors.password && <p className="text-xs text-rose-600">{errors.password.message}</p>}

          <button disabled={isSubmitting} className="mt-2 w-full rounded-lg bg-primary p-2 font-semibold text-white disabled:opacity-70">
            {isSubmitting ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
          <p className="font-semibold text-slate-700">Akun demo tersedia:</p>
          <ul className="mt-1 list-inside list-disc space-y-0.5">
            {users.map((user) => (
              <li key={user.id}>
                {user.email} ({user.role})
              </li>
            ))}
          </ul>
          <p className="mt-2">
            Password demo: <span className="font-semibold">{getDemoPassword()}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
