export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  password: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
  updatedAt?: string;
  isActive: boolean;
}

// Added 'owner' to represent the site/company owner with full control
export type UserRole = 'super_admin' | 'admin' | 'owner' | 'manager' | 'agent';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface CreateUserData {
  email: string;
  name: string;
  phone?: string;
  password: string;
  role: UserRole;
  avatar?: string;
}
