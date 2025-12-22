"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { useTokenSystem } from "@/hooks/useTokenSystem";

const NotificationsPage = () => {
    const router = useRouter();
    const {
        userToken,
        currentToken,
        totalTokens = 15,
    } = useTokenSystem();

    const tokens = Array.from({ length: totalTokens }, (_, i) => i + 1);

    const getStatus = (token) => {
        if (token < currentToken) return "completed";
        if (token === currentToken) return "inProgress";
        if (token === userToken) return "yourTurn";
        return "waiting";
    };

    return (
        <div className="min-h-screen bg-white font-sans">

            {/* Header */}
            <div className="sticky top-0 bg-white z-20 px-4 py-4 flex items-center gap-3 border-b">
                <button
                    onClick={() => router.back()}
                    className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center"
                >
                    <ArrowLeft size={18} />
                </button>
                <div className="flex-1">
                    <h1 className="text-lg font-bold">Live Token Tracking</h1>
                </div>
                <span className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                    ● LIVE
                </span>
            </div>

            {/* Timeline */}
            <div className="px-4 py-6 max-w-md mx-auto">
                <div className="relative pl-10">

                    {/* Vertical Line */}
                    <div className="absolute left-4 top-0 bottom-0 w-[3px] bg-gradient-to-b from-green-400 to-slate-200 rounded-full" />

                    {tokens.map((token) => {
                        const status = getStatus(token);

                        return (
                            <div key={token} className="relative mb-6 flex items-start gap-4">

                                {/* Timeline Dot */}
                                <div
                                    className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm z-10
                    ${status === "completed" && "bg-slate-300 text-white"}
                    ${status === "inProgress" && "bg-green-500 text-white animate-pulse shadow-lg shadow-green-300"}
                    ${status === "yourTurn" && "bg-blue-500 text-white shadow-lg shadow-blue-300"}
                    ${status === "waiting" && "bg-slate-100 text-slate-600"}
                  `}
                                >
                                    {status === "completed" ? "✓" : token}
                                </div>

                                {/* Card */}
                                <div
                                    className={`
                    flex-1 rounded-2xl border p-4
                    ${status === "completed" && "bg-slate-50 text-slate-500"}
                    ${status === "inProgress" && "bg-green-50 border-green-300"}
                    ${status === "yourTurn" && "bg-blue-50 border-blue-300"}
                    ${status === "waiting" && "bg-white border-slate-200"}
                  `}
                                >
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold text-slate-800">
                                            Token #{token}
                                        </h3>

                                        {status === "completed" && (
                                            <span className="text-xs bg-slate-400 text-white px-2 py-1 rounded-full">
                                                Completed
                                            </span>
                                        )}

                                        {status === "inProgress" && (
                                            <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                                                In Progress
                                            </span>
                                        )}

                                        {status === "yourTurn" && (
                                            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                                                Your Turn
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-sm mt-1 text-slate-500">
                                        {status === "completed" && "Consultation completed"}
                                        {status === "inProgress" && "Currently consulting"}
                                        {status === "yourTurn" && "Please be ready!"}
                                        {status === "waiting" && "Waiting in queue"}
                                    </p>

                                    {(status === "waiting" || status === "yourTurn") && (
                                        <div className="flex items-center gap-1 text-xs text-slate-400 mt-2">
                                            <Clock size={12} />
                                            Est. wait time varies
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Nav Placeholder */}
            <div className="fixed bottom-0 inset-x-0 bg-white border-t h-16 flex justify-around items-center text-xs text-slate-500">
                <span className="text-blue-600 font-bold">Home</span>
                <span>Appointments</span>
                <span>Chat</span>
                <span>Profile</span>
            </div>
        </div>
    );
};

export default NotificationsPage;
