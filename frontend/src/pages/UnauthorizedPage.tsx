import { Link } from 'react-router-dom';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-md rounded-xl bg-white p-6 text-center shadow-sm border border-slate-200">
        <p className="text-5xl mb-3">🔒</p>
        <h1 className="text-xl font-bold text-slate-800">Unauthorized</h1>
        <p className="mt-2 text-sm text-slate-600">Anda tidak memiliki hak akses untuk membuka halaman ini.</p>
        <Link to="/dashboard" className="mt-5 inline-block rounded bg-primary px-4 py-2 text-white">
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}
