import Navbar from "./_components/navbar";

const ProtectedLayout = ({children}:{children:React.ReactNode}) => {
    return ( 
        <div className=" py-4 h-full w-full flex flex-col gap-y-10 items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
            <Navbar />
            <div className="overflow-y-auto">
            {children}
            </div>
            
        </div>
     );
}
 
export default ProtectedLayout;