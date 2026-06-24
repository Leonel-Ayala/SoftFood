export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 font-sans">
            <div className="w-full max-w-md bg-white px-8 py-10 rounded-3xl shadow-2xl border border-slate-100">
                {children}
            </div>
        </div>
    );
}