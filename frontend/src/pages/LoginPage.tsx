import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginSchema } from '../schemas/authSchema';
import { login } from '../features/auth/api';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginSchema>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginSchema) => {
    const result = await login(data);
    setSession(result.token, result.user);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen grid place-items-center bg-slate-100">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md rounded-xl bg-white p-6 space-y-3">
        <h1 className="text-xl font-bold">Login SIMON Keuangan RS</h1>
        <input {...register('email')} placeholder="Email" className="w-full rounded border p-2" />
        {errors.email && <p className="text-xs text-rose-600">{errors.email.message}</p>}
        <input {...register('password')} placeholder="Password" type="password" className="w-full rounded border p-2" />
        {errors.password && <p className="text-xs text-rose-600">{errors.password.message}</p>}
        <button className="w-full rounded bg-primary p-2 text-white">Masuk</button>
      </form>
    </div>
  );
}
