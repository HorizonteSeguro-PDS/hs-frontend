import { toastState } from '@/shared/services/toast';

export function ToastContainer(){
    const { message, type, visible } = toastState.value;

    if (!visible) return null;

    return (
        <div className={`toast toast-end toast-bottom alert-${type}`}>
            {message}
        </div>
    );
}