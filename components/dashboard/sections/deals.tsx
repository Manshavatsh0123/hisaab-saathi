"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  ArrowUpDown,
  ArrowUpRight,
  Banknote,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Filter,
  IndianRupee,
  MoreHorizontal,
  Plus,
  Search,
  UserRound,
  UsersRound,
  WalletCards,
  X,
  XCircle,
} from "lucide-react";

type CollectionStatus = "paid" | "due" | "overdue" | "not-due" | "matured";
type Frequency = "Daily" | "Weekly" | "Monthly" | "Quarterly" | "Half-Yearly" | "Yearly" | "One-Time";

interface CollectionAccount {
  id: string;
  customerId: string;
  customer: string;
  phone: string;
  account: string;
  scheme: string;
  amount: number;
  frequency: Frequency;
  nextDue: string;
  status: CollectionStatus;
  paid: number;
  target: number;
}

const initialAccounts: CollectionAccount[] = [
  { id: "a1", customerId: "CUS-001", customer: "Rahul Kumar", phone: "98XXXXXX21", account: "RD-1001", scheme: "Recurring Deposit", amount: 1000, frequency: "Monthly", nextDue: "26 Sep 2026", status: "paid", paid: 18000, target: 24000 },
  { id: "a2", customerId: "CUS-001", customer: "Rahul Kumar", phone: "98XXXXXX21", account: "RD-1002", scheme: "Recurring Deposit", amount: 500, frequency: "Weekly", nextDue: "26 Sep 2026", status: "due", paid: 8500, target: 12000 },
  { id: "a3", customerId: "CUS-002", customer: "Priya Sharma", phone: "97XXXXXX44", account: "PPF-2001", scheme: "Public Provident Fund", amount: 5000, frequency: "Yearly", nextDue: "15 Mar 2027", status: "not-due", paid: 25000, target: 150000 },
  { id: "a4", customerId: "CUS-003", customer: "Amit Verma", phone: "99XXXXXX08", account: "MIS-3012", scheme: "Monthly Income Scheme", amount: 2000, frequency: "Monthly", nextDue: "20 Sep 2026", status: "overdue", paid: 14000, target: 24000 },
  { id: "a5", customerId: "CUS-004", customer: "Neha Singh", phone: "96XXXXXX76", account: "TD-4050", scheme: "Time Deposit", amount: 10000, frequency: "Half-Yearly", nextDue: "18 Dec 2026", status: "matured", paid: 40000, target: 40000 },
];

const statusConfig: Record<CollectionStatus, { label: string; icon: typeof CheckCircle2; className: string }> = {
  paid: { label: "Paid", icon: CheckCircle2, className: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  due: { label: "Due", icon: Clock3, className: "text-amber-700 bg-amber-50 border-amber-200" },
  overdue: { label: "Overdue", icon: XCircle, className: "text-rose-700 bg-rose-50 border-rose-200" },
  "not-due": { label: "Not due", icon: CalendarDays, className: "text-slate-600 bg-slate-100 border-slate-200" },
  matured: { label: "Matured", icon: CheckCircle2, className: "text-violet-700 bg-violet-50 border-violet-200" },
};

const frequencies: Array<"All frequencies" | Frequency> = ["All frequencies", "Daily", "Weekly", "Monthly", "Quarterly", "Half-Yearly", "Yearly", "One-Time"];

export function DealsSection() {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | CollectionStatus>("all");
  const [frequencyFilter, setFrequencyFilter] = useState<(typeof frequencies)[number]>("All frequencies");
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<CollectionAccount | null>(null);
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState("2026-09-26");
  const [formError, setFormError] = useState("");
  const [sortAscending, setSortAscending] = useState(false);

  const filteredAccounts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const result = accounts.filter((item) => {
      const matchesSearch = [item.customer, item.customerId, item.phone, item.account, item.scheme].some((value) => value.toLowerCase().includes(query));
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      const matchesFrequency = frequencyFilter === "All frequencies" || item.frequency === frequencyFilter;
      return matchesSearch && matchesStatus && matchesFrequency;
    });
    return [...result].sort((a, b) => sortAscending ? a.amount - b.amount : b.amount - a.amount);
  }, [accounts, frequencyFilter, searchQuery, sortAscending, statusFilter]);

  const summary = useMemo(() => ({
    paid: accounts.filter((item) => item.status === "paid").length,
    due: accounts.filter((item) => item.status === "due" || item.status === "overdue").length,
    total: accounts.reduce((sum, item) => sum + item.amount, 0),
  }), [accounts]);

  function openCollection(account: CollectionAccount) {
    setSelectedAccount(account);
    setAmount(String(account.amount));
    setPaymentDate("2026-09-26");
    setFormError("");
    setIsCollectionOpen(true);
  }

  function submitCollection(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      setFormError("Enter an amount greater than ₹0.");
      return;
    }
    if (!selectedAccount) return;
    if (paymentDate > "2026-09-26") {
      setFormError("Future payment dates are not allowed.");
      return;
    }
    setAccounts((current) => current.map((item) => item.id === selectedAccount.id ? { ...item, paid: item.paid + numericAmount, status: numericAmount >= item.amount ? "paid" : "due" } : item));
    setIsCollectionOpen(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">Track every customer account, collection schedule, and payment status separately.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

        <div className="group relative overflow-hidden rounded-2xl border border-[#E8EDE0] bg-[#FCFDF9] p-5 transition-all duration-200 hover:border-[#DCE5C8] hover:shadow-[0_6px_20px_rgba(20,30,10,0.06)]">

          <div className="absolute left-0 top-0 h-full w-[3px] bg-[#99CC00] opacity-80" />

          <div className="flex items-start justify-between gap-4">

            <div className="min-w-0">

              <p className="text-[12px] font-medium text-[#73786D]">
                Total Customers
              </p>

              <p className="mt-2 text-[28px] font-semibold leading-none tracking-[-0.02em] text-[#171914]">
                {new Set(
                  accounts.map((account) => account.customerId)
                ).size}
              </p>

              <p className="mt-2 text-[11px] text-[#858A7E]">
                Active customers
              </p>

            </div>


            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF6D9] text-[#6F9700]">
              <UsersRound className="size-[18px]" />
            </div>

          </div>
        </div>


        <div className="group relative overflow-hidden rounded-2xl border border-[#E8EDE0] bg-[#FCFDF9] p-5 transition-all duration-200 hover:border-[#DCE5C8] hover:shadow-[0_6px_20px_rgba(20,30,10,0.06)]">
          <div className="absolute left-0 top-0  h-full w-[3px]  bg-[#7FA600] opacity-80" />

          <div className="flex items-start justify-between gap-4">

            <div className="min-w-0">

              <p className="text-[12px] font-medium text-[#73786D]">
                Paid This Period
              </p>

              <p className="mt-2 truncate text-[28px] font-semibold leading-none tracking-[-0.02em] text-[#171914]">
                ₹{summary.paid.toLocaleString("en-IN")}
              </p>

              <p className="mt-2 text-[11px] text-[#858A7E]">
                Collections completed
              </p>

            </div>


            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF3D3] text-[#6F9700]">
              <WalletCards className="size-[18px]" />
            </div>

          </div>
        </div>


        {/* EXPECTED COLLECTION */}
        <div
          className="group relative overflow-hidden rounded-2xl border border-[#E8EDE0] bg-[#FCFDF9] p-5 transition-all duration-200 hover:border-[#DCE5C8] hover:shadow-[0_6px_20px_rgba(20,30,10,0.06)]">

          <div className="absolute left-0 top-0 h-full w-[3px] bg-[#A8C94A] opacity-80" />
          <div className="flex items-start justify-between gap-4">

            <div className="min-w-0">

              <p className="text-[12px] font-medium text-[#73786D]">
                Expected Collection
              </p>

              <p className="mt-2 truncate text-[28px] font-semibold leading-none tracking-[-0.02em] text-[#171914]">
                ₹{summary.total.toLocaleString("en-IN")}
              </p>

              <p className="mt-2 text-[11px] text-[#858A7E]">
                Total expected
              </p>

            </div>

            {/* Icon */}
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#F0F6DE] text-[#6F9700]">
              <Banknote className="size-[18px]" />
            </div>

          </div>
        </div>

      </div>

      <div className="flex flex-col items-start justify-between gap-2.5 lg:flex-row lg:items-center lg:gap-4">
        <div className="grid w-full grid-cols-2 gap-2 lg:w-auto lg:flex-1 lg:grid-cols-[minmax(240px,1fr)_160px_150px]">

          <div className="relative col-span-2 lg:col-span-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <input
              aria-label="Search customers and accounts"
              type="search"
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              className="h-11 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none transition-al placeholder:text-muted-foregroun hover:border-border/8 focus:border-accent focus:ring-2 focus:ring-accent/1 lg:h-10 lg:rounded-lg lg:bg-muted/70 lg:focus:bg-background" />
          </div>


          {/* PAYMENT STATUS */}
          <div className="relative">
            <select
              aria-label="Payment Status"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as typeof statusFilter
                )
              }
              className=" h-10 w-full appearance-none rounded-xl border border-border bg-background px-3 pr-8 text-xs font-medium text-foreground outline-none transition-al hover:border-border/8 focus:border-accent focus:ring-2 focus:ring-accent/1 cursor-pointer lg:rounded-lg lg:bg-muted/70 lg:font-semibold lg:focus:bg-background">
              <option value="all">Payment Status</option>
              <option value="paid">Paid</option>
              <option value="due">Due</option>
              <option value="overdue">Overdue</option>
              <option value="not-due">Not Due</option>
              <option value="matured">Matured</option>
            </select>

            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
            />
          </div>


          {/* FREQUENCY */}
          <div className="relative">
            <select
              aria-label="Frequency"
              value={frequencyFilter}
              onChange={(event) =>
                setFrequencyFilter(
                  event.target.value as typeof frequencyFilter
                )
              }
              className="h-10 w-full appearance-none rounded-xl border border-border bg-background px-3 pr-8 text-xs font-medium text-foreground outline-none transition-all hover:border-border/80 focus:border-accent focus:ring-2 focus:ring-accent/15 cursor-pointer lg:rounded-lg lg:bg-muted/70 lg:font-semibold lg:focus:bg-background">
              {frequencies.map((frequency) => (
                <option
                  key={frequency}
                  value={frequency}
                >
                  {frequency === "All frequencies"
                    ? "Frequency"
                    : frequency}
                </option>
              ))}
            </select>

            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          </div>

        </div>

        <button
          type="button"
          onClick={() =>
            accounts[0] && openCollection(accounts[0])
          }
          className="inline-flex  h-10  w-full  shrink-0  items-center  justify-center  gap-2  rounded-xl  bg-[#99CC00]  px-4  text-sm font-semibold  text-white  shadow-sm  transition-all  hover:bg-accent-foreground active:scale-[0.99]  focus:outline-none  focus:ring-2  focus:ring-accent/25  focus:ring-offset-1  lg:w-auto lg:rounded-lg ">
          <Plus className="size-4" />
          Add Collection
        </button>

      </div>

      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">

        {/* HEADER */}
        <div className="flex flex-col justify-between gap-3 border-b border-border/70 bg-card px-4 py-4 sm:flex-row sm:items-center sm:px-5">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Customer collections
            </h2>

            <p className="text-xs text-muted-foreground">
              Payments are linked to both Customer ID and Account ID.
            </p>
          </div>
        </div>

        {/* ===================================================== */}
        {/* DESKTOP + TABLET TABLE */}
        {/* ===================================================== */}

        <div className="hidden md:block overflow-x-auto">
          <table className="deals-table w-full table-fixed text-xs lg:text-sm">

            <thead>
              <tr className="border-b border-border bg-muted/20">

                {[
                  "Customer",
                  "Account",
                  "Collection",
                  "Next due",
                  "Paid / target",
                  "Status",
                  "",
                ].map((heading, index) => (
                  <th
                    key={heading || index}
                    className="
                px-2 py-3
                text-left
                text-[10px]
                font-semibold
                uppercase
                tracking-wider
                text-muted-foreground
                lg:px-4
                lg:text-[11px]
              "
                  >
                    {heading === "Collection" ? (
                      <button
                        type="button"
                        onClick={() =>
                          setSortAscending((value) => !value)
                        }
                        className="inline-flex items-center gap-1"
                      >
                        Collection
                        <ArrowUpDown className="size-3" />
                      </button>
                    ) : (
                      heading
                    )}
                  </th>
                ))}

              </tr>
            </thead>

            <tbody>

              {filteredAccounts.map((item, index) => {
                const config = statusConfig[item.status];
                const StatusIcon = config.icon;

                return (
                  <tr
                    key={item.id}
                    className="
                border-b
                border-border
                last:border-0
                transition
                hover:bg-muted/20
              "
                    style={{
                      animationDelay: `${index * 40}ms`,
                    }}
                  >

                    {/* CUSTOMER */}
                    <td className="px-2 py-4 lg:px-4">
                      <div className="flex items-center gap-2 lg:gap-3">

                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent/60 text-accent-foreground lg:size-9">
                          <UserRound className="size-4" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {item.customer}
                          </p>

                          <p className="truncate text-xs text-muted-foreground">
                            {item.customerId} · {item.phone}
                          </p>
                        </div>

                      </div>
                    </td>

                    {/* ACCOUNT */}
                    <td className="px-2 py-4 lg:px-4">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {item.account}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {item.scheme}
                      </p>
                    </td>

                    {/* COLLECTION */}
                    <td className="px-2 py-4 lg:px-4">
                      <p className="text-sm font-semibold text-foreground">
                        ₹{item.amount.toLocaleString("en-IN")}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {item.frequency}
                      </p>
                    </td>

                    {/* NEXT DUE */}
                    <td className="px-2 py-4 text-sm text-muted-foreground lg:px-4">
                      {item.nextDue}
                    </td>

                    {/* PAID */}
                    <td className="px-2 py-4 lg:px-4">
                      <p className="text-sm font-semibold text-foreground">
                        ₹{item.paid.toLocaleString("en-IN")}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        of ₹{item.target.toLocaleString("en-IN")}
                      </p>
                    </td>

                    {/* STATUS */}
                    <td className="px-2 py-4 lg:px-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs font-medium",
                          config.className
                        )}
                      >
                        <StatusIcon className="size-3.5" />
                        {config.label}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-2 py-4 lg:px-4">
                      <div className="flex items-center gap-1.5">

                        <button
                          type="button"
                          onClick={() => openCollection(item)}
                          className="rounded-lg  bg-[#99CC00]  px-3  py-2  text-xs  font-semibold  text-white  transition  hover:bg-accent-foreground">
                          Collect
                        </button>

                        <button
                          type="button"
                          aria-label={`More actions for ${item.account}`}
                          className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground">
                          <MoreHorizontal className="size-4" />
                        </button>

                      </div>
                    </td>

                  </tr>
                );
              })}

            </tbody>
          </table>

          {/* EMPTY STATE */}
          {filteredAccounts.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-sm font-medium text-foreground">
                No customer accounts found
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Try a different customer, account, status, or frequency filter.
              </p>
            </div>
          )}
        </div>

        {/* MOBILE VIEW */}

        <div className="block md:hidden">

          {filteredAccounts.length > 0 ? (
            <div className="divide-y divide-border">

              {filteredAccounts.map((item, index) => {
                const config = statusConfig[item.status];
                const StatusIcon = config.icon;

                return (
                  <div
                    key={item.id}
                    className="
                p-4
                transition
                hover:bg-muted/20
              "
                    style={{
                      animationDelay: `${index * 40}ms`,
                    }}
                  >

                    {/* TOP ROW */}
                    <div className="flex items-start justify-between gap-3">

                      <div className="flex min-w-0 items-center gap-3">

                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/60 text-accent-foreground">
                          <UserRound className="size-4" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {item.customer}
                          </p>

                          <p className="truncate text-xs text-muted-foreground">
                            {item.customerId} · {item.phone}
                          </p>
                        </div>

                      </div>

                      {/* STATUS */}
                      <span
                        className={cn(
                          "inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-medium",
                          config.className
                        )}
                      >
                        <StatusIcon className="size-3" />
                        {config.label}
                      </span>

                    </div>


                    {/* ACCOUNT */}
                    <div className="mt-4 rounded-xl bg-muted/30 p-3">

                      <div className="flex items-start justify-between gap-3">

                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {item.account}
                          </p>

                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {item.scheme} · {item.frequency}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-semibold text-foreground">
                            ₹{item.amount.toLocaleString("en-IN")}
                          </p>

                          <p className="text-[11px] text-muted-foreground">
                            collection
                          </p>
                        </div>

                      </div>


                      {/* ACCOUNT DETAILS */}
                      <div className="mt-3 grid grid-cols-2 gap-3 border-t border-border/60 pt-3">

                        <div>
                          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                            Next Due
                          </p>

                          <p className="mt-0.5 text-xs font-medium text-foreground">
                            {item.nextDue}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                            Paid
                          </p>

                          <p className="mt-0.5 text-xs font-medium text-foreground">
                            ₹{item.paid.toLocaleString("en-IN")}
                            <span className="ml-1 text-muted-foreground">
                              / ₹{item.target.toLocaleString("en-IN")}
                            </span>
                          </p>
                        </div>

                      </div>

                    </div>


                    {/* ACTIONS */}
                    <div className="mt-3 flex items-center gap-2">

                      <button
                        type="button"
                        onClick={() => openCollection(item)}
                        className="flex-1 rounded-lg bg-accent px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-accent-foreground " >
                        Collect
                      </button>

                      <button
                        type="button"
                        aria-label={`More actions for ${item.account}`}
                        className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground">
                        <MoreHorizontal className="size-4" />
                      </button>

                    </div>

                  </div>
                );
              })}

            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <p className="text-sm font-medium text-foreground">
                No customer accounts found
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Try a different customer, account, status, or frequency filter.
              </p>
            </div>
          )}

        </div>


        {/* FOOTER */}
        <div className="flex flex-col gap-1 border-t border-border bg-muted/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">

          <span className="text-xs text-muted-foreground">
            Showing {filteredAccounts.length} of {accounts.length} accounts ·{" "}
            {summary.due} due or overdue
          </span>

          <span className="text-xs font-medium text-muted-foreground">
            Account-level status
          </span>

        </div>

      </div>

      {isCollectionOpen && selectedAccount && <div role="presentation" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4" onMouseDown={(event) => event.target === event.currentTarget && setIsCollectionOpen(false)}><div role="dialog" aria-modal="true" aria-labelledby="collection-title" className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-wider text-accent">New collection</p><h2 id="collection-title" className="mt-1 text-xl font-semibold text-foreground">Confirm customer account</h2></div><button type="button" aria-label="Close collection dialog" onClick={() => setIsCollectionOpen(false)} className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"><X className="size-4" /></button></div><div className="mt-5 rounded-xl border border-border bg-muted/20 p-4"><div className="grid grid-cols-2 gap-4 text-sm"><div><p className="text-xs text-muted-foreground">Customer</p><p className="mt-1 font-semibold text-foreground">{selectedAccount.customer}</p><p className="text-xs text-muted-foreground">{selectedAccount.customerId} · {selectedAccount.phone}</p></div><div><p className="text-xs text-muted-foreground">Account</p><p className="mt-1 font-semibold text-foreground">{selectedAccount.account}</p><p className="text-xs text-muted-foreground">{selectedAccount.scheme}</p></div></div></div><form onSubmit={submitCollection} className="mt-5 flex flex-col gap-4"><label className="flex flex-col gap-1.5 text-sm font-medium text-foreground">Amount<input inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} className="h-10 rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-accent/600 focus:ring-2 focus:ring-accent/600/15" /><span className="text-xs font-normal text-muted-foreground">Expected: ₹{selectedAccount.amount.toLocaleString("en-IN")} · Partial payments remain due.</span></label><label className="flex flex-col gap-1.5 text-sm font-medium text-foreground">Payment date<input type="date" value={paymentDate} max="2026-09-26" onChange={(event) => setPaymentDate(event.target.value)} className="h-10 rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-accent/600 focus:ring-2 focus:ring-accent/600/15" /></label>{formError && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{formError}</p>}<div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setIsCollectionOpen(false)} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted">Cancel</button><button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-foreground"><IndianRupee className="size-4" />Confirm collection</button></div></form></div></div>}
    </div>
  );
}

export default DealsSection;
