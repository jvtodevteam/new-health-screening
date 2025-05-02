import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { 
    Globe, FileText, LogOut, MapPin, 
    ChevronRight, User
} from "lucide-react";
import Layout from "./Layout";
import PartnerApplicationForm from "../components/Profile/PartnerApplicationForm";
import { useTranslation } from "../hooks/useTranslation";

const Profile = ({ auth, appName }) => {
    const { t } = useTranslation();
    const [showPartnerForm, setShowPartnerForm] = useState(false);
    
    // Get the appropriate user data based on login status
    const userData = auth.user ? {
        name: auth.user.name,
        email: auth.user.email,
        profileImage: auth.user.profile_photo_url || "https://cdn-icons-png.flaticon.com/128/17561/17561717.png",
    } : {
        name: appName,
        email: "",
        profileImage: "https://cdn-icons-png.flaticon.com/128/17561/17561717.png",
    };
    
    return (
        <Layout>
            <Head title={t.profile} />
            
            <div className="bg-white p-4 flex items-center shadow-sm">
                <h1 className="text-xl font-bold text-gray-800 flex-1 text-center">
                    {t.profile}
                </h1>
            </div>

            <div className="p-6 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-green-100 overflow-hidden mb-3 relative">
                    <img
                        src={userData.profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                    {auth.user && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                            <CheckCircle size={12} className="text-white" />
                        </div>
                    )}
                </div>
                <h2 className="font-bold text-xl text-gray-800">
                    {userData.name}
                </h2>
                <p className="text-gray-500 mb-6">{userData.email}</p>

                <div className="w-full space-y-4">
                    <button
                        className="w-full bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-xl font-medium flex items-center justify-between mb-6 shadow-md"
                        onClick={() => setShowPartnerForm(true)}
                    >
                        <div className="flex items-center">
                            <div className="bg-white p-2 rounded-full mr-3">
                                <MapPin
                                    size={20}
                                    className="text-green-500"
                                />
                            </div>
                            <div className="text-left">
                                <span className="font-bold">
                                    {t.becomePartnerTitle}
                                </span>
                                <p className="text-xs text-green-100">
                                    {t.registerLocation}
                                </p>
                            </div>
                        </div>
                        <ChevronRight size={20} className="text-white" />
                    </button>

                    {/* Language selector */}
                    <div className="w-full flex justify-between items-center p-4 bg-white rounded-xl shadow-sm mb-4">
                        <div className="flex items-center">
                            <Globe
                                size={20}
                                className="text-gray-500 mr-3"
                            />
                            <span>{t.language}</span>
                        </div>
                        <select 
                            className="bg-gray-100 rounded-md py-2 text-gray-700 border-none"
                            onChange={(e) => {
                                // Handle language change
                                window.location.href = route('settings.update-language', {
                                    language: e.target.value
                                });
                            }}
                        >
                            <option value="en">EN</option>
                            <option value="id">ID</option>
                            <option value="zh">ZH</option>
                        </select>
                    </div>

                    <Link 
                        href={route('terms')}
                        className="w-full flex justify-between items-center p-4 bg-white rounded-xl shadow-sm mb-4"
                    >
                        <div className="flex items-center">
                            <FileText
                                size={20}
                                className="text-gray-500 mr-3"
                            />
                            <span>{t.terms}</span>
                        </div>
                        <ChevronRight size={20} className="text-gray-400" />
                    </Link>

                    <Link 
                        href={route('privacy')}
                        className="w-full flex justify-between items-center p-4 bg-white rounded-xl shadow-sm"
                    >
                        <div className="flex items-center">
                            <FileText
                                size={20}
                                className="text-gray-500 mr-3"
                            />
                            <span>{t.privacy}</span>
                        </div>
                        <ChevronRight size={20} className="text-gray-400" />
                    </Link>

                    {auth.user && (
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="w-full flex justify-between items-center p-4 bg-white rounded-xl shadow-sm text-red-500"
                        >
                            <div className="flex items-center">
                                <LogOut size={20} className="mr-3" />
                                <span>{t.logout}</span>
                            </div>
                            <ChevronRight size={20} className="text-red-300" />
                        </Link>
                    )}
                </div>
            </div>

            {showPartnerForm && (
                <PartnerApplicationForm
                    onClose={() => setShowPartnerForm(false)}
                />
            )}
        </Layout>
    );
};

export default Profile;