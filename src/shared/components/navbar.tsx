import NavbarLogo from '@/assets/navbar-logo.svg';
import { ChevronDown, CircleUserRound } from 'lucide-preact';
//TODO CRIAR UM CONTEXTO PARA A IMAGEM DO USUÁRIO E O NOME DO USUÁRIO, PARA EXIBIR NA NAVBAR
export const Navbar = () => {
    return (
        <div className="navbar flex h-14 w-full items-center justify-center" style={{ backgroundColor:'#111111'}}>
            <div className="flex w-full max-w-[1280px] items-center justify-between px-4">
                <img src={NavbarLogo} alt="Logo horizonte seguro" className="h-10 w-auto"/>
                <div className="flex items-center gap-2 text-sm text-white">
                    <CircleUserRound size={24} />
                    <span>Visitante</span>
                    <ChevronDown size={16} />
                </div>
            </div>
        </div>
    )
}