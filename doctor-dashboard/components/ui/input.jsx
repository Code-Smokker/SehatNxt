import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type = "text", ...props }, ref) => {
    return (
        <input
            type={type}
            ref={ref}
            className={cn(
                "flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-slate-900 border-slate-300",
                "placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                "disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        />
    );
});

Input.displayName = "Input";

export { Input };
