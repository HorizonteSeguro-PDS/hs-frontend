import { LogOut } from 'lucide-preact';

export interface Person {
  id: string;
  name: string;
  age: number;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

interface PersonCardProps {
  person: Person;
  onRegisterExit: (id: string) => void;
}

export const PersonCard = ({ person, onRegisterExit }: PersonCardProps) => {
  return (
    <div className="bg-white border border-black/10 rounded-[14px] flex flex-col w-full">
      <div className="flex flex-col items-center pt-4 px-4">
        <div className="bg-[#ececf0] rounded-full size-12 flex items-center justify-center mb-2">
          <span className="text-[#0a0a0a] text-sm font-normal">
            {getInitials(person.name)}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-[#0a0a0a] text-sm font-medium leading-5 text-center">
            {person.name}
          </p>
          <p className="text-[#717182] text-xs leading-4 pt-0.5 text-center">
            {person.age} anos
          </p>
        </div>
      </div>
      <div className="flex items-center px-4 pb-4 mt-3">
        <button
          onClick={() => onRegisterExit(person.id)}
          className="w-full flex items-center justify-center gap-1.5 border border-black/10 rounded-lg h-8 text-xs font-medium text-[#0a0a0a] hover:bg-gray-50 transition-colors cursor-pointer"
          style={{ color: '#A60000' }}
        >
          <LogOut size={14} />
          Registrar Saída
        </button>
      </div>
    </div>
  );
};
