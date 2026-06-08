import { signal } from '@preact/signals';

type ToastType = 'success' | 'error' | 'info';

interface ToastState {
    message: string;
    type: ToastType;
    visible: boolean;
}

export const toastState = signal<ToastState>({
    message: '',
    type: 'success',
    visible: false,
});

export const showToast = (message: string, type: ToastType, duration: number = 5000) => {
    toastState.value = { message, type, visible: true };
    
    setTimeout(() => {
        toastState.value = { ...toastState.value, visible: false };
    }, duration);
};