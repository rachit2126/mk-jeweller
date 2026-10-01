import Link from 'next/link';
import { Layout, Menu, Image as ImageIcon, ArrowRight } from 'lucide-react';

export default function ContentHubPage() {
  const sections = [
    {
      title: 'Homepage Sections CMS',
      description: 'Reorder, enable/disable, and configure hero banners, category showcases, curated occasions, and customer reviews',
      href: '/admin/content/homepage',
      icon: Layout,
      color: 'bg-rose-50 text-[#B76E79]',
    },
    {
      title: 'Navigation & Menus',
      description: 'Configure desktop header navbar, mega menus, mobile drawer links, and footer navigation columns',
      href: '/admin/navigation',
      icon: Menu,
      color: 'bg-amber-50 text-amber-700',
    },
    {
      title: 'Promotional Banners',
      description: 'Manage homepage hero carousels, section promotions, category banners, and discount callouts',
      href: '/admin/banners',
      icon: ImageIcon,
      color: 'bg-purple-50 text-purple-700',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-serif text-stone-900 tracking-tight">Content Management System</h1>
        <p className="text-sm text-stone-500">Real-time control over storefront layouts, banners, and menus</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sections.map((sec) => {
          const Icon = sec.icon;
          return (
            <Link
              key={sec.title}
              href={sec.href}
              className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm hover:border-[#B76E79]/40 hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${sec.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-stone-900 group-hover:text-[#B76E79] transition">
                  {sec.title}
                </h3>
                <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                  {sec.description}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-medium text-[#B76E79]">
                <span>Manage</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
