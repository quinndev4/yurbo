'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const buttons = [
  { href: '/me', label: 'Me' },
  { href: '/friends', label: 'Friends' },
  { href: '/yurbos', label: 'Yurbo' },
  { href: '/', label: 'Something' },
  { href: '/settings', label: 'Settings' },
];

export default function NavBar() {
  const [activeTab, setactiveTab] = useState(buttons[2].label);
  return (
    <header className='fixed top-0 z-50 flex h-20 w-full items-center justify-between border-b-2 bg-black'>
      {buttons.map((button) => (
        <Link
          key={`nav-bar-link-${button.href}`}
          href={button.href}
          onClick={() => setactiveTab(button.label)}
          className={`p-2 px-8 text-center transition-transform duration-200 hover:scale-110 ${activeTab === button.label ? 'scale-110' : ''}`}
        >
          {button.label}
        </Link>
      ))}
    </header>
  );
}
