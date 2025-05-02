import React from "react";
import { Link, usePage } from "@inertiajs/react";
import BottomNav from "../components/Navigation/BottomNav";
import { useTranslation } from "../hooks/useTranslation";

const Layout = ({ children, showNav = true }) => {
    const { t } = useTranslation();
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header can go here if needed */}
            
            {/* Main content */}
            <main className="pb-20">
                {children}
            </main>
            
            {/* Bottom Navigation */}
            {showNav && <BottomNav />}
        </div>
    );
};

export default Layout;