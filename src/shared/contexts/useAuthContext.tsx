import { createContext } from 'preact';
import type { ComponentChildren } from 'preact';
import { useContext} from 'preact/hooks';
import { signal, Signal } from '@preact/signals';

export interface User {
    id: string;
    name: string;
    email: string;
    role: string[];
    token: string;
}

interface AuthContextType {
    user: Signal<User | null>;
    loading: Signal<boolean>;
    isAuthenticated: Signal<boolean> | boolean;
    hasRole: (role: string) => boolean;
    isCrisisManager: () => boolean;
    canManageShelter: (shelterId: string) => boolean;
    login: (currentUser: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getInitialUser = (): User | null => {
    if (typeof window === 'undefined') return null;
    try {
        const savedUser = localStorage.getItem('auth_user');
        return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
        console.error("Erro ao ler usuário do localStorage:", error);
        return null;
    }
};

export const AuthProvider = ({ children }: { children: ComponentChildren }) => {
    const initialUser = getInitialUser();
    const user = signal<User | null>(initialUser);
    const loading = signal(false);
    const isAuthenticated = signal(false);

    const hasRole = (role: string) => {
        return user.value?.role?.includes(role) || false;
    };

    const isCrisisManager = () => hasRole('crisis_manager');

    const canManageShelter = (shelterId: string) =>
        hasRole('crisis_manager') ||
        (hasRole('shelter_manager') && user.value?.id === shelterId);

    const login = (currentUser: User) => {
        user.value = currentUser;
        isAuthenticated.value = true;
        localStorage.setItem('auth_user', JSON.stringify(currentUser));
    };

    const logout = () => {
        user.value = null;
        isAuthenticated.value = false;
        localStorage.removeItem('auth_user');
    };

    return (
        <AuthContext.Provider value={{ user, loading, isAuthenticated, hasRole, isCrisisManager, canManageShelter, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};