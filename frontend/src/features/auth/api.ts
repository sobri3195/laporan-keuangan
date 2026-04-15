import { LoginSchema } from '../../schemas/authSchema';
import { users } from '../../mocks/seedData';

const DEMO_PASSWORD = 'simon123';

export async function login(payload: LoginSchema) {
  const user = users.find((u) => u.email === payload.email);
  if (!user) {
    throw new Error('Invalid credentials');
  }
  if (payload.password !== DEMO_PASSWORD) {
    throw new Error('Invalid credentials');
  }
  return { token: `mock-${user.id}`, user };
}

export function getDemoPassword() {
  return DEMO_PASSWORD;
}
