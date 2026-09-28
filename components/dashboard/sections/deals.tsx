"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  ArrowUpDown,
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
const monthOptions = ["September 2026", "October 2026", "November 2026", "December 2026"];
const monthDayCount: Record<string, number> = { "September 2026": 30, "October 2026": 31, "November 2026": 30, "December 2026": 31 };
const customerNames = ["Rahul Kumar", "Priya Sharma", "Amit Verma", "Neha Singh", "Vikash Paswan", "Kajal Sharma", "Manish Kumar", "Pooja Devi", "Savitri Devi", "Deepak Kumar"];
const registerRows = [
  { name: "Rahul Kumar", id: "CUS-001", total: 12000, remark: "Regular", payments: [500, 0, 500, 500, 0, 500, 500, 0, 500, 500, 0, 500, 500, 0, 500, 500, 0, 500, 500, 0, 500, 500, 0, 500, 500, 0, 500, 500, 0, 500, 500] },
  { name: "Priya Sharma", id: "CUS-002", total: 5000, remark: "On time", payments: [0, 0, 5000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  { name: "Amit Verma", id: "CUS-003", total: 9000, remark: "Regular", payments: [300, 300, 0, 300, 300, 0, 300, 300, 0, 300, 300, 0, 300, 300, 0, 300, 300, 0, 300, 300, 0, 300, 300, 0, 300, 300, 0, 300, 300, 0, 300] },
  { name: "Neha Singh", id: "CUS-004", total: 10000, remark: "Pending", payments: [0, 1000, 0, 1000, 1000, 0, 1000, 0, 1000, 1000, 0, 1000, 0, 1000, 1000, 0, 1000, 0, 1000, 1000, 0, 1000, 0, 1000, 1000, 0, 0, 0, 0, 0, 0] },
];
const allRegisterRows = Array.from({ length: 500 }, (_, index) => {
  const base = registerRows[index % registerRows.length];
  const name = index < customerNames.length ? customerNames[index] : `${customerNames[index % customerNames.length]} ${Math.floor(index / customerNames.length) + 1}`;
  return { ...base, name, id: `CUS-${String(index + 1).padStart(3, "0")}`, payments: base.payments.map((payment, day) => payment ? payment + ((index + day) % 3) * 50 : 0), total: base.payments.reduce((sum, payment) => sum + payment, 0) };
});

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
  const [selectedMonth, setSelectedMonth] = useState(monthOptions[0]);
  const [registerPage, setRegisterPage] = useState(1);
  const [registerSearch, setRegisterSearch] = useState("");
  const [registerStatus, setRegisterStatus] = useState<"all" | "paid" | "due">("all");
  const registerPageSize = 10;
  const registerDays = Array.from({ length: monthDayCount[selectedMonth] }, (_, index) => index + 1);

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

  const filteredRegisterRows = useMemo(() => {
    const monthOffset = monthOptions.indexOf(selectedMonth);
    const query = registerSearch.trim().toLowerCase();
    return allRegisterRows.map((row) => {
      const payments = row.payments.slice(0, monthDayCount[selectedMonth]).map((payment, day) => day % 7 === monthOffset + 2 ? 0 : payment);
      return { ...row, payments, total: payments.reduce((sum, payment) => sum + payment, 0) };
    }).filter((row) => {
      const matchesSearch = !query || `${row.name} ${row.id}`.toLowerCase().includes(query);
      const matchesStatus = registerStatus === "all" || (registerStatus === "paid" ? row.total > 0 : row.total === 0);
      return matchesSearch && matchesStatus;
    });
  }, [registerSearch, registerStatus, selectedMonth]);
  const visibleRegisterRows = filteredRegisterRows.slice((registerPage - 1) * registerPageSize, registerPage * registerPageSize);
  const registerTotalPages = Math.max(1, Math.ceil(filteredRegisterRows.length / registerPageSize));
  const registerTotals = useMemo(() => allRegisterRows.reduce((result, row) => { const total = row.payments.reduce((sum, payment) => sum + payment, 0); return { amount: result.amount + total, paid: result.paid + row.payments.filter(Boolean).length }; }, { amount: 0, paid: 0 }), []);
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
        <p className="text-sm text-muted-foreground">Daily payments, customer totals, and collection status in one clear register.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm"><p className="text-xs font-medium text-muted-foreground">Total Customers</p><p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{new Set(accounts.map((account) => account.customerId)).size}</p><p className="mt-1 text-xs text-muted-foreground">Active customers</p></div>
        <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm"><p className="text-xs font-medium text-muted-foreground">Paid This Period</p><p className="mt-2 text-2xl font-semibold tracking-tight text-accent">₹{summary.paid.toLocaleString("en-IN")}</p><p className="mt-1 text-xs text-muted-foreground">Collections completed</p></div>
        <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm"><p className="text-xs font-medium text-muted-foreground">Expected Collection</p><p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">₹{summary.total.toLocaleString("en-IN")}</p><p className="mt-1 text-xs text-muted-foreground">Total expected</p></div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-[#E6EADf] bg-[#FCFDF9] shadow-[0_3px_16px_rgba(20,30,10,0.04)]">

        {/* =========================================================
      HEADER
  ========================================================= */}
        <div className="border-b border-[#E8ECE2]">

          <div className="flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-center lg:justify-between">

            {/* TITLE */}
            <div>
              <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-[#171914]">
                Daily Collection Register
              </h2>

              <p className="mt-1 text-[11px] text-[#858A7E]">
                Customer-wise collection for {selectedMonth}
              </p>
            </div>


            {/* FILTERS */}
            <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:items-center">

              {/* SEARCH */}
              <div className="relative col-span-2 sm:w-[220px]">

                <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[#9AA095]" />

                <input
                  aria-label="Search register customers"
                  value={registerSearch}
                  onChange={(event) => {
                    setRegisterSearch(event.target.value);
                    setRegisterPage(1);
                  }}
                  placeholder="Search customer..."
                  className="
              h-10
              w-full
              rounded-xl
              border
              border-[#E4E8DE]
              bg-white
              pl-9
              pr-3
              text-xs
              text-[#171914]
              outline-none
              placeholder:text-[#A3A79F]
              transition
              focus:border-[#B7D56A]
              focus:ring-2
              focus:ring-[#99CC00]/10
            "
                />

              </div>


              {/* MONTH */}
              <div className="relative">

                <select
                  aria-label="Collection month"
                  value={selectedMonth}
                  onChange={(event) => {
                    setSelectedMonth(event.target.value);
                    setRegisterPage(1);
                  }}
                  className="
              h-10
              min-w-[145px]
              appearance-none
              rounded-xl
              border
              border-[#E4E8DE]
              bg-white
              px-3
              pr-8
              text-xs
              font-medium
              text-[#34382F]
              outline-none
              transition
              hover:border-[#D4DAC9]
              focus:border-[#B7D56A]
              focus:ring-2
              focus:ring-[#99CC00]/10
            "
                >
                  {monthOptions.map((month) => (
                    <option key={month}>{month}</option>
                  ))}
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-[#858A7E]" />

              </div>


              {/* STATUS */}
              <div className="relative">

                <select
                  aria-label="Register payment status"
                  value={registerStatus}
                  onChange={(event) => {
                    setRegisterStatus(
                      event.target.value as typeof registerStatus
                    );
                    setRegisterPage(1);
                  }}
                  className="
              h-10
              min-w-[125px]
              appearance-none
              rounded-xl
              border
              border-[#E4E8DE]
              bg-white
              px-3
              pr-8
              text-xs
              font-medium
              text-[#34382F]
              outline-none
              transition
              hover:border-[#D4DAC9]
              focus:border-[#B7D56A]
              focus:ring-2
              focus:ring-[#99CC00]/10
            "
                >
                  <option value="all">All payments</option>
                  <option value="paid">Paid</option>
                  <option value="due">No payment</option>
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-[#858A7E]" />

              </div>

            </div>

          </div>


          {/* SIMPLE LEGEND */}
          <div className="flex items-center justify-between border-t border-[#F0F2EC] px-5 py-2.5">

            <div className="flex items-center gap-4">

              <span className="flex items-center gap-1.5 text-[10px] font-medium text-[#73786D]">
                <span className="size-2 rounded-full bg-[#99CC00]" />
                Paid
              </span>

              <span className="flex items-center gap-1.5 text-[10px] font-medium text-[#858A7E]">
                <span className="size-2 rounded-full bg-[#D9DDD5]" />
                No payment
              </span>

            </div>

            <span className="text-[10px] font-medium text-[#858A7E]">
              {filteredRegisterRows.length} customers
            </span>

          </div>

        </div>


        {/* =========================================================
      MOBILE VIEW
  ========================================================= */}
        <div className="grid gap-2.5 p-3 lg:hidden">

          {visibleRegisterRows.map((row) => {

            const paidDays = row.payments.filter(Boolean).length;

            const lastPaymentDay = row.payments.reduce(
              (last, payment, index) =>
                payment ? index + 1 : last,
              0
            );

            return (
              <article
                key={row.id}
                className="
            rounded-xl
            border
            border-[#E7EBE1]
            bg-white
            p-4
          "
              >

                {/* CUSTOMER */}
                <div className="flex items-center justify-between gap-3">

                  <div className="min-w-0">

                    <p className="truncate text-sm font-semibold text-[#171914]">
                      {row.name}
                    </p>

                    <p className="mt-0.5 text-[10px] text-[#858A7E]">
                      {row.id}
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-sm font-semibold text-[#171914]">
                      ₹{row.total.toLocaleString("en-IN")}
                    </p>

                    <p className="text-[9px] text-[#858A7E]">
                      Total
                    </p>

                  </div>

                </div>


                {/* DETAILS */}
                <div className="mt-4 grid grid-cols-2 gap-2">

                  <div className="rounded-lg bg-[#F6F8F3] p-2.5">

                    <p className="text-[9px] text-[#858A7E]">
                      Paid days
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#6F9700]">
                      {paidDays}
                    </p>

                  </div>


                  <div className="rounded-lg bg-[#F6F8F3] p-2.5">

                    <p className="text-[9px] text-[#858A7E]">
                      Last payment
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#34382F]">
                      {lastPaymentDay
                        ? `Day ${lastPaymentDay}`
                        : "—"}
                    </p>

                  </div>

                </div>

              </article>
            );
          })}

        </div>


        {/* =========================================================
      DESKTOP TABLE
  ========================================================= */}
        <div className="hidden overflow-x-auto lg:block">

          <table
            className="
        w-full
        min-w-[1080px]
        table-fixed
        border-collapse
        text-xs
      "
          >

            <colgroup>

              {/* CUSTOMER */}
              <col className="w-[220px]" />

              {/* DAYS */}
              {registerDays.map((day) => (
                <col key={day} className="w-[42px]" />
              ))}

              {/* TOTAL */}
              <col className="w-[110px]" />

            </colgroup>


            {/* =====================================================
          HEADER
      ===================================================== */}
            <thead>

              <tr className="border-b border-[#E5E9DF] bg-[#F7F9F4]">

                {/* CUSTOMER */}
                <th
                  className="
              sticky
              left-0
              z-20
              border-r
              border-[#E5E9DF]
              bg-[#F7F9F4]
              px-4
              py-3
              text-left
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.08em]
              text-[#73786D]
            "
                >
                  Customer
                </th>


                {/* DAYS */}
                {registerDays.map((day) => {

                  const isToday =
                    day === 28 &&
                    selectedMonth === "September 2026";

                  return (
                    <th
                      key={day}
                      className={cn(
                        `
                    border-l
                    border-[#EDF0E9]
                    px-0
                    py-3
                    text-center
                    text-[10px]
                    font-semibold
                    text-[#73786D]
                  `,
                        isToday && "bg-[#EEF6D9] text-[#6F9700]"
                      )}
                    >

                      <span>
                        {day}
                      </span>

                      {isToday && (
                        <span className="mt-0.5 block text-[6px] font-bold uppercase tracking-wide text-[#6F9700]">
                          Today
                        </span>
                      )}

                    </th>
                  );
                })}


                {/* TOTAL */}
                <th
                  className="
              sticky
              right-0
              z-20
              border-l
              border-[#E5E9DF]
              bg-[#F7F9F4]
              px-3
              py-3
              text-right
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.08em]
              text-[#73786D]
            "
                >
                  Total
                </th>

              </tr>

            </thead>


            {/* =====================================================
          BODY
      ===================================================== */}
            <tbody>

              {visibleRegisterRows.map((row) => (

                <tr
                  key={row.id}
                  className="
              group
              h-[58px]
              border-b
              border-[#EEF0EA]
              last:border-0
              hover:bg-[#FAFBF8]
            "
                >

                  {/* =================================================
                CUSTOMER
            ================================================= */}
                  <td
                    className="
                sticky
                left-0
                z-10
                border-r
                border-[#E5E9DF]
                bg-[#FCFDF9]
                px-4
                py-3
                group-hover:bg-[#FAFBF8]
              "
                  >

                    <div className="min-w-0">

                      <p className="truncate text-xs font-semibold text-[#171914]">
                        {row.name}
                      </p>

                      <p className="mt-0.5 text-[9px] text-[#858A7E]">
                        {row.id}
                      </p>

                    </div>

                  </td>


                  {/* =================================================
                DAILY PAYMENTS
            ================================================= */}
                  {row.payments.map((payment, dayIndex) => {

                    const isToday =
                      dayIndex + 1 === 28 &&
                      selectedMonth === "September 2026";

                    return (
                      <td
                        key={`${row.id}-${dayIndex}`}
                        className={cn(
                          `
                      border-l
                      border-[#EEF0EA]
                      px-1
                      py-2
                      text-center
                    `,
                          isToday && "bg-[#F4F8EB]"
                        )}
                      >

                        {payment > 0 ? (

                          <div
                            className="
                        mx-auto
                        flex
                        h-7
                        w-[34px]
                        items-center
                        justify-center
                        rounded-md
                        bg-[#EEF6D9]
                        text-[9px]
                        font-semibold
                        text-[#5E7900]
                      "
                          >
                            {payment.toLocaleString("en-IN")}
                          </div>

                        ) : (

                          <div
                            className="
                        mx-auto
                        flex
                        h-7
                        w-[34px]
                        items-center
                        justify-center
                        rounded-md
                        bg-[#F4F5F2]
                        text-[10px]
                        text-[#B0B5AB]
                      "
                          >
                            —
                          </div>

                        )}

                      </td>
                    );

                  })}


                  {/* =================================================
                TOTAL
            ================================================= */}
                  <td
                    className="
                sticky
                right-0
                z-10
                border-l
                border-[#E5E9DF]
                bg-[#F7F9F4]
                px-3
                py-3
                text-right
                group-hover:bg-[#F2F5ED]
              "
                  >

                    <span className="text-xs font-semibold text-[#171914]">
                      ₹{row.total.toLocaleString("en-IN")}
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>


        {/* =========================================================
      FOOTER / PAGINATION
  ========================================================= */}
        <div
          className="
      flex
      flex-col
      gap-3
      border-t
      border-[#E7EBE1]
      bg-[#FAFBF8]
      px-4
      py-3
      sm:flex-row
      sm:items-center
      sm:justify-between
    "
        >

          <p className="text-[10px] text-[#858A7E]">

            Showing{" "}

            <span className="font-medium text-[#5F6558]">
              {filteredRegisterRows.length === 0
                ? 0
                : (registerPage - 1) * registerPageSize + 1}
              –
              {Math.min(
                registerPage * registerPageSize,
                filteredRegisterRows.length
              )}
            </span>{" "}

            of{" "}

            <span className="font-medium text-[#5F6558]">
              {filteredRegisterRows.length}
            </span>

          </p>


          <div className="flex items-center gap-2">

            <button
              type="button"
              disabled={registerPage === 1}
              onClick={() =>
                setRegisterPage((page) => page - 1)
              }
              className="
          rounded-lg
          border
          border-[#DEE4D8]
          bg-white
          px-3
          py-1.5
          text-[10px]
          font-medium
          text-[#5F6558]
          transition
          hover:bg-[#F3F6ED]
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
            >
              Previous
            </button>


            <span
              className="
          rounded-lg
          bg-[#EEF6D9]
          px-3
          py-1.5
          text-[10px]
          font-semibold
          text-[#6F9700]
        "
            >
              {registerPage} / {registerTotalPages}
            </span>


            <button
              type="button"
              disabled={registerPage === registerTotalPages}
              onClick={() =>
                setRegisterPage((page) => page + 1)
              }
              className="
          rounded-lg
          border
          border-[#DEE4D8]
          bg-white
          px-3
          py-1.5
          text-[10px]
          font-medium
          text-[#5F6558]
          transition
          hover:bg-[#F3F6ED]
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
            >
              Next
            </button>

          </div>

        </div>


        {/* =========================================================
      SUMMARY
  ========================================================= */}
        <div className="grid border-t border-[#E7EBE1] bg-white sm:grid-cols-3">

          <div className="border-b border-[#EEF0EA] px-5 py-4 sm:border-b-0 sm:border-r">

            <p className="text-[9px] font-medium uppercase tracking-[0.08em] text-[#858A7E]">
              Total Collection
            </p>

            <p className="mt-1 text-lg font-semibold tracking-tight text-[#171914]">
              ₹{registerTotals.amount.toLocaleString("en-IN")}
            </p>

          </div>


          <div className="border-b border-[#EEF0EA] px-5 py-4 sm:border-b-0 sm:border-r">

            <p className="text-[9px] font-medium uppercase tracking-[0.08em] text-[#858A7E]">
              Paid Entries
            </p>

            <p className="mt-1 text-lg font-semibold tracking-tight text-[#6F9700]">
              {registerTotals.paid}
            </p>

          </div>


          <div className="px-5 py-4">

            <p className="text-[9px] font-medium uppercase tracking-[0.08em] text-[#858A7E]">
              Pending Entries
            </p>

            <p className="mt-1 text-lg font-semibold tracking-tight text-[#171914]">
              {allRegisterRows.reduce(
                (sum, row) =>
                  sum +
                  row.payments.filter(
                    (payment) => !payment
                  ).length,
                0
              )}
            </p>

          </div>

        </div>

      </section>

      <div className="hidden overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-border/70 bg-card px-4 py-4 sm:flex-row sm:items-center sm:px-5"><div><h2 className="text-sm font-semibold text-foreground">Customer collections</h2><p className="text-xs text-muted-foreground">Payments are linked to both Customer ID and Account ID.</p></div></div>
        <div className="overflow-hidden"><table className="deals-table w-full table-fixed text-xs lg:text-sm"><thead><tr className="border-b border-border bg-muted/20">{["Customer", "Account", "Collection", "Next due", "Paid / target", "Status", ""].map((heading, index) => <th key={heading || index} className="px-2 py-3 text-left text-[10px] lg:px-4 lg:text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{heading === "Collection" ? <button type="button" onClick={() => setSortAscending((value) => !value)} className="inline-flex items-center gap-1">Collection <ArrowUpDown className="size-3" /></button> : heading}</th>)}</tr></thead><tbody>{filteredAccounts.map((item, index) => { const config = statusConfig[item.status]; const StatusIcon = config.icon; return <tr key={item.id} className="border-b border-border last:border-0 transition hover:bg-muted/20" style={{ animationDelay: `${index * 40}ms` }}><td className="px-2 py-4 lg:px-4"><div className="flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded-lg bg-accent/60 text-accent-foreground"><UserRound className="size-4" /></div><div><p className="text-sm font-semibold text-foreground">{item.customer}</p><p className="text-xs text-muted-foreground">{item.customerId} · {item.phone}</p></div></div></td><td className="px-2 py-4 lg:px-4"><p className="text-sm font-semibold text-foreground">{item.account}</p><p className="text-xs text-muted-foreground">{item.scheme}</p></td><td className="px-2 py-4 lg:px-4"><p className="text-sm font-semibold text-foreground">₹{item.amount.toLocaleString("en-IN")}</p><p className="text-xs text-muted-foreground">{item.frequency}</p></td><td className="px-2 py-4 lg:px-4 text-sm text-muted-foreground">{item.nextDue}</td><td className="px-2 py-4 lg:px-4"><p className="text-sm font-semibold text-foreground">₹{item.paid.toLocaleString("en-IN")}</p><p className="text-xs text-muted-foreground">of ₹{item.target.toLocaleString("en-IN")}</p></td><td className="px-2 py-4 lg:px-4"><span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium", config.className)}><StatusIcon className="size-3.5" />{config.label}</span></td><td className="px-2 py-4 lg:px-4"><div className="flex items-center gap-2"><button type="button" onClick={() => openCollection(item)} className="rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-white transition hover:bg-accent-foreground">Collect</button><button type="button" aria-label={`More actions for ${item.account}`} className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"><MoreHorizontal className="size-4" /></button></div></td></tr>; })}</tbody></table>{filteredAccounts.length === 0 && <div className="px-6 py-12 text-center"><p className="text-sm font-medium text-foreground">No customer accounts found</p><p className="mt-1 text-xs text-muted-foreground">Try a different customer, account, status, or frequency filter.</p></div>}</div>
        <div className="flex items-center justify-between border-t border-border bg-muted/20 px-4 py-3"><span className="text-xs text-muted-foreground">Showing {filteredAccounts.length} of {accounts.length} accounts · {summary.due} due or overdue</span><span className="text-xs font-medium text-muted-foreground">Account-level status</span></div>
      </div>

      {isCollectionOpen && selectedAccount && <div role="presentation" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4" onMouseDown={(event) => event.target === event.currentTarget && setIsCollectionOpen(false)}><div role="dialog" aria-modal="true" aria-labelledby="collection-title" className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-wider text-accent">New collection</p><h2 id="collection-title" className="mt-1 text-xl font-semibold text-foreground">Confirm customer account</h2></div><button type="button" aria-label="Close collection dialog" onClick={() => setIsCollectionOpen(false)} className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"><X className="size-4" /></button></div><div className="mt-5 rounded-xl border border-border bg-muted/20 p-4"><div className="grid grid-cols-2 gap-4 text-sm"><div><p className="text-xs text-muted-foreground">Customer</p><p className="mt-1 font-semibold text-foreground">{selectedAccount.customer}</p><p className="text-xs text-muted-foreground">{selectedAccount.customerId} · {selectedAccount.phone}</p></div><div><p className="text-xs text-muted-foreground">Account</p><p className="mt-1 font-semibold text-foreground">{selectedAccount.account}</p><p className="text-xs text-muted-foreground">{selectedAccount.scheme}</p></div></div></div><form onSubmit={submitCollection} className="mt-5 flex flex-col gap-4"><label className="flex flex-col gap-1.5 text-sm font-medium text-foreground">Amount<input inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} className="h-10 rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-accent/600 focus:ring-2 focus:ring-accent/600/15" /><span className="text-xs font-normal text-muted-foreground">Expected: ₹{selectedAccount.amount.toLocaleString("en-IN")} · Partial payments remain due.</span></label><label className="flex flex-col gap-1.5 text-sm font-medium text-foreground">Payment date<input type="date" value={paymentDate} max="2026-09-26" onChange={(event) => setPaymentDate(event.target.value)} className="h-10 rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-accent/600 focus:ring-2 focus:ring-accent/600/15" /></label>{formError && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{formError}</p>}<div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setIsCollectionOpen(false)} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted">Cancel</button><button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-foreground"><IndianRupee className="size-4" />Confirm collection</button></div></form></div></div>}
    </div>
  );
}

export default DealsSection;
