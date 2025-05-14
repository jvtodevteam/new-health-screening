import React, { Fragment, useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Menu, Transition } from '@headlessui/react';
import { 
  Menu as MenuIcon, 
  X, 
  Home, 
  List, 
  FileCheck, 
  User, 
  LogOut, 
  MapPin,
  ChevronDown,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Calendar
} from 'lucide-react';

export default function MedicalLayout({ children }) {
    const { auth, flash } = usePage().props;
    const [showNotification, setShowNotification] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    const navigation = [
        { name: 'Dashboard', href: route('medical.dashboard'), icon: Home, current: route().current('medical.dashboard') },
        { name: 'Pendaftaran', href: route('medical.registrations.index'), icon: List, current: route().current('medical.registrations.*') },
        { name: 'Pemeriksaan', href: route('medical.examinations.index'), icon: FileCheck, current: route().current('medical.examinations.*') },
    ];

    // Get current active page
    const currentPage = navigation.find(item => item.current);
    const currentIcon = currentPage ? currentPage.icon : Home;
    const currentName = currentPage ? currentPage.name : 'Dashboard';

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-20 bg-gray-600 bg-opacity-75 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar - desktop */}
            <div 
                className={`fixed inset-y-0 left-0 z-30 w-64 bg-white transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Sidebar header with logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
                    <div className="flex items-center">
                        <span className="ml-2 text-lg font-semibold text-gray-900">Health Screening</span>
                    </div>
                    <button 
                        className="md:hidden p-1 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50 focus:outline-none"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Sidebar navigation */}
                <div className="flex flex-col h-full">
                    <div className="flex-1 py-4 overflow-y-auto">
                        <div className="px-2 space-y-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`${
                                        item.current
                                            ? 'bg-blue-50 text-blue-700 font-medium border-l-4 border-blue-600'
                                            : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600 border-l-4 border-transparent'
                                    } group flex items-center px-3 py-3 text-sm font-medium rounded-r-md transition-colors duration-150`}
                                >
                                    {React.createElement(item.icon, { className: "h-5 w-5 mr-3 flex-shrink-0" })}
                                    {item.name}
                                    {item.current && (
                                        <ChevronRight className="ml-auto h-4 w-4 text-blue-400" />
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                    
                    {/* User info in sidebar */}
                    <div className="border-t border-gray-200 p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white">
                                    {auth.medical_staff?.username.charAt(0).toUpperCase() || 'U'}
                                </div>
                            </div>
                            <div className="ml-3 min-w-0 flex-1">
                                <div className="text-sm font-medium text-gray-900 truncate">{auth.medical_staff?.username || 'User'}</div>
                                <div className="text-xs text-gray-500 flex items-center truncate">
                                    <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                                    <span className="truncate">{auth.medical_staff?.location?.name || '-'}</span>
                                </div>
                            </div>
                            <Link
                                href={route('medical.logout')}
                                method="post"
                                as="button"
                                className="p-1 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 focus:outline-none"
                            >
                                <LogOut className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden md:ml-0">
                {/* Top navbar */}
                <div className="bg-white shadow-sm z-10">
                    <div className="px-4 h-16 flex items-center justify-between">
                        {/* Left section with toggle button and page title */}
                        <div className="flex items-center">
                            <button
                                className="md:hidden p-2 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50 focus:outline-none"
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                            >
                                {sidebarOpen ? (
                                    <X className="h-6 w-6" />
                                ) : (
                                    <MenuIcon className="h-6 w-6" />
                                )}
                            </button>
                            
                            <h1 className="ml-2 md:ml-0 text-lg font-semibold text-gray-900">
                                {currentName}
                            </h1>
                        </div>
                        
                        {/* Center section with location (desktop only) */}
                        <div className="hidden md:flex items-center justify-center">
                            <div className="flex items-center text-sm text-gray-600">
                                <MapPin className="h-4 w-4 text-blue-500 mr-1" />
                                <span>{auth.medical_staff?.location?.name || '-'}</span>
                            </div>
                        </div>

                        {/* Right section with user info */}
                        <div className="flex items-center">
                            {/* User avatar (only on desktop - mobile uses bottom nav) */}
                            <div className="hidden md:flex items-center">
                                <div className="flex items-center">
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
                                        {auth.medical_staff?.username.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <span className="ml-2 text-sm font-medium text-gray-700">{auth.medical_staff?.username}</span>
                                </div>
                                <Link
                                    href={route('medical.logout')}
                                    method="post"
                                    as="button"
                                    className="ml-4 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none transition-colors duration-150"
                                >
                                    <LogOut className="mr-1.5 h-4 w-4" />
                                    Logout
                                </Link>
                            </div>
                            
                            {/* Mobile user menu dropdown */}
                            <Menu as="div" className="relative md:hidden">
                                <Menu.Button className="flex items-center text-gray-700 hover:text-blue-600 focus:outline-none transition-colors duration-150">
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
                                        {auth.medical_staff?.username.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                </Menu.Button>
                                
                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100">
                                        <div className="py-3 px-4">
                                            <p className="text-sm font-medium text-gray-900">{auth.medical_staff?.username}</p>
                                            <div className="flex items-center mt-1 text-xs text-gray-500">
                                                <MapPin className="h-3 w-3 mr-1" />
                                                {auth.medical_staff?.location?.name || '-'}
                                            </div>
                                        </div>
                                        
                                        <div className="py-1">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link
                                                        href={route('medical.logout')}
                                                        method="post"
                                                        as="button"
                                                        className={`${
                                                            active ? 'bg-red-50 text-red-600' : 'text-gray-700'
                                                        } group flex items-center w-full px-4 py-2 text-sm`}
                                                    >
                                                        <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-red-500" />
                                                        Logout
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                        </div>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        </div>
                    </div>
                </div>

                {/* Notification area */}
                {(flash.success || flash.error) && showNotification && (
                    <div className="px-4 md:px-6 mt-4">
                        <div className={`rounded-lg p-4 flex items-start justify-between ${flash.success ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'} shadow-sm`}>
                            <div className="flex">
                                <div className="flex-shrink-0 mt-0.5">
                                    {flash.success ? (
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <AlertTriangle className="h-5 w-5 text-red-500" />
                                    )}
                                </div>
                                <div className="ml-3">
                                    <p className={`text-sm font-medium ${flash.success ? 'text-green-800' : 'text-red-800'}`}>
                                        {flash.success || flash.error}
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setShowNotification(false)}
                                className={`ml-4 inline-flex text-gray-400 hover:${flash.success ? 'text-green-600' : 'text-red-600'} focus:outline-none`}
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Page content */}
                <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
                    <div className="py-4 px-4 md:px-6">
                        {children}
                    </div>
                </main>
                
                {/* Mobile Bottom Navigation */}
                <div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 flex z-10 md:hidden">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex-1 flex flex-col items-center justify-center py-2 ${
                                item.current
                                    ? 'text-blue-600'
                                    : 'text-gray-500 hover:text-blue-600'
                            } transition-colors duration-150`}
                        >
                            {React.createElement(item.icon, { 
                                className: `h-6 w-6 ${item.current ? 'text-blue-600' : 'text-gray-500'}`
                            })}
                            <span className="mt-1 text-xs font-medium">{item.name}</span>
                            {item.current && (
                                <div className="absolute top-0 inset-x-0 h-0.5 bg-blue-600"></div>
                            )}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}