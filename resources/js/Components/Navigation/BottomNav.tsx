import React from "react";
import { Link, usePage } from "@inertiajs/react";
import { Home, Heart, Map, User } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";

const BottomNav = () => {
    const { t } = useTranslation();
    const { url } = usePage();
    
    const isActive = (path) => url.startsWith(path);
    
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg flex justify-around py-3 border-t">
            <Link
                href={route('home')}
                className={`flex flex-col items-center font-medium ${
                    isActive('/home') ? "text-green-500" : "text-gray-800"
                }`}
            >
                <Home size={20} />
                <span className="text-xs mt-1">{t.navHome}</span>
            </Link>
            <Link
                href={route('screenings.index')}
                className={`flex flex-col items-center font-medium ${
                    isActive('/screenings') ? "text-green-500" : "text-gray-800"
                }`}
            >
                <Heart size={20} />
                <span className="text-xs mt-1">{t.navScreening}</span>
            </Link>
            <Link
                href={route('info')}
                className={`flex flex-col items-center font-medium ${
                    isActive('/info') ? "text-green-500" : "text-gray-800"
                }`}
            >
                <Map size={20} />
                <span className="text-xs mt-1">{t.navInfo}</span>
            </Link>
            <Link
                href={route('profile')}
                className={`flex flex-col items-center font-medium ${
                    isActive('/profile') ? "text-green-500" : "text-gray-800"
                }`}
            >
                <User size={20} />
                <span className="text-xs mt-1">{t.navProfile}</span>
            </Link>
        </div>
    );
};

export default BottomNav;