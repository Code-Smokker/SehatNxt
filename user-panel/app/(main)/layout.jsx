import Navbar from "@/components/shared/Navbar";

export default function MainLayout({ children }) {
    // TODO: Fetch tokenData or user session here if needed for Navbar
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">


            <Navbar />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {children}
            </main>
        </div>
    );
}
