"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useMemo } from "react";
import type { IconType } from "react-icons";
import { useAuth } from "@/contexts/AuthContext";
import {
  RiDashboardLine,
  RiBuildingLine,
  RiTeamLine,
  RiSettings4Line,
  RiQuestionLine,
  RiUserStarLine,
  RiStore2Line,
  RiMoneyDollarCircleLine,
  RiBarChart2Line,
  RiSparklingLine,
  RiLineChartLine,
  RiAddLine
} from "react-icons/ri";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  type NavItem = {
    label: string;
    href: string;
    icon: IconType;
    description?: string;
    roles?: string[];
  };

  const resolveAccess = (roles?: string[]) => {
    if (!roles || roles.length === 0) {
      return true;
    }
    if (!user?.role) {
      return false;
    }
    if (roles.includes(user.role)) {
      return true;
    }
    if (user.role === "owner" && roles.includes("admin")) {
      return true;
    }
    if (user.role === "super_admin") {
      return true;
    }
    return false;
  };

  const navigation = useMemo(() => {
    const overview: NavItem[] = [
      { label: "Kontrol", href: "/iw-management", icon: RiDashboardLine, description: "Genel görünüm" },
      { label: "İlanlar", href: "/iw-management/properties", icon: RiBuildingLine, description: "Satılık & kiralık" },
      { label: "Danışmanlar", href: "/iw-management/agents", icon: RiUserStarLine, description: "Ekibiniz" },
    ];

    const operations: NavItem[] = [
      { label: "Mağazalar", href: "/iw-management/stores", icon: RiStore2Line, description: "Kurum ortakları", roles: ["admin", "owner"] },
      { label: "Kullanıcılar", href: "/iw-management/users", icon: RiTeamLine, description: "Yetkilendirme", roles: ["admin", "owner"] },
      { label: "Raporlar", href: "/iw-management/reports", icon: RiBarChart2Line, description: "Performans", roles: ["admin", "owner"] },
    ];

    const owner: NavItem[] = [
      { label: "Owner Alanı", href: "/iw-management/owner", icon: RiSparklingLine, description: "Özet panosu", roles: ["owner"] },
      { label: "Finans", href: "/iw-management/finances", icon: RiMoneyDollarCircleLine, description: "Gelir tablosu", roles: ["owner"] },
      { label: "Yatırım", href: "/iw-management/reports", icon: RiLineChartLine, description: "KPI" , roles: ["owner"]},
    ];

    const support: NavItem[] = [
      { label: "Ayarlar", href: "/iw-management/settings", icon: RiSettings4Line, description: "Tema & erişim" },
      { label: "Yardım", href: "/iw-management/help", icon: RiQuestionLine, description: "Destek merkezi" },
    ];

    const sections = [] as Array<{ title: string; items: NavItem[] }>;

    const filteredOwner = owner.filter((item) => resolveAccess(item.roles));
    if (filteredOwner.length) {
      sections.push({ title: "Owner", items: filteredOwner });
    }

    sections.push({ title: "Kontrol", items: overview.filter((item) => resolveAccess(item.roles)) });
    sections.push({ title: "Operasyon", items: operations.filter((item) => resolveAccess(item.roles)) });
    sections.push({ title: "Destek", items: support.filter((item) => resolveAccess(item.roles)) });

    return sections.filter((section) => section.items.length > 0);
  }, [user?.role]);

  const isActive = (href: string) => pathname === href || pathname?.startsWith(`${href}/`);

  // AdminSidebar simplified for rebuild — returns minimal nav to avoid breaking imports
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      <aside
        className={`admin-sidebar ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="admin-sidebar__brand">
          <div className="admin-sidebar__logo" />
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">IREMWORLD</p>
            <p className="text-lg font-semibold text-white">Control Center</p>
          </div>
        </div>

        <div className="admin-sidebar__userCard">
          <div className="admin-sidebar__userCardHeader">
            <div className="admin-sidebar__avatar">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-12 w-12 rounded-2xl object-cover" />
              ) : (
                <span>{user?.name?.[0] ?? "I"}</span>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{user?.name ?? "IREMWORLD"}</p>
              <p className="admin-sidebar__userMeta capitalize">{user?.role ?? "agent"}</p>
            </div>
          </div>
          <p className="admin-sidebar__badge">Dinamik panel</p>
        </div>

        <div className="admin-sidebar__scroll">
          {navigation.map((section) => (
            <nav key={section.title} className="admin-sidebar__section">
              <p className="admin-sidebar__label">{section.title}</p>
              <div className="space-y-2">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`admin-sidebar__item ${active ? "is-active" : ""}`}
                      onClick={onClose}
                    >
                      <div className="admin-sidebar__itemMain">
                        <Icon className="h-4 w-4" />
                        <div>
                          <span>{item.label}</span>
                          {item.description && (
                            <span className="admin-sidebar__description">{item.description}</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </nav>
          ))}
        </div>

        <div className="admin-sidebar__footer">
          <Link href="/iw-management/properties/add" className="admin-sidebar__quickAction" onClick={onClose}>
            <RiAddLine className="h-4 w-4" /> Yeni Kayıt
          </Link>
          <Link href="/" className="admin-sidebar__footerLink" onClick={onClose}>
            Ana Siteye Dön
          </Link>
          <Link href="/iw-management/help" className="admin-sidebar__footerLink" onClick={onClose}>
            Yardım Merkezi
          </Link>
        </div>
      </aside>
    </>
  );
}
