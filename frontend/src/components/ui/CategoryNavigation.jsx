import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Smartphone, Shirt, Tv, Home as HomeIcon, Smile, Car } from 'lucide-react';

const categories = [
  { name: 'Mobiles', icon: Smartphone, color: 'bg-blue-100 text-blue-600', link: '/category/mobiles' },
  { name: 'Fashion', icon: Shirt, color: 'bg-pink-100 text-pink-600', link: '/category/fashion' },
  { name: 'Electronics', icon: Tv, color: 'bg-purple-100 text-purple-600', link: '/category/electronics' },
  { name: 'Home', icon: HomeIcon, color: 'bg-green-100 text-green-600', link: '/category/home' },
  { name: 'Beauty', icon: Smile, color: 'bg-red-100 text-red-600', link: '/category/beauty' },
  { name: 'Automotive', icon: Car, color: 'bg-orange-100 text-orange-600', link: '/category/automotive' },
];

const getActiveCategory = (pathname) => {
  const match = categories.find(cat => pathname.startsWith(cat.link));
  return match ? match.name : null;
};

const CategoryNavigation = () => {
  const location = useLocation();
  const active = getActiveCategory(location.pathname);

  return (
    <nav className="w-full px-2 pt-0 pb-2 sm:pb-3 sticky top-0 z-30 bg-brand-dark/40 backdrop-blur-xl border border-white/5 shadow-glow rounded-2xl">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-5">
        {categories.map((cat, idx) => {
          const isActive = active === cat.name;
          return (
            <Link
              to={cat.link}
              key={idx}
              className={`group flex flex-col items-center gap-2 p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden
                bg-white/[0.02] backdrop-blur border-white/5 hover:border-accent-indigo/30 hover:shadow-glow hover:-translate-y-1
                ${isActive ? 'ring-2 ring-accent-indigo bg-accent-indigo/10 border-accent-indigo/30' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full ${cat.color.replace('bg-blue-100 text-blue-600', 'bg-accent-indigo/10 text-accent-indigo').replace('bg-pink-100 text-pink-600', 'bg-pink-500/10 text-pink-400').replace('bg-purple-100 text-purple-600', 'bg-purple-500/10 text-purple-400').replace('bg-green-100 text-green-600', 'bg-accent-emerald/10 text-accent-emerald').replace('bg-red-100 text-red-600', 'bg-rose-500/10 text-rose-400').replace('bg-orange-100 text-orange-600', 'bg-amber-500/10 text-amber-400')} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-[0_2px_8px_0_rgba(99,102,241,0.10)]
                  ${isActive ? 'ring-2 ring-accent-indigo' : ''}`}
              >
                <cat.icon size={24} className="transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-12" />
              </div>
              <span className={`text-[13px] font-bold uppercase tracking-wide transition-colors duration-200
                ${isActive ? 'text-accent-indigo' : 'text-slate-300 group-hover:text-accent-indigo'}`}>{cat.name}</span>
              <span className="absolute inset-0 rounded-2xl pointer-events-none group-hover:bg-accent-indigo/5 transition-colors duration-300" />
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default CategoryNavigation;

