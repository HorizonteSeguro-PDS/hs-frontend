// import { useCrises } from './hooks';
import { Navbar} from '@/shared/components/navbar';
export default function Crises() {
    // const { data: crises } = useCrises();
  
    return (
        <div className="h-screen w-screen bg-black">
            <Navbar />
            <span>CRISES</span>
        </div>
    );
};
