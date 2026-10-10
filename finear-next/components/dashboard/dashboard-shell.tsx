"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { BarChart3, Bell, ChevronDown, CircleHelp, LayoutDashboard, LogOut, Menu, PiggyBank, ReceiptText, Settings, WalletCards, X, UserRoundPen } from "lucide-react";
import { api, getErrorMessage } from "@/lib/api/client";
import type { SessionUser } from "@/lib/types/api";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/income", label: "Income", icon: BarChart3 },
  { href: "/dashboard/expenses", label: "Expenses", icon: ReceiptText },
  { href: "/dashboard/savings", label: "Savings & goals", icon: PiggyBank },
];

export function DashboardShell({ user, children }: { user: SessionUser; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(user.name);
  const [savingName, setSavingName] = useState(false);

  async function logout() {
    try {
      await api.post("/auth/logout");
      router.replace("/login");
      router.refresh();
    } catch (error) {
      setNotice(getErrorMessage(error, "Could not sign out."));
    }
  }

  async function uploadImage(file?: File) {
    if (!file) return;
    const body = new FormData();
    body.set("image", file);
    try {
      await api.post("/profile/image", body, { headers: { "Content-Type": "multipart/form-data" } });
      router.refresh();
    } catch (error) {
      setNotice(getErrorMessage(error, "Could not update your photo."));
    }
  }

  async function saveName(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingName(true);
    setNotice("");
    try {
      await api.patch("/profile", { name });
      setEditingName(false);
      router.refresh();
    } catch (error) {
      setNotice(getErrorMessage(error, "Could not update your name."));
    } finally {
      setSavingName(false);
    }
  }

  const initials = user.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  const avatarSrc = user.imagePath.startsWith("uploads/") ? `/${user.imagePath}` : null;

  return (
    <div className="dashboard-frame">
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <Link href="/dashboard" className="brand sidebar-brand"><span className="brand-mark"><WalletCards size={20} /></span>Finear</Link>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          {navItems.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return <Link key={href} href={href} onClick={() => setMenuOpen(false)} className={`nav-link ${active ? "nav-link-active" : ""}`} aria-current={active ? "page" : undefined}><Icon size={19} strokeWidth={1.8} /><span>{label}</span>{active && <span className="nav-active-dot" />}</Link>;
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-tip"><span className="tip-icon"><CircleHelp size={18} /></span><strong>Your next money win</strong><p>Little steps add up. Check in with your goals today.</p><Link href="/dashboard/savings">View savings <span>→</span></Link></div>
          <div className="sidebar-user"><span className="avatar avatar-small">{initials}</span><div className="sidebar-user-copy"><strong>{user.name}</strong><span>Personal account</span></div><Settings size={17} className="sidebar-settings" /></div>
        </div>
      </aside>

      {menuOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}

      <div className="dashboard-main">
        <header className="topbar">
          <button className="icon-button mobile-menu-toggle" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
          <div className="breadcrumb"><span>Finear</span><span className="breadcrumb-slash">/</span><strong>{navItems.find((item) => item.href === pathname)?.label ?? (pathname.includes("income") ? "Income" : pathname.includes("expenses") ? "Expenses" : "Savings & goals")}</strong></div>
          <div className="topbar-actions">
            <span className="today-label">Your personal finance space</span>
            <button className="icon-button notification-button" aria-label="Notifications"><Bell size={18} /><i /></button>
            <DropdownMenu>
              <div className="profile-menu-wrap">
              <DropdownMenuTrigger asChild><button className="profile-trigger">
                {avatarSrc ? <Image className="avatar" src={avatarSrc} alt="" width={38} height={38} unoptimized /> : <span className="avatar">{initials}</span>}
                <span className="profile-trigger-name">{user.name.split(" ")[0]}</span><ChevronDown size={15} />
              </button></DropdownMenuTrigger>
              <DropdownMenuContent className="profile-popover">
                <strong>{user.name}</strong><span>{user.email}</span>
                <DropdownMenuItem asChild><label className="popover-action">Change profile photo<input type="file" accept="image/jpeg,image/png,.jpg,.jpeg,.png" onChange={(event) => void uploadImage(event.target.files?.[0])} /></label></DropdownMenuItem>
                <DropdownMenuItem className="popover-action" onSelect={() => { setName(user.name); setEditingName(true); }}><UserRoundPen size={15} /> Edit name</DropdownMenuItem>
                <DropdownMenuItem className="popover-action" onSelect={() => void logout()}><LogOut size={15} /> Sign out</DropdownMenuItem>
              </DropdownMenuContent>
              </div>
            </DropdownMenu>
          </div>
        </header>
        <main className="page-content">
          {notice && <div className="notice notice-error" role="alert">{notice}<button onClick={() => setNotice("")} aria-label="Dismiss">×</button></div>}
          {children}
        </main>
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {navItems.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return <Link key={href} href={href} className={active ? "mobile-nav-item active" : "mobile-nav-item"}><Icon size={19} /><span>{label === "Savings & goals" ? "Savings" : label}</span></Link>;
          })}
        </nav>
      </div>
      {editingName && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditingName(false); }}>
        <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="profile-edit-title">
          <div className="modal-header"><div><p className="overline">ACCOUNT</p><h2 id="profile-edit-title">Update your name</h2></div><button className="icon-button" type="button" onClick={() => setEditingName(false)} aria-label="Close">×</button></div>
          <form className="modal-form" onSubmit={(event) => void saveName(event)}>
            <label className="field"><span>Full name</span><input id="profile-name" autoComplete="name" minLength={2} maxLength={120} required value={name} onChange={(event) => setName(event.target.value)} /></label>
            <div className="modal-actions"><button className="button button-secondary" type="button" onClick={() => setEditingName(false)}>Cancel</button><button className="button button-primary" disabled={savingName}>{savingName ? "Saving…" : "Save name"}</button></div>
          </form>
        </section>
      </div>}
    </div>
  );
}
