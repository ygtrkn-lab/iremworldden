"use client";

import type { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

interface AdminHeroProps {
  title?: string;
  subtitle?: string;
  kicker?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  actions?: Array<{
    label: string;
    href?: string;
    icon?: ReactNode;
    onClick?: () => void;
  }>;
  stats?: Array<{
    label: string;
    value: number | string;
    trend?: string;
  }>;
}

export default function AdminHero({
  title = "Yönetim Stüdyosu",
  subtitle = "IREMWORLD platformundaki tüm operasyonları tek panelden yönetin",
  kicker = "IREMWORLD CONTROL",
  breadcrumbs = [],
  actions = [],
  stats = [
    { label: "Aktif İlan", value: "156", trend: "+12%" },
    { label: "Yeni Talepler", value: "48", trend: "+6" },
    { label: "Owner Skoru", value: "94", trend: "Stabil" }
  ]
}: AdminHeroProps) {
  const { user } = useAuth();

  // AdminHero removed per rebuild — returning lightweight placeholder
  return (
    <section className="admin-hero">
      <div className="admin-hero__background" />
        <div className="admin-hero__orb admin-hero__orb--primary" />
        <div className="admin-hero__orb admin-hero__orb--secondary" />
        <div className="admin-hero__grid" />
      </div>

      <div className="admin-hero__content">
        <div>
          {breadcrumbs.length > 0 && (
            <div className="admin-hero__breadcrumbs">
              {breadcrumbs.map((crumb, index) => (
                <span key={crumb.label} className="admin-hero__breadcrumb">
                  {crumb.href ? (
                    <Link href={crumb.href}>{crumb.label}</Link>
                  ) : (
                    <span>{crumb.label}</span>
                  )}
                  {index < breadcrumbs.length - 1 && <span>•</span>}
                </span>
              ))}
            </div>
          )}
          <p className="admin-hero__eyebrow">{kicker}</p>
          <h1 className="admin-hero__title">{title}</h1>
          <p className="admin-hero__subtitle">{subtitle}</p>
          <div className="admin-hero__user">
            <div className="admin-hero__userAvatar">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-full w-full rounded-2xl object-cover" />
              ) : (
                <span>{user?.name?.[0] ?? "I"}</span>
              )}
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Aktif Operasyon</p>
              <p className="text-lg font-semibold text-slate-900">{user?.name ?? "IREMWORLD"}</p>
              <p className="text-sm text-slate-500 capitalize">{user?.role ?? "admin"} • {user?.email ?? "info@iremworld.com"}</p>
            </div>
          </div>

          {actions.length > 0 && (
            <div className="admin-hero__actions">
              {actions.map((action, index) => {
                const content = (
                  <span className="flex items-center gap-2" key={action.label}>
                    {action.icon}
                    {action.label}
                  </span>
                );

                if (action.href) {
                  return (
                    <Link key={index} href={action.href} className="admin-hero__actionWrapper">
                      {content}
                    </Link>
                  );
                }

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={action.onClick}
                    className="admin-hero__actionWrapper"
                  >
                    {content}
                  </button>
                );
              })}
            </div>
          )}
        </div>

          <div className="admin-hero__stats">
          {stats.map((stat, index) => (
            <div key={index} className="admin-hero__stat">
              <p className="admin-hero__statLabel">{stat.label}</p>
              <p className="admin-hero__statValue">{stat.value}</p>
              {stat.trend && (
                <p className={`admin-hero__statTrend ${stat.trend.startsWith("-") ? "is-negative" : ""}`}>
                  {stat.trend}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
