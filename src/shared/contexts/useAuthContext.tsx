import { createContext } from 'preact';
import type { ComponentChildren } from 'preact';
import { useContext } from 'preact/hooks';
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
    login: (currentUser: User) => void;
    logout: () => void;
}

const STORAGE_KEY = 'hs_auth_user';

function loadFromStorage(): User | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as User) : null;
    } catch {
        return null;
    }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ComponentChildren }) => {
    const stored = loadFromStorage();
    const user = signal<User | null>(stored);
    const loading = signal(false);
    const isAuthenticated = signal(stored !== null);

    const hasRole = (role: string) => {
        return user.value?.role.includes(role) || false;
    };

    const login = (currentUser: User) => {
        user.value = currentUser;
        isAuthenticated.value = true;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
    };

    const logout = () => {
        user.value = null;
        isAuthenticated.value = false;
        localStorage.removeItem(STORAGE_KEY);
    };

    return (
        <AuthContext.Provider value={{ user, loading, isAuthenticated, hasRole, login, logout }}>
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
