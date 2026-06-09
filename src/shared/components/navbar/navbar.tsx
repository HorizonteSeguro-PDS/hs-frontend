import NavbarLogo from '@/assets/navbar-logo.svg';
import DropdownNavbar from '@/shared/components/navbar/dropdownNavbar';

import { useAuth } from '@/shared/contexts/useAuthContext';
export const Navbar = () => {
    const { user } = useAuth();
    return (
        <div className="navbar flex h-20 w-full items-center justify-between px-[10%] bg-[#111111]">
            <img src={NavbarLogo} alt="Logo horizonte seguro" className=""/>
            <DropdownNavbar user={user.value} />
        </div>
    )
}