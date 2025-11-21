"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  RiAddLine,
  RiBellLine,
  RiHomeLine,
  RiLogoutBoxLine,
  RiMenuLine,
  RiSearchLine
} from "react-icons/ri";

interface AdminHeaderProps {
  onMenuToggle?: () => void;
}

export default function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const goTo = (href: string) => router.push(href);

  // AdminHeader removed; simple replacement for rebuild
  return (
    <header className="admin-header">
      <div className="admin-header__container">
        <div className="admin-header__left">
          <button
            type="button"
            className="admin-header__menu"
            onClick={onMenuToggle}
            aria-label="Menüyü Aç"
          >
            <RiMenuLine className="h-5 w-5" />
          </button>
          <div className="admin-header__brand">
            <div className="admin-header__logo" aria-hidden="true" />
            <div>
              <p className="admin-header__eyebrow">IREMWORLD</p>
              <p className="admin-header__title">Kontrol Merkezi</p>
            </div>
          </div>
        </div>

        <div className="admin-header__search">
          <RiSearchLine className="h-4 w-4 text-slate-400" />
          <input
            type="search"
            placeholder="Panel içinde ara"
            aria-label="Panel içinde ara"
          />
          <span className="admin-header__kbd">CTRL K</span>
        </div>

        <div className="admin-header__actions">
          <button
            type="button"
            className="admin-header__ghost"
            onClick={() => goTo("/iw-management/properties/add")}
          >
            <RiAddLine className="h-4 w-4" />
            <span>Hızlı Kayıt</span>
          {/* Notifications removed for now */}
            <span className="hidden xl:inline">Ana Site</span>
          </button>
          <button type="button" className="admin-header__badge" aria-label="Bildirimler">
            <RiBellLine className="h-5 w-5" />
          </button>
          <div className="admin-header__user">
            <div className="admin-header__avatar">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-10 w-10 rounded-2xl object-cover"
                />
              ) : (
                <span>{user?.name?.[0] ?? "I"}</span>
              )}
            </div>
            <div className="admin-header__userMeta">
              <span>{user?.name ?? "IREMWORLD"}</span>
              <span>{user?.role ?? "admin"}</span>
            </div>
          </div>
          <button
            type="button"
            className="admin-header__logout"
            onClick={handleLogout}
            aria-label="Çıkış yap"
          >
            <RiLogoutBoxLine className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
