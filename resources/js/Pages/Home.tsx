import React, { useState, useEffect } from "react";
import { Link, Head } from "@inertiajs/react";
import { 
    MapPin, Calendar, Clock, User, Heart, FileText, 
    Plus, CheckCircle, Thermometer, Wind, Droplets, 
    Footprints, Flashlight, Umbrella, Sunrise, Sunset,Play,FileImage,Maximize2,Home as HomeIcon
} from "lucide-react";
import LanguageSelector  from "../components/LanguageSelector";

import Layout from "./Layout";
import VideoModal from "../components/Modals/VideoModal";
import InfographicModal from "../components/Modals/InfographicModal";
import { useTranslation } from "../hooks/useTranslation";

const Home = ({ screenings, weatherData }) => {
    const { t, locale, setLanguage } = useTranslation();
    const [showVideoPopup, setShowVideoPopup] = useState(false);
    const [showInfographicImagePopup, setShowInfographicImagePopup] = useState(false);
    const [showingRegistrationVideo, setShowingRegistrationVideo] = useState(false);
    
    const pendingScreenings = screenings.filter(
        (item) => item.status === "pending"
    );

    return (
        <Layout>
            <Head title="Home" />

            <div className="bg-white p-6 shadow-sm">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                            <HomeIcon size={20} className="text-white" />
                        </div>
                        <span className="text-green-500 font-medium">{t.kawahIjenTitle}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Language selector */}
                        <LanguageSelector 
                            value={locale} 
                            onChange={setLanguage} 
                        />
                        <div className="bg-gray-100 rounded-full p-2">
                            <User size={20} className="text-gray-500" />
                        </div>
                    </div>
                </div>
            </div>

            
            <div className="px-5 py-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    {t.kawahIjenVerification}
                </h1>

                {/* Health screening card */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h2 className="font-bold text-xl text-gray-800 mb-2">
                        {t.bookHealthCheck}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {t.healthCheckDescription}
                    </p>

                    <Link
                        href={route('screenings.create')}
                        className="block w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                        {t.bookHealthCheckBtn}
                    </Link>
                </div>
            </div>
            
            {/* Recent submissions carousel */}
            <div className="px-5">
                <h2 className="font-bold text-lg text-gray-800 mb-3 flex items-center">
                    {t.recentSubmissions}
                    {pendingScreenings.length > 0 && (
                        <span className="bg-yellow-100 text-yellow-600 text-xs font-medium px-2 py-0.5 rounded-full ml-2">
                            {pendingScreenings.length} {t.pending}
                        </span>
                    )}
                </h2>

                <div className="relative">
                    {screenings.length > 0 ? (
                        <div className="flex overflow-x-auto pb-4 -mx-2 snap-x hide-scrollbar">
                            {screenings.map((screening) => (
                                <div
                                    key={screening.id}
                                    className="bg-white rounded-xl shadow-sm p-4 mb-2 border border-gray-100 min-w-[85%] mx-2 snap-center"
                                >
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-500 mr-3">
                                                <MapPin size={18} />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-800">
                                                    {screening.participants[0]?.name || "Unnamed"}
                                                </h3>
                                                <p className="text-xs text-gray-500">
                                                    {screening.date} • {screening.participants.length} participants
                                                </p>
                                            </div>
                                        </div>
                                        <div
                                            className={`px-2 py-1 rounded-full ${
                                                screening.status === "pending"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-green-100 text-green-700"
                                            } text-xs font-medium flex items-center`}
                                        >
                                            {screening.status === "pending" ? (
                                                <>
                                                    <Clock size={12} className="mr-1" />
                                                    {t.pending}
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle size={12} className="mr-1" />
                                                    {t.complete}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-500 border-t border-gray-100 pt-3 mt-2">
                                        <div>
                                            <p className="flex items-center">
                                                <Calendar size={14} className="mr-1" />{" "}
                                                {screening.date}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="flex items-center">
                                                <Clock size={14} className="mr-1" />{" "}
                                                {screening.time}
                                            </p>
                                        </div>
                                    </div>
                                    <Link
                                        href={route('screenings.show', screening.reference_id)}
                                        className="w-full flex justify-center items-center py-2 text-green-500 text-sm font-medium mt-2 hover:bg-green-50 rounded-lg transition-colors"
                                    >
                                        {t.viewDetails}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm p-6 mb-4 border border-gray-100 text-center">
                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                                <FileText size={24} className="text-green-500" />
                            </div>
                            <h3 className="font-medium text-gray-800 mb-1">
                                {t.noScreeningsYet}
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">
                                {t.completeHealthScreening}
                            </p>
                            <Link
                                href={route('screenings.create')}
                                className="text-green-500 text-sm font-medium"
                            >
                                {t.startHealthCheck} →
                            </Link>
                        </div>
                    )}
                </div>
                
                {/* Dynamic Weather Forecast Card */}
                <h2 className="font-bold text-lg text-gray-800 mt-6 mb-3">
                    {t.weatherConditions}
                </h2>
                <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4 border border-gray-100">
                    <div className="p-5">
                        {/* Date selector */}
                        <div className="flex overflow-x-auto hide-scrollbar mb-6">
                            {Array(7).fill().map((_, index) => {
                                // Generate dates dynamically starting from today
                                const date = new Date();
                                date.setDate(date.getDate() + index);
                                const dayNum = date.getDate();
                                const isToday = index === 0;
                                
                                // Get day name based on the actual date
                                const dayName = date.toLocaleDateString(undefined, { weekday: "short" });

                                return (
                                    <div
                                        key={index}
                                        className="flex flex-col items-center mr-8"
                                    >
                                        <span className="text-sm text-gray-500 mb-1">
                                            {dayName}
                                        </span>
                                        <div
                                            className={`w-12 h-12 rounded-full flex items-center justify-center text-lg ${
                                                isToday
                                                    ? "bg-green-900 text-white"
                                                    : "text-gray-700"
                                            }`}
                                        >
                                            {dayNum}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Current temperature and conditions */}
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <div className="text-7xl font-normal text-green-900 mb-1">
                                    13°
                                </div>
                                <div className="text-xl text-gray-700 mb-1">
                                    {t.showers}
                                </div>
                                <div className="text-lg text-gray-500">
                                    {t.highLowTemp}
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <div className="flex items-center mb-2">
                                    <Droplets
                                        size={18}
                                        className="text-gray-500 mr-1"
                                    />
                                    <span className="text-lg text-gray-700">
                                        {t.precipitationPercent}
                                    </span>
                                </div>
                                <div className="flex items-center text-lg text-gray-500 mb-2">
                                    <Sunrise size={18} className="mr-1" />
                                    <span>{t.sunriseTime}</span>
                                </div>
                                <div className="flex items-center text-lg text-gray-500">
                                    <Sunset size={18} className="mr-1" />
                                    <span>{t.sunsetTime}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Horizontal scrollable cards section */}
                <div className="flex overflow-x-auto pb-4 hide-scrollbar space-x-4 mb-6">
                    {/* Weather along trail card */}
                    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 min-w-[85%] flex-shrink-0">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="text-lg text-gray-700">
                                {t.weatherAlongTrail}
                            </h4>
                            <select className="text-xs text-gray-700 bg-gray-100 rounded-full pr-6 py-1 border-none">
                                <option>11:00 PM</option>
                                <option>12:00 AM</option>
                                <option>1:00 AM</option>
                            </select>
                        </div>

                        <div className="relative h-24 mb-2">
                            {/* The trail graph */}
                            <div className="absolute inset-0 flex items-center">
                                <div className="h-1 bg-green-700 w-full rounded-full"></div>
                            </div>
                            {/* Temperature point */}
                            <div className="absolute top-1/2 left-1/3 transform -translate-y-1/2">
                                <div className="w-4 h-4 bg-white rounded-full border-2 border-green-700 relative">
                                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xl text-green-900 font-medium">
                                        11°
                                    </div>
                                </div>
                            </div>
                            {/* Path markers */}
                            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-sm text-gray-500">
                                <span>0 km</span>
                                <span>4.7 km</span>
                                <span>9.4 km</span>
                            </div>
                        </div>
                    </div>

                    {/* Ground conditions card */}
                    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 min-w-[70%] flex-shrink-0">
                        <div className="flex items-start">
                            <div className="flex-1">
                                <h4 className="text-lg text-gray-700 mb-3">
                                    Ground
                                </h4>
                                <div className="flex items-center">
                                    <div className="w-16 h-16 bg-green-900 rounded-full flex items-center justify-center mr-3">
                                        <Droplets
                                            size={28}
                                            className="text-white"
                                        />
                                    </div>
                                    <div>
                                        <div className="text-green-900 text-2xl font-medium">
                                            {t.wetCondition}
                                        </div>
                                        <div className="text-gray-600">
                                            {t.weatherDataDescription}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-sm text-gray-500 mb-10 text-center">
                    {t.weatherDataDisclaimer}
                </div>

                {/* Title for Horizontal Scrollable Information Cards */}
                <h2 className="font-bold text-lg text-gray-800 mb-3 flex items-center">
                    {t.visitorInformation}
                </h2>

                <div className="flex overflow-x-auto hide-scrollbar space-x-4 mb-6">
                    <div className="min-w-[85%]">
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 border border-gray-100 relative">
                            <div className="h-48 bg-green-100 relative">
                                <img
                                    src="https://tracedetrail.fr/traces/maps/MapTrace269148_3463.jpg"
                                    alt="Map"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-3 right-3">
                                    <button className="bg-white rounded-full p-2 shadow-md">
                                        <MapPin
                                            size={20}
                                            className="text-green-500"
                                        />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-medium text-gray-800">
                                        {t.exploreRoutes}
                                    </h3>
                                </div>
                                <p className="text-xs text-gray-500 mb-3">
                                    {t.routeDescription}
                                </p>
                                <button
                                    className="w-full flex justify-center items-center py-2.5 text-white text-sm font-medium bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
                                    onClick={() => {
                                        setShowingRegistrationVideo(false);
                                        setShowVideoPopup(true);
                                    }}
                                >
                                    <MapPin size={18} className="mr-2" />
                                    {t.viewFullMap}
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="min-w-[85%]">                            
                        {/* Video Animation Guide */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4 border border-gray-100">
                            <div className="relative h-48">
                                <img 
                                    src="https://img.freepik.com/free-vector/online-app-tourism-traveler-with-mobile-phone-map-building_74855-10966.jpg" 
                                    alt="Registration Guide"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                                    <button 
                                        onClick={() => {
                                            setShowingRegistrationVideo(true);
                                            setShowVideoPopup(true)
                                        }} 
                                        className="bg-white bg-opacity-90 text-green-600 rounded-full p-4 shadow-lg hover:bg-opacity-100 transition"
                                    >
                                        <Play size={30} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-medium text-gray-800 mb-2">{t.howToRegister}</h3>
                                <p className="text-xs text-gray-600 mb-3">
                                    {t.learnToRegister}
                                </p>
                                <button 
                                    onClick={() => {
                                        setShowingRegistrationVideo(true);
                                        setShowVideoPopup(true);
                                    }}
                                    className="w-full flex justify-center items-center py-2.5 text-white text-sm font-medium bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
                                >
                                    <Play size={16} className="mr-2" />
                                    {t.watchVideo}
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="min-w-[85%]">
                        {/* Infographic Card */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4 border border-gray-100">
                            <div className="relative h-48">
                                <img 
                                    src="/assets/img/infografik1.png" 
                                    alt="Kawah Ijen Infographic"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-3 right-3">
                                    <div className="bg-white bg-opacity-90 text-green-600 rounded-full p-2 shadow-md">
                                        <FileImage size={20} />
                                    </div>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-medium text-gray-800 mb-2">
                                    {t.registrationProcess}
                                </h3>
                                <p className="text-xs text-gray-600 mb-3">
                                    {t.completeGuide}
                                </p>
                                <button 
                                    onClick={() => setShowInfographicImagePopup(true)}
                                    className="w-full flex justify-center items-center py-2.5 text-white text-sm font-medium bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
                                >
                                    <Maximize2 size={16} className="mr-2" />
                                    {t.viewRegistrationProcess}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preparation Checklist - Horizontal Scrollable Cards */}
                <h2 className="font-bold text-lg mb-3 text-gray-800 flex items-center">
                    {t.prepare}
                </h2>

                <div className="mb-6 px-5 -mx-5">
                    <div className="flex overflow-x-auto pb-4 px-5 hide-scrollbar snap-x">
                        {/* Card 1 - Warm Clothing */}
                        <div className="bg-white rounded-xl shadow-sm p-4 mr-3 w-[220px] border border-gray-100 flex-shrink-0 snap-start">
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-500 mb-3">
                                <Thermometer size={22} />
                            </div>
                            <h3 className="font-medium text-gray-800 mb-1">
                                {t.warmClothing}
                            </h3>
                            <p className="text-xs text-gray-500">
                                {t.warmClothingDesc}
                            </p>
                        </div>

                        {/* Card 2 - Gas Mask */}
                        <div className="bg-white rounded-xl shadow-sm p-4 mr-3 w-[220px] border border-gray-100 flex-shrink-0 snap-start">
                            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-500 mb-3">
                                <Wind size={22} />
                            </div>
                            <h3 className="font-medium text-gray-800 mb-1">
                                {t.gasMask}
                            </h3>
                            <p className="text-xs text-gray-500">
                                {t.gasMaskDesc}
                            </p>
                        </div>

                        {/* Card 3 - Water & Snacks */}
                        <div className="bg-white rounded-xl shadow-sm p-4 mr-3 w-[220px] border border-gray-100 flex-shrink-0 snap-start">
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-500 mb-3">
                                <Droplets size={22} />
                            </div>
                            <h3 className="font-medium text-gray-800 mb-1">
                                {t.waterSnacks}
                            </h3>
                            <p className="text-xs text-gray-500">
                                {t.waterSnacksDesc}
                            </p>
                        </div>

                        {/* Card 4 - Proper Footwear */}
                        <div className="bg-white rounded-xl shadow-sm p-4 mr-3 w-[220px] border border-gray-100 flex-shrink-0 snap-start">
                            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 mb-3">
                                <Footprints size={22} />
                            </div>
                            <h3 className="font-medium text-gray-800 mb-1">
                                {t.properFootwear}
                            </h3>
                            <p className="text-xs text-gray-500">
                                {t.footwearDesc}
                            </p>
                        </div>

                        {/* Card 5 - Headlamp */}
                        <div className="bg-white rounded-xl shadow-sm p-4 mr-3 w-[220px] border border-gray-100 flex-shrink-0 snap-start">
                            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-500 mb-3">
                                <Flashlight size={22} />
                            </div>
                            <h3 className="font-medium text-gray-800 mb-1">
                                {t.headlamp}
                            </h3>
                            <p className="text-xs text-gray-500">
                                {t.headlampDesc}
                            </p>
                        </div>

                        {/* Card 6 - Rain Gear */}
                        <div className="bg-white rounded-xl shadow-sm p-4 mr-5 w-[220px] border border-gray-100 flex-shrink-0 snap-start">
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-500 mb-3">
                                <Umbrella size={22} />
                            </div>
                            <h3 className="font-medium text-gray-800 mb-1">
                                {t.rainGear}
                            </h3>
                            <p className="text-xs text-gray-500">
                                {t.rainGearDesc}
                            </p>
                        </div>
                    </div>
                </div>
            
            {/* Modals */}
            {showVideoPopup && (
                <VideoModal 
                    onClose={() => setShowVideoPopup(false)} 
                    videoType={showingRegistrationVideo ? "guide" : "map"} 
                />
            )}
            
            {showInfographicImagePopup && (
                <InfographicModal onClose={() => setShowInfographicImagePopup(false)} />
            )}

            </div>

            {/* Add floating action button */}
            <Link
                href={route('screenings.create')}
                className="fixed right-6 bottom-20 w-14 h-14 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center shadow-lg text-white transform hover:scale-105 transition-transform"
            >
                <Plus size={24} />
            </Link>
            
            {/* Modals */}
            {showVideoPopup && (
                <VideoModal 
                    onClose={() => setShowVideoPopup(false)} 
                    videoType={showingRegistrationVideo ? "guide" : "map"} 
                />
            )}
        </Layout>
    );
};

export default Home;