import {  loginUser } from '@/features/auth/api';

import { useMutation } from '@tanstack/react-query';

import { showToast } from '@/shared/services/toast';
import { useAuth } from '@/shared/contexts/useAuthContext';
import type { User } from '@/shared/contexts/useAuthContext';

export const useLogin = () => {
    const { login } = useAuth();

    return useMutation<User, unknown, { email: string; password: string }>({
        mutationFn: async (credentials) => {
            const userData = await loginUser(credentials.email, credentials.password);

            const currentUser: User = {
                id: userData.user.id,
                name: userData.user.name,
                email: userData.user.email,
                role: userData.user.roles ?? userData.user.role ?? [],
                token: userData.access_token,
            };

            return currentUser;
        },
        onSuccess: (currentUser) => {
            login(currentUser);
            showToast('Login successful!', 'success');
        },
        onError: () => {
            showToast('Email or password is incorrect!', 'error');
        },
    });
};