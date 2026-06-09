import NavbarLogo from '@/assets/navbar-logo.svg';
import DropdownNavbar from '@/shared/components/navbar/dropdownNavbar';
import { ConnectionBadge } from '@/shared/components/ConnectionBadge';
import { useAuth } from '@/shared/contexts/useAuthContext';

export const Navbar = () => {
    const { user } = useAuth();
    return (
        <div className="navbar flex h-14 w-full items-center justify-center bg-[#111111]">
            <div className="flex w-full max-w-[1280px] items-center justify-between px-4">
                <img src={NavbarLogo} alt="Logo horizonte seguro" className="h-10 w-auto"/>
                <div className="flex items-center gap-3">
                    <ConnectionBadge />
                    <DropdownNavbar user={user.value} />
                </div>
            </div>
        </div>
    )
}
