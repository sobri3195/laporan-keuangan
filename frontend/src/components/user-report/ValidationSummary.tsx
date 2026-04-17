import { ValidationErrors } from './types';

export function ValidationSummary({ errors }: { errors: ValidationErrors }) {
  const entries = Object.entries(errors).filter(([, message]) => Boolean(message));
  if (entries.length < 2) return null;

  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      <p className="font-semibold">Ada beberapa data yang perlu diperbaiki:</p>
      <ul className="list-disc pl-5">
        {entries.map(([key, message]) => <li key={key}>{message}</li>)}
      </ul>
    </div>
  );
}
