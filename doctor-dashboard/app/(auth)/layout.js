export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {children}
            </div>
        </div>
    );
}
