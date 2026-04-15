import { LoginSchema } from '../../schemas/authSchema';
import { users } from '../../mocks/seedData';

export async function login(payload: LoginSchema) {
  const user = users.find((u) => u.email === payload.email);
  if (!user) {
    throw new Error('Invalid credentials');
  }
  return { token: `mock-${user.id}`, user };
}
