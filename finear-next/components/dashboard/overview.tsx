"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowDownLeft, ArrowUpRight, Download, Ellipsis, HandCoins, PiggyBank, Plus, Wallet } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api, getErrorMessage } from "@/lib/api/client";
import type { DashboardData } from "@/lib/types/domain";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast-provider";

const money = (value: number) => new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(value);

export function Overview() {
  const toast = useToast();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [budget, setBudget] = useState("");
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [savingBudget, setSavingBudget] = useState(false);

  async function load() {
    try {
      setError("");
      const response = await api.get<{ data: DashboardData }>("/dashboard");
      setData(response.data.data);
    } catch (issue) {
      setError(getErrorMessage(issue, "Your dashboard could not load."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    api.get<{ data: DashboardData }>("/dashboard")
      .then((response) => { if (!cancelled) setData(response.data.data); })
      .catch((issue: unknown) => { if (!cancelled) setError(getErrorMessage(issue, "Your dashboard could not load.")); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const chartData = useMemo(() => [...(data?.recentTransactions ?? [])].reverse().map((transaction) => ({
    date: new Date(transaction.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short" }),
    value: transaction.type === "expense" ? -transaction.amount : transaction.amount,
  })), [data]);

  async function saveBudget(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingBudget(true);
    try {
      await api.put("/dashboard/budget", { budget: Number(budget) });
      toast.success("Monthly budget saved.");
      setBudgetOpen(false);
      await load();
    } catch (issue) {
      toast.error(getErrorMessage(issue, "Budget could not be saved."));
    } finally {
      setSavingBudget(false);
    }
  }

  if (loading) return <div className="loading-card"><span className="spinner" /> Loading your money overview…</div>;
  if (!data) return <div className="empty-card"><h2>We couldn’t load your dashboard</h2><p>{error || "Please try again."}</p><Button onClick={() => { setLoading(true); void load(); }}>Try again</Button></div>;

  const maxBalance = Math.max(data.profile.totalBalance, 1);
  return (
    <div className="dashboard-page">
      <div className="page-heading-row">
        <div><p className="overline">YOUR FINANCIAL PICTURE</p><h1>Good to see you, {data.profile.name.split(" ")[0]} <span className="wave"></span></h1><p className="page-subtitle">Here’s what’s happening with your money.</p></div>
        <Link href="/dashboard/income" className="button button-primary"><Plus size={17} /> Add transaction</Link>
      </div>
      {error && <div className="notice notice-error" role="alert">{error}</div>}

      <section className="stat-grid" aria-label="Finance summary">
        <article className="stat-card stat-card-featured"><div className="stat-card-top"><span className="stat-icon stat-icon-green"><Wallet size={19} /></span><span className="stat-overline">TOTAL BALANCE</span><button className="subtle-icon" aria-label="Balance options"><Ellipsis size={19} /></button></div><strong className="stat-value">{money(data.profile.totalBalance)}</strong><span className="stat-caption">Across cash and bank</span><div className="balance-track"><span style={{ width: `${Math.min(data.profile.handBalance / maxBalance * 100, 100)}%` }} /></div><div className="balance-legend"><span><i className="dot dot-green" /> Cash {money(data.profile.handBalance)}</span><span><i className="dot dot-blue" /> Bank {money(data.profile.bankBalance)}</span></div></article>
        <article className="stat-card"><div className="stat-card-top"><span className="stat-icon stat-icon-blue"><ArrowDownLeft size={19} /></span><span className="stat-overline">TOTAL INCOME</span></div><strong className="stat-value">{money(data.totalIncome)}</strong><span className="stat-caption">All recorded income</span><Link href="/dashboard/income" className="stat-link">See income <ArrowUpRight size={14} /></Link></article>
        <article className="stat-card"><div className="stat-card-top"><span className="stat-icon stat-icon-amber"><ArrowUpRight size={19} /></span><span className="stat-overline">TOTAL SPENDING</span></div><strong className="stat-value">{money(data.totalExpense)}</strong><span className="stat-caption">All recorded expenses</span><Link href="/dashboard/expenses" className="stat-link">See expenses <ArrowUpRight size={14} /></Link></article>
        <article className="stat-card"><div className="stat-card-top"><span className="stat-icon stat-icon-violet"><PiggyBank size={19} /></span><span className="stat-overline">FLEXIBLE SAVINGS</span></div><strong className="stat-value">{money(data.profile.flexibleSavings)}</strong><span className="stat-caption">Available savings balance</span><Link href="/dashboard/savings" className="stat-link">Manage savings <ArrowUpRight size={14} /></Link></article>
      </section>

      <section className="overview-grid">
        <article className="glass-card activity-card">
          <div className="section-title-row"><div><p className="overline">AT A GLANCE</p><h2>Recent activity</h2><p className="section-hint">Your latest money movements</p></div><Link href="/dashboard/expenses" className="button button-glass button-small">All activity <ArrowUpRight size={15} /></Link></div>
          {chartData.length > 1 ? <div className="overview-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{ top: 12, right: 6, left: -20, bottom: 0 }}><defs><linearGradient id="overviewFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#168563" stopOpacity={0.25} /><stop offset="100%" stopColor="#168563" stopOpacity={0.01} /></linearGradient></defs><CartesianGrid vertical={false} stroke="#e8efeb" strokeDasharray="4 5" /><XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#85958d", fontSize: 11 }} dy={9} /><YAxis axisLine={false} tickLine={false} tick={{ fill: "#85958d", fontSize: 11 }} tickFormatter={(value: number) => `${Math.round(value / 1000)}k`} /><Tooltip formatter={(value) => [money(Number(value)), "Amount"]} contentStyle={{ borderRadius: 14, border: "1px solid #e5ece8", boxShadow: "0 12px 30px #23463818" }} /><Area type="monotone" dataKey="value" stroke="#168563" strokeWidth={2.5} fill="url(#overviewFill)" /></AreaChart></ResponsiveContainer></div> : <div className="chart-empty"><span className="chart-empty-icon"><HandCoins size={21} /></span><strong>Your activity will show up here</strong><span>Add a transaction to start seeing your money trends.</span></div>}
          <div className="activity-list-heading"><h3>Latest transactions</h3><span>{data.recentTransactions.length} recent</span></div>
          {data.recentTransactions.length ? <div className="transaction-list compact-list">{data.recentTransactions.slice(0, 4).map((item) => <div className="transaction-row" key={item.id}><span className={`transaction-mark ${item.type}`} aria-hidden="true">{item.type === "income" ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}</span><div className="transaction-main"><strong>{item.title}</strong><span>{item.category} · {new Date(item.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short" })}</span></div><strong className={`transaction-amount ${item.type === "income" ? "positive" : ""}`}>{item.type === "expense" ? "−" : "+"}{money(item.amount)}</strong></div>)}</div> : <p className="list-empty">No transactions yet. Add your first one to begin.</p>}
        </article>

        <div className="overview-side">
          <article className="glass-card budget-card">
            <div className="section-title-row"><div><p className="overline">STAY ON TRACK</p><h2>Monthly budget</h2></div><button className="subtle-icon" aria-label="Set monthly budget" onClick={() => { setBudget(String(data.profile.monthlyBudget || "")); setBudgetOpen(!budgetOpen); }}><Ellipsis size={19} /></button></div>
            <strong className="budget-amount">{money(data.profile.monthlyBudget)}</strong><p className="section-hint">Your monthly spending target</p>
            {data.profile.monthlyBudget > 0 && <div className="budget-track"><span style={{ width: `${Math.min(data.totalExpense / data.profile.monthlyBudget * 100, 100)}%` }} /></div>}
            {budgetOpen ? <form className="inline-form" onSubmit={saveBudget}><label className="sr-only" htmlFor="budget">Monthly budget amount in PKR</label><input id="budget" type="number" min="0" step="0.01" value={budget} onChange={(event) => setBudget(event.target.value)} placeholder="Enter amount" required /><Button className="button-small" disabled={savingBudget}>{savingBudget ? "Saving…" : "Save"}</Button><button type="button" className="text-button" onClick={() => setBudgetOpen(false)}>Cancel</button></form> : <button className="button button-glass button-small budget-edit" onClick={() => { setBudget(String(data.profile.monthlyBudget || "")); setBudgetOpen(true); }}>Set monthly budget</button>}
          </article>

          <article className="goal-preview-card"><div className="goal-preview-orb"><PiggyBank size={21} /></div><div><p className="overline">YOUR NEXT MILESTONE</p><h2>{data.activeGoals[0]?.goalName ?? "A goal worth saving for"}</h2><p>{data.activeGoals[0] ? `${money(data.activeGoals[0].savedAmount)} saved of ${money(data.activeGoals[0].targetAmount)}` : "Give your savings a purpose and watch it grow."}</p></div><Link href="/dashboard/savings" aria-label="View savings goals"><ArrowUpRight size={18} /></Link>{data.activeGoals[0] && <div className="goal-preview-track"><span style={{ width: `${Math.min(data.activeGoals[0].savedAmount / Math.max(data.activeGoals[0].targetAmount, 1) * 100, 100)}%` }} /></div>}</article>
          <div className="quick-links"><Link href="/dashboard/income"><span className="quick-icon quick-income"><Plus size={17} /></span><span><strong>Record income</strong><small>Add money received</small></span><ArrowUpRight size={15} /></Link><Link href="/dashboard/expenses"><span className="quick-icon quick-expense"><Download size={17} /></span><span><strong>Record expense</strong><small>Keep spending in view</small></span><ArrowUpRight size={15} /></Link></div>
        </div>
      </section>
    </div>
  );
}
