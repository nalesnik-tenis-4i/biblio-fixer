"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useContext, useRef } from "react";

// Hack to prevent instant unmount when freezing the router context
function FrozenRouter(props: { children: React.ReactNode }) {
    const context = useContext(LayoutRouterContext ?? {});
    const frozen = useRef(context).current;
    return (
        <LayoutRouterContext.Provider value={frozen}>
            {props.children}
        </LayoutRouterContext.Provider>
    );
}

export default function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="w-full"
            >
                {/* 
             We are not freezing router here because simple opacity transition 
             on key change is enough for "between pages" feel for this app. 
             If we wanted full exit animations of previous page while new one loads, 
             we would need the FrozenRouter hack. 
             For simplicity and performance, just AnimatePresence with key is good.
           */}
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
