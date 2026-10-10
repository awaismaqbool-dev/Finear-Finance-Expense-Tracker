"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Download, Pencil, Plus, Trash2, X } from "lucide-react";
import { api, getErrorMessage } from "@/lib/api/client";
import type { MoneySource, TransactionRecord, TransactionType } from "@/lib/types/domain";
import { Button } from "@/components/ui/button";
import { SegmentControl } from "@/components/ui/segment-control";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast-provider";

const copy: Record<"income" | "expense", { title: string; heading: string; description: string; add: string; accent: string }> = {
  income: { title: "Income", heading: "Give every earning a place.", description: "Keep a clear record of money coming in and see how it builds over time.", add: "Add income", accent: "#218a62" },
  expense: { title: "Expenses", heading: "Know where your money goes.", description: "Track spending as it happens and make your next decision with confidence.", add: "Add expense", accent: "#4b78a5" },
};
const money = (value: number) => new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 2 }).format(value);
type Draft = { title: string; amount: string; category: string; source: MoneySource };
const blankDraft: Draft = { title: "", amount: "", category: "General", source: "cash" };

export function TransactionManager({ type }: { type: "income" | "expense" }) {
  const content = copy[type];
  const toast = useToast();
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [nowMs, setNowMs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sourceFilter, setSourceFilter] = useState<"all" | MoneySource>("all");
  const [chartRange, setChartRange] = useState("30");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TransactionRecord | null>(null);
  const [draft, setDraft] = useState<Draft>(blankDraft);

  async function load() {
    try {
      setError("");
      const response = await api.get<{ data: { transactions: TransactionRecord[] } }>(`/transactions?type=${type}`);
      setTransactions(response.data.data.transactions);
      setNowMs(Date.now());
    } catch (issue) {
      setError(getErrorMessage(issue, "Transactions could not be loaded."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    api.get<{ data: { transactions: TransactionRecord[] } }>(`/transactions?type=${type}`)
      .then((response) => { if (!cancelled) { setTransactions(response.data.data.transactions); setNowMs(Date.now()); } })
      .catch((issue: unknown) => { if (!cancelled) setError(getErrorMessage(issue, "Transactions could not be loaded.")); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [type]);
  const filtered = useMemo(() => transactions.filter((item) => sourceFilter === "all" || item.source === sourceFilter), [transactions, sourceFilter]);
  const rangeStart = chartRange === "all" ? 0 : nowMs - Number(chartRange) * 24 * 60 * 60 * 1000;
  const rangeTransactions = transactions.filter((item) => new Date(item.createdAt).getTime() >= rangeStart);
  const chartData = [...rangeTransactions].slice(0, 8).reverse().map((item) => ({ date: new Date(item.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short" }), amount: item.amount }));
  const total = transactions.reduce((sum, item) => sum + item.amount, 0);

  function openCreate() { setEditing(null); setDraft(blankDraft); setModalOpen(true); }
  function openEdit(item: TransactionRecord) { setEditing(item); setDraft({ title: item.title, amount: String(item.amount), category: item.category, source: item.source }); setModalOpen(true); }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const body = { title: draft.title, amount: Number(draft.amount), type: type as TransactionType, source: draft.source, category: draft.category || "General" };
      if (editing) await api.patch("/transactions", { ...body, transactionId: editing.id });
      else await api.post("/transactions", body);
      const recordName = type === "income" ? "Income" : "Expense";
      toast.success(editing ? `${recordName} updated.` : `${recordName} added.`);
      setModalOpen(false);
      await load();
    } catch (issue) {
      toast.error(getErrorMessage(issue, "Transaction could not be saved."));
    } finally {
      setBusy(false);
    }
  }

  async function remove(item: TransactionRecord) {
    if (!window.confirm(`Delete “${item.title}” and adjust your balances?`)) return;
    try {
      await api.delete("/transactions", { data: { transactionId: item.id } });
      toast.success("Transaction deleted.");
      await load();
    } catch (issue) {
      toast.error(getErrorMessage(issue, "Transaction could not be deleted."));
    }
  }

  async function exportSheet() {
    try {
      const response = await api.get(`/export?type=${type}`, { responseType: "blob" });
      const url = URL.createObjectURL(response.data as Blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `finear-${type}-${new Date().toISOString().slice(0, 10)}.xlsx`;
      anchor.click();
      URL.revokeObjectURL(url);
      toast.success(`${content.title} spreadsheet downloaded.`);
    } catch (issue) {
      toast.error(getErrorMessage(issue, "The spreadsheet could not be downloaded."));
    }
  }

  return (
    <div className="dashboard-page">
      <div className="page-heading-row"><div><p className="overline">MONEY IN · {content.title.toUpperCase()}</p><h1>{content.heading}</h1><p className="page-subtitle">{content.description}</p></div><Button onClick={openCreate}><Plus size={17} /> {content.add}</Button></div>
      {error && <div className="notice notice-error" role="alert">{error}<button onClick={() => setError("")} aria-label="Dismiss">×</button></div>}
      <section className="savings-summary">
        <article className="stat-card"><div className="stat-card-top"><span className="stat-overline">TOTAL {content.title.toUpperCase()}</span></div><strong className="stat-value">{money(total)}</strong><span className="stat-caption">Across {transactions.length} records</span></article>
        <article className="stat-card"><div className="stat-card-top"><span className="stat-overline">CASH {content.title.toUpperCase()}</span></div><strong className="stat-value">{money(transactions.filter((item) => item.source === "cash").reduce((sum, item) => sum + item.amount, 0))}</strong><span className="stat-caption">Recorded as cash</span></article>
        <article className="stat-card"><div className="stat-card-top"><span className="stat-overline">BANK {content.title.toUpperCase()}</span></div><strong className="stat-value">{money(transactions.filter((item) => item.source === "bank").reduce((sum, item) => sum + item.amount, 0))}</strong><span className="stat-caption">Recorded as bank</span></article>
      </section>
      <section className="glass-card">
        <div className="finance-toolbar"><div><p className="overline">YOUR MONEY STORY</p><h2>{content.title} overview</h2></div><SegmentControl label="Filter transactions by source" value={sourceFilter} onChange={setSourceFilter} options={[{ label: "All sources", value: "all" }, { label: "Cash", value: "cash" }, { label: "Bank", value: "bank" }]} /></div>
        <div className="finance-range"><span>Chart period</span><Select value={chartRange} onValueChange={setChartRange} ariaLabel="Chart period" options={[{ value: "30", label: "Last 30 days" }, { value: "90", label: "Last 90 days" }, { value: "all", label: "All time" }]} /></div>
        <div className="finance-chart">{chartData.length ? <ResponsiveContainer width="100%" height="100%">{type === "income" ? <BarChart data={chartData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}><CartesianGrid vertical={false} stroke="#e9efea" strokeDasharray="4 5" /><XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#8b9890", fontSize: 10 }} dy={8} /><YAxis axisLine={false} tickLine={false} tick={{ fill: "#8b9890", fontSize: 10 }} tickFormatter={(value: number) => value >= 1000 ? `${Math.round(value / 1000)}k` : String(value)} /><Tooltip formatter={(value) => [money(Number(value)), "Amount"]} /><Bar dataKey="amount" fill={content.accent} radius={[8, 8, 2, 2]} maxBarSize={42} /></BarChart> : <AreaChart data={chartData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}><defs><linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={content.accent} stopOpacity={.2} /><stop offset="100%" stopColor={content.accent} stopOpacity={0} /></linearGradient></defs><CartesianGrid vertical={false} stroke="#e9efea" strokeDasharray="4 5" /><XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#8b9890", fontSize: 10 }} dy={8} /><YAxis axisLine={false} tickLine={false} tick={{ fill: "#8b9890", fontSize: 10 }} tickFormatter={(value: number) => value >= 1000 ? `${Math.round(value / 1000)}k` : String(value)} /><Tooltip formatter={(value) => [money(Number(value)), "Amount"]} /><Area type="monotone" dataKey="amount" stroke={content.accent} strokeWidth={2.5} fill="url(#expenseFill)" /></AreaChart>}</ResponsiveContainer> : <div className="chart-empty"><strong>Start with your first {type} record</strong><span>Your activity trend will appear here.</span></div>}</div>
      </section>
      <section className="glass-card records-card"><div className="records-header"><div><h2>All {content.title.toLowerCase()}</h2><span>{filtered.length} records</span></div><Button variant="secondary" className="button-small" onClick={() => void exportSheet()}><Download size={14} /> Export</Button></div>
        {loading ? <div className="loading-card"><span className="spinner" /> Loading records…</div> : <div className="table-scroll"><table className="data-table"><thead><tr><th>DESCRIPTION</th><th>CATEGORY</th><th>DATE</th><th>SOURCE</th><th>AMOUNT</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{filtered.length ? filtered.map((item) => <tr key={item.id}><td>{item.title}</td><td><span className="category-pill">{item.category}</span></td><td>{new Date(item.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}</td><td>{item.source === "cash" ? "Cash" : "Bank"}</td><td className={type === "income" ? "amount-income" : "amount-expense"}>{type === "expense" ? "−" : "+"}{money(item.amount)}</td><td><div className="table-actions"><button className="table-action" aria-label={`Edit ${item.title}`} onClick={() => openEdit(item)}><Pencil size={14} /></button><button className="table-action danger" aria-label={`Delete ${item.title}`} onClick={() => void remove(item)}><Trash2 size={14} /></button></div></td></tr>) : <tr><td colSpan={6} className="table-empty">{sourceFilter === "all" ? `No ${type} records yet. Add one to get started.` : `No ${sourceFilter} records found.`}</td></tr>}</tbody></table></div>}
      </section>

      {modalOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setModalOpen(false); }}><section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="transaction-modal-title"><div className="modal-header"><div><p className="overline">{editing ? "UPDATE RECORD" : "NEW RECORD"}</p><h2 id="transaction-modal-title">{editing ? "Edit" : "Add"} {type}</h2><p>Your balance will update when you save this record.</p></div><button className="icon-button" onClick={() => setModalOpen(false)} aria-label="Close"><X size={18} /></button></div><form className="modal-form" onSubmit={submit}><label className="field"><span>Description</span><input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder={type === "income" ? "Monthly salary" : "Groceries"} required maxLength={191} /></label><div className="form-two-col"><label className="field"><span>Amount (PKR)</span><input type="number" min="0.01" step="0.01" value={draft.amount} onChange={(event) => setDraft({ ...draft, amount: event.target.value })} placeholder="0.00" required /></label><label className="field"><span>Source</span><select value={draft.source} onChange={(event) => setDraft({ ...draft, source: event.target.value as MoneySource })}><option value="cash">Cash</option><option value="bank">Bank</option></select></label></div><label className="field"><span>Category</span><input value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} placeholder="General" maxLength={100} /></label>{error && <p className="notice notice-error">{error}</p>}<div className="modal-actions"><Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button><Button disabled={busy}>{busy ? "Saving…" : editing ? "Save changes" : `Add ${type}`}</Button></div></form></section></div>}
    </div>
  );
}
