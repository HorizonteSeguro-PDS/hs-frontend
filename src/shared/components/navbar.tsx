import NavbarLogo from '@/assets/navbar-logo.svg';
import { ChevronDown, CircleUserRound } from 'lucide-preact';
//TODO CRIAR UM CONTEXTO PARA A IMAGEM DO USUÁRIO E O NOME DO USUÁRIO, PARA EXIBIR NA NAVBAR
export const Navbar = () => {
    return (
        <div className="navbar flex h-20 w-full items-center justify-between px-[10%]" style={{ backgroundColor:'#111111'}}>
            <img src={NavbarLogo} alt="Logo horizonte seguro" className=""/>
            <div className="flex items-center gap-4">
                <CircleUserRound size={40} />
                <span>Visitante</span>
                <ChevronDown size={20} />
            </div>
        </div>
    )
}