import { ChevronDown, CircleUserRound } from 'lucide-preact';
import { Link } from 'wouter-preact';
import type { User } from '@/shared/contexts/useAuthContext';
import { useAuth } from '@/shared/contexts/useAuthContext';

interface DropdownNavbarProps {
    user: User | undefined | null;
}

export default function DropdownNavbar({ user }: DropdownNavbarProps) {
    const { logout } = useAuth();

    function handleLogout() {
        logout();
        window.location.reload();
    }

    return (
        <div className="dropdown dropdown-end dropdown-bottom relative select-none py-2">
            <div tabIndex={0} role="button" className="flex items-center gap-4">
                <CircleUserRound size={24} />
                <span>{user?.name || 'Visitante'}</span>
                <ChevronDown size={16} className=""/>
            </div>
            <ul className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm" tabIndex={0}>
                {user ? (
                    <>
                        <li><a className="btn btn-ghost justify-start">Perfil</a></li>
                        {user?.role?.includes('crisis_manager') && (
                            <li>
                                <Link href="/solicitacoes" className="btn btn-ghost justify-start">
                                    Solicitações
                                </Link>
                            </li>
                        )}
                        <li><a className="btn btn-ghost justify-start" onClick={handleLogout}>Sair</a></li>
                    </>
                ):(
                    <>
                        <li>
                            <Link href="/login" className="btn btn-ghost justify-start">
                                Entrar
                            </Link>
                        </li>
                        <li>
                            <Link href="/register" className="btn btn-ghost justify-start">
                                Registrar
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </div>
    );
};