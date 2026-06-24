export default function AppLogo() {
    return (
        <>
            {/* Contenedor del Logo */}
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden">
                <img 
                    src="images/logo-softfood.png" 
                    alt="SoftFood Logo" 
                    className="size-full object-contain"
                />
            </div>
            
            {/* Texto de la marca - AQUÍ AGREGAMOS LA CLASE PARA OCULTAR */}
            <div className="ml-1 grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="mb-0.5 truncate font-black text-base text-slate-900 tracking-tighter">
                    SoftFood
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                    Panel de Control
                </span>
            </div>
        </>
    );
}