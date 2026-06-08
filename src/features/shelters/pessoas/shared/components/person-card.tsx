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
    <div className="bg-white border border-black/10 rounded-[14px] flex flex-col w-[317px] shrink-0">
      <div className="flex flex-col items-center pt-6 px-6">
        <div className="bg-[#ececf0] rounded-full size-20 flex items-center justify-center mb-3">
          <span className="text-[#0a0a0a] text-lg font-normal">
            {getInitials(person.name)}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-[#0a0a0a] text-lg font-medium leading-[27px] text-center">
            {person.name}
          </p>
          <p className="text-[#717182] text-sm leading-5 pt-1 text-center">
            {person.age} anos
          </p>
        </div>
      </div>
      <div className="flex items-center px-6 pb-6 mt-6">
        <button
          onClick={() => onRegisterExit(person.id)}
          className="w-full flex items-center justify-center gap-2 border border-black/10 rounded-lg h-9 text-sm font-medium text-[#0a0a0a] hover:bg-gray-50 transition-colors cursor-pointer"
          style={{ color: '#A60000' }}
        >
          <LogOut size={16} />
          Registrar Saída
        </button>
      </div>
    </div>
  );
};
