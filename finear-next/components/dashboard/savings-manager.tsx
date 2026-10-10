"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowDownToLine, ArrowUpRight, Pencil, PiggyBank, Plus, Target, Trash2, Wallet, X } from "lucide-react";
import { api, getErrorMessage } from "@/lib/api/client";
import type { DashboardData, GoalPriority, GoalRecord, MoneySource, TransactionRecord } from "@/lib/types/domain";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast-provider";

type SavingsMode = "add-savings" | "withdraw" | "goal" | "contribute";
type GoalDraft = { goalName: string; targetAmount: string; priority: GoalPriority };
const emptyGoal: GoalDraft = { goalName: "", targetAmount: "", priority: "medium" };
const money = (value: number) => new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(value);

export function SavingsManager() {
  const toast = useToast();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [goals, setGoals] = useState<GoalRecord[]>([]);
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<SavingsMode | null>(null);
  const [goal, setGoal] = useState<GoalRecord | null>(null);
  const [goalDraft, setGoalDraft] = useState<GoalDraft>(emptyGoal);
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState<MoneySource>("cash");

  async function load() {
    try {
      setError("");
      const [summaryResponse, goalsResponse, transactionsResponse] = await Promise.all([
        api.get<{ data: DashboardData }>("/dashboard"),
        api.get<{ data: GoalRecord[] }>("/goals"),
        api.get<{ data: { transactions: TransactionRecord[] } }>("/transactions?type=savings"),
      ]);
      setDashboard(summaryResponse.data.data);
      setGoals(goalsResponse.data.data);
      setTransactions(transactionsResponse.data.data.transactions);
    } catch (issue) {
      setError(getErrorMessage(issue, "Savings data could not be loaded."));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api.get<{ data: DashboardData }>("/dashboard"),
      api.get<{ data: GoalRecord[] }>("/goals"),
      api.get<{ data: { transactions: TransactionRecord[] } }>("/transactions?type=savings"),
    ])
      .then(([summaryResponse, goalsResponse, transactionsResponse]) => {
        if (cancelled) return;
        setDashboard(summaryResponse.data.data);
        setGoals(goalsResponse.data.data);
        setTransactions(transactionsResponse.data.data.transactions);
      })
      .catch((issue: unknown) => { if (!cancelled) setError(getErrorMessage(issue, "Savings data could not be loaded.")); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const chartData = useMemo(() => [...transactions].slice(0, 8).reverse().map((transaction) => ({ date: new Date(transaction.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short" }), amount: transaction.amount })), [transactions]);
  const totalGoalSavings = goals.reduce((total, item) => total + item.savedAmount, 0);
  const activeGoals = goals.filter((item) => item.status === "Active");

  function openGoal(item?: GoalRecord) {
    setGoal(item ?? null);
    setGoalDraft(item ? { goalName: item.goalName, targetAmount: String(item.targetAmount), priority: item.priority } : emptyGoal);
    setMode("goal");
  }

  function openMoney(modeValue: "add-savings" | "withdraw" | "contribute", item?: GoalRecord) {
    setGoal(item ?? null);
    setAmount("");
    setSource("cash");
    setMode(modeValue);
  }

  function closeModal() { setMode(null); setGoal(null); setError(""); }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!mode) return;
    setBusy(true);
    setError("");
    try {
      if (mode === "goal") {
        const body = { ...goalDraft, targetAmount: Number(goalDraft.targetAmount) };
        if (goal) await api.patch(`/goals/${goal.id}`, body);
        else await api.post("/goals", body);
      } else if (mode === "add-savings") {
        await api.post("/transactions", { title: "Flexible savings", category: "Savings", type: "savings", amount: Number(amount), source });
      } else if (mode === "withdraw") {
        await api.post("/savings/withdraw", { amount: Number(amount), targetSource: source });
      } else if (goal) {
        await api.post("/goals/contribute", { goalId: goal.id, amount: Number(amount), source });
      }
      const successMessage = mode === "goal"
        ? goal ? "Savings goal updated." : "Savings goal created."
        : mode === "add-savings" ? "Flexible savings updated."
          : mode === "withdraw" ? "Savings moved to your balance."
            : "Goal contribution added.";
      toast.success(successMessage);
      closeModal();
      await load();
    } catch (issue) {
      toast.error(getErrorMessage(issue, "This savings update could not be completed."));
    } finally {
      setBusy(false);
    }
  }

  async function deleteGoal(item: GoalRecord) {
    if (!window.confirm(`Delete “${item.goalName}”? Its saved amount will return to flexible savings.`)) return;
    try {
      await api.delete(`/goals/${item.id}`);
      toast.success("Savings goal deleted.");
      await load();
    } catch (issue) {
      toast.error(getErrorMessage(issue, "This goal could not be deleted."));
    }
  }

  if (loading) return <div className="loading-card"><span className="spinner" /> Loading your savings…</div>;
  return (
    <div className="dashboard-page">
      <div className="page-heading-row"><div><p className="overline">PLAN FOR WHAT MATTERS</p><h1>Make a little room to grow.</h1><p className="page-subtitle">Build your savings and keep your goals within reach.</p></div><Button onClick={() => openGoal()}><Plus size={17} /> Create a goal</Button></div>
      {error && <div className="notice notice-error" role="alert">{error}<button onClick={() => setError("")} aria-label="Dismiss">×</button></div>}
      <section className="savings-summary">
        <article className="stat-card"><div className="stat-card-top"><span className="stat-icon stat-icon-violet"><PiggyBank size={18} /></span><span className="stat-overline">FLEXIBLE SAVINGS</span></div><strong className="stat-value">{money(dashboard?.profile.flexibleSavings ?? 0)}</strong><span className="stat-caption">Available to move anytime</span></article>
        <article className="stat-card"><div className="stat-card-top"><span className="stat-icon stat-icon-green"><Target size={18} /></span><span className="stat-overline">SAVED TOWARD GOALS</span></div><strong className="stat-value">{money(totalGoalSavings)}</strong><span className="stat-caption">Across {goals.length} goals</span></article>
        <article className="stat-card"><div className="stat-card-top"><span className="stat-icon stat-icon-blue"><Wallet size={18} /></span><span className="stat-overline">CASH + BANK</span></div><strong className="stat-value">{money(dashboard?.profile.totalBalance ?? 0)}</strong><span className="stat-caption">Available account balance</span></article>
      </section>

      <section className="glass-card">
        <div className="finance-toolbar"><div><p className="overline">FLEXIBLE SAVINGS</p><h2>A buffer for life’s little surprises</h2><p className="section-hint">Move money in or back to your cash and bank balances.</p></div><div className="finance-actions"><Button variant="secondary" onClick={() => openMoney("withdraw")}><ArrowDownToLine size={16} /> Withdraw</Button><Button onClick={() => openMoney("add-savings")}><Plus size={16} /> Add savings</Button></div></div>
        <div className="finance-chart">{chartData.length ? <ResponsiveContainer width="100%" height="100%"><BarChart data={chartData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}><CartesianGrid vertical={false} stroke="#e9efea" strokeDasharray="4 5" /><XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#8b9890", fontSize: 10 }} dy={8} /><YAxis axisLine={false} tickLine={false} tick={{ fill: "#8b9890", fontSize: 10 }} tickFormatter={(value: number) => value >= 1000 ? `${Math.round(value / 1000)}k` : String(value)} /><Tooltip formatter={(value) => [money(Number(value)), "Amount"]} /><Bar dataKey="amount" fill="#638aaf" radius={[8, 8, 2, 2]} maxBarSize={44} /></BarChart></ResponsiveContainer> : <div className="chart-empty"><span className="chart-empty-icon"><PiggyBank size={20} /></span><strong>Your savings activity will show here</strong><span>Add to flexible savings or contribute to a goal.</span></div>}</div>
      </section>

      <section className="glass-card">
        <div className="finance-toolbar"><div><p className="overline">YOUR PLANS</p><h2>Savings goals</h2><p className="section-hint">{activeGoals.length} active · {goals.filter((item) => item.status === "Completed").length} completed</p></div><Button variant="secondary" onClick={() => openGoal()}><Plus size={15} /> New goal</Button></div>
        {goals.length ? <div className="goal-list">{goals.map((item) => { const progress = Math.min(item.savedAmount / Math.max(item.targetAmount, 1) * 100, 100); return <article className="glass-card goal-card" key={item.id}>
          <div className="goal-card-top"><div><h3>{item.goalName}</h3><div className="goal-card-meta"><span className="priority-pill">{item.priority} priority</span><span>·</span><span>{item.status}</span></div></div><div className="goal-number"><strong>{money(item.savedAmount)}</strong> / {money(item.targetAmount)}</div></div>
          <div className="goal-progress" role="progressbar" aria-label={`${item.goalName} progress`} aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${progress}%` }} /></div>
          <div className="goal-card-bottom"><span>{Math.round(progress)}% complete · {money(Math.max(item.targetAmount - item.savedAmount, 0))} to go</span><div className="goal-card-actions"><Button className="button-small" variant="secondary" disabled={item.status === "Completed"} onClick={() => openMoney("contribute", item)}><Plus size={13} /> Add money</Button><button className="table-action" aria-label={`Edit ${item.goalName}`} onClick={() => openGoal(item)}><Pencil size={14} /></button><button className="table-action danger" aria-label={`Delete ${item.goalName}`} onClick={() => void deleteGoal(item)}><Trash2 size={14} /></button></div></div>
        </article>; })}</div> : <div className="chart-empty goals-empty"><span className="chart-empty-icon"><Target size={20} /></span><strong>Give your savings a destination</strong><span>Create your first goal and track every step toward it.</span><Button className="button-small" onClick={() => openGoal()}><Plus size={14} /> Create a goal</Button></div>}
      </section>

      {mode && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeModal(); }}><section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="savings-modal-title"><div className="modal-header"><div><p className="overline">{mode === "goal" ? "SAVINGS PLAN" : "MONEY MOVEMENT"}</p><h2 id="savings-modal-title">{mode === "goal" ? goal ? "Update your goal" : "Create a savings goal" : mode === "add-savings" ? "Add flexible savings" : mode === "withdraw" ? "Move savings back" : `Add to ${goal?.goalName ?? "goal"}`}</h2><p>{mode === "goal" ? "Choose a target you’re excited to reach." : "Choose an amount and where the money is coming from."}</p></div><button className="icon-button" aria-label="Close" onClick={closeModal}><X size={18} /></button></div>
          <form className="modal-form" onSubmit={submit}>{mode === "goal" ? <><label className="field"><span>Goal name</span><input value={goalDraft.goalName} onChange={(event) => setGoalDraft({ ...goalDraft, goalName: event.target.value })} placeholder="Emergency fund" required maxLength={191} /></label><label className="field"><span>Target amount (PKR)</span><input type="number" min="1" step="0.01" value={goalDraft.targetAmount} onChange={(event) => setGoalDraft({ ...goalDraft, targetAmount: event.target.value })} placeholder="100000" required /></label><label className="field"><span>Priority</span><select value={goalDraft.priority} onChange={(event) => setGoalDraft({ ...goalDraft, priority: event.target.value as GoalPriority })}><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></label></> : <><label className="field"><span>Amount (PKR)</span><input type="number" min="0.01" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00" required /></label><label className="field"><span>{mode === "withdraw" ? "Move to" : "Take from"}</span><select value={source} onChange={(event) => setSource(event.target.value as MoneySource)}><option value="cash">Cash</option><option value="bank">Bank</option></select></label></>}{error && <p className="notice notice-error">{error}</p>}<div className="modal-actions"><Button type="button" variant="ghost" onClick={closeModal}>Cancel</Button><Button disabled={busy}>{busy ? "Saving…" : mode === "goal" ? goal ? "Save changes" : "Create goal" : "Confirm"}</Button></div></form>
        </section></div>}
    </div>
  );
}
