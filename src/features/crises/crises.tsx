import { useCrises } from './hooks';
import { Navbar} from '@/shared/components/navbar/navbar';
export default function Crises() {
    const { data: crises } = useCrises();
  
    return (
        <div className="h-screen w-screen">
            <Navbar />
            <span>CRISES</span>
        </div>
    );
};
