import Link from "next/link";
import { Construction } from "lucide-react";

export default function ComingSoonPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 max-w-md w-full animate-slideUp">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Construction size={40} className="text-blue-600" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Coming Soon</h1>
                <p className="text-slate-500 mb-8">
                    We are working hard to bring you this feature. Stay tuned for updates!
                </p>
                <Link
                    href="/home"
                    className="block w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
                >
                    Go Back Home
                </Link>
            </div>
        </div>
    );
}
