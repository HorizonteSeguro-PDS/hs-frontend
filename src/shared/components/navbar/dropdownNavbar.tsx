import { ChevronDown, CircleUserRound } from 'lucide-preact';
import type { User } from '@/shared/contexts/useAuthContext';
import { useLogin } from '@/features/auth/hooks';

interface DropdownNavbarProps {
    user: User | undefined | null;
}

export default function DropdownNavbar({ user }: DropdownNavbarProps) {

    const { mutate:login, isPending: isLoginPending } = useLogin();

    return (
        <div className="dropdown dropdown-end dropdown-bottom relative select-none py-2">
            <div tabIndex={0} role="button" className="flex items-center gap-4">
                <CircleUserRound size={40} />
                <span>{user?.name || 'Visitante'}</span>
                <ChevronDown size={20} className=""/>
            </div>
            <ul className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm" tabIndex={0}>
                {user ? (
                    <>
                        <li><a className="btn btn-ghost justify-start">Perfil</a></li>
                        <li><a className="btn btn-ghost justify-start">Sair</a></li>
                    </>
                ):(
                    <>
                        <li>
                            <a className="btn btn-ghost justify-start"
                                onClick={() =>
                                    login({ 
                                        email: 'gestor.crise@horizonteseguro.app',
                                        password: 'admin1234'
                                    })}
                            >
                                {isLoginPending ? 'Entrando...' : 'Entrar'}
                            </a>
                        </li>
                        <li><a className="btn btn-ghost justify-start">Registrar</a></li>
                    </>
                )}
            </ul>
        </div>
    );
};