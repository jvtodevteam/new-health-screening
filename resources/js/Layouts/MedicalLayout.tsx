import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Menu as MenuIcon, Bell, X } from 'lucide-react';

export default function MedicalLayout({ children }) {
    const { auth, flash } = usePage().props;
    const navigation = [
        { name: 'Dashboard', href: route('medical.dashboard'), current: route().current('medical.dashboard') },
        { name: 'Pemeriksaan', href: route('medical.screenings.index'), current: route().current('medical.screenings.*') },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <Disclosure as="nav" className="bg-white shadow-sm">
                {({ open }) => (
                    <>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between h-16">
                                <div className="flex">
                                    <div className="flex-shrink-0 flex items-center">
                                        <img
                                            className="block h-8 w-auto"
                                            src="/logo.svg"
                                            alt="Workflow"
                                        />
                                    </div>
                                    <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                                        {navigation.map((item) => (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className={`${
                                                    item.current
                                                        ? 'border-indigo-500 text-gray-900'
                                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                                <div className="hidden sm:ml-6 sm:flex sm:items-center">
                                    <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                        <span className="sr-only">View notifications</span>
                                        <Bell className="h-6 w-6" aria-hidden="true" />
                                    </button>

                                    <Menu as="div" className="ml-3 relative">
                                        <div>
                                            <Menu.Button className="bg-white flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                                <span className="sr-only">Open user menu</span>
                                                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-500">
                                                    <span className="text-sm font-medium leading-none text-white">
                                                        {auth.medical_staff?.username.charAt(0).toUpperCase() || 'U'}
                                                    </span>
                                                </span>
                                            </Menu.Button>
                                        </div>
                                        <Transition
                                            enter="transition ease-out duration-200"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <Link
                                                            href={route('medical.logout')}
                                                            method="post"
                                                            as="button"
                                                            className={`${
                                                                active ? 'bg-gray-100' : ''
                                                            } block px-4 py-2 text-sm text-gray-700 w-full text-left`}
                                                        >
                                                            Logout
                                                        </Link>
                                                    )}
                                                </Menu.Item>
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                </div>
                                <div className="-mr-2 flex items-center sm:hidden">
                                    <Disclosure.Button className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                        <span className="sr-only">Open main menu</span>
                                        {open ? (
                                            <X className="block h-6 w-6" aria-hidden="true" />
                                        ) : (
                                            <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                                        )}
                                    </Disclosure.Button>
                                </div>
                            </div>
                        </div>

                        <Disclosure.Panel className="sm:hidden">
                            <div className="pt-2 pb-3 space-y-1">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`${
                                            item.current
                                                ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                                                : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                                        } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                            <div className="pt-4 pb-3 border-t border-gray-200">
                                <div className="flex items-center px-4">
                                    <div className="flex-shrink-0">
                                        <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-500">
                                            <span className="text-sm font-medium leading-none text-white">
                                                {auth.medical_staff?.username.charAt(0).toUpperCase() || 'U'}
                                            </span>
                                        </span>
                                    </div>
                                    <div className="ml-3">
                                        <div className="text-base font-medium text-gray-800">{auth.medical_staff?.username || 'User'}</div>
                                    </div>
                                </div>
                                <div className="mt-3 space-y-1">
                                    <Link
                                        href={route('medical.logout')}
                                        method="post"
                                        as="button"
                                        className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 w-full text-left"
                                    >
                                        Logout
                                    </Link>
                                </div>
                            </div>
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>

            {flash.success && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
                    <div className="rounded-md bg-green-50 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-green-800">{flash.success}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <main>
                <div className="py-6">
                    {children}
                </div>
            </main>
        </div>
    );
}