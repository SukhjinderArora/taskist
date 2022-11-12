import { User } from './user.model';

export class Auth {
  user: User;
  accessToken: string;
  expiresAt: string;
}
