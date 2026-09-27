"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Download, FileSpreadsheet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Period = "Daily" | "Weekly" | "Monthly" | "3 Months" | "6 Months";
type Status = "Paid" | "Due" | "Overdue";

type CollectionRecord = {
  customer: string;
  customerId: string;
  phone: string;
  account: string;
  scheme: string;
  frequency: string;
  expected: number;
  paid: number;
  paymentDate: string;
  status: Status;
  collectedBy: string;
};

const records: CollectionRecord[] = [
  { customer: "Rahul Kumar", customerId: "CUS-001", phone: "9876543210", account: "RD-102", scheme: "RD", frequency: "Monthly", expected: 1000, paid: 1000, paymentDate: "25 Sep 2026", status: "Paid", collectedBy: "Amit Sharma" },
  { customer: "Amit Kumar", customerId: "CUS-002", phone: "9876543211", account: "RD-205", scheme: "RD", frequency: "Monthly", expected: 1000, paid: 0, paymentDate: "—", status: "Due", collectedBy: "—" },
  { customer: "Neha Devi", customerId: "CUS-003", phone: "9876543212", account: "RD-301", scheme: "RD", frequency: "Monthly", expected: 2000, paid: 2000, paymentDate: "24 Sep 2026", status: "Paid", collectedBy: "Neha Verma" },
  { customer: "Suresh Yadav", customerId: "CUS-004", phone: "9876543213", account: "PPF-411", scheme: "PPF", frequency: "Yearly", expected: 5000, paid: 0, paymentDate: "—", status: "Overdue", collectedBy: "—" },
];

const periods: Period[] = ["Daily", "Weekly", "Monthly", "3 Months", "6 Months"];
const selectClass = "h-10 appearance-none rounded-lg border border-border bg-background px-3 pr-9 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";
const money = (value: number) => `₹${value.toLocaleString("en-IN")}`;

function PeriodSelect({ period }: { period: Period }) {
  const labels: Record<Period, string> = { Daily: "Select Date", Weekly: "Select Week", Monthly: "Select Month", "3 Months": "Select 3-Month Period", "6 Months": "Select 6-Month Period" };
  return <label className="relative flex min-w-0 flex-1 flex-col gap-1.5 text-xs font-medium text-muted-foreground"><span>{labels[period]}</span><select className={selectClass} defaultValue={period === "Monthly" ? "September 2026" : "Current period"} aria-label={labels[period]}><option>{period === "Monthly" ? "September 2026" : "Current period"}</option><option>August 2026</option><option>July 2026</option></select><ChevronDown className="pointer-events-none absolute bottom-3 right-3 size-4 text-muted-foreground" /></label>;
}

function statusClass(status: Status) {
  return status === "Paid" ? "border-primary/25 bg-primary/10 text-primary" : status === "Overdue" ? "border-destructive/20 bg-destructive/5 text-destructive" : "border-border bg-muted text-muted-foreground";
}

export function ReportsSection() {
  const [period, setPeriod] = useState<Period>("Monthly");
  const [status, setStatus] = useState("All");
  const [frequency, setFrequency] = useState("All");

  const filteredRecords = useMemo(() => records.filter((record) => (status === "All" || record.status === status) && (frequency === "All" || record.frequency === frequency)), [status, frequency]);

  const exportExcel = () => {
    const headers = ["Customer Name", "Customer ID", "Phone", "Account Number", "Scheme", "Frequency", "Expected Amount", "Paid Amount", "Payment Date", "Status", "Collected By"];
    const lines = filteredRecords.map((record) => [record.customer, record.customerId, record.phone, record.account, record.scheme, record.frequency, record.expected, record.paid, record.paymentDate, record.status, record.collectedBy].map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","));
    const blob = new Blob([[headers.join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `JamaSaathi_${period.replaceAll(" ", "-")}_September-2026.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return <section className="flex flex-col gap-5" aria-labelledby="reports-heading">
    <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">Reports</p><h1 id="reports-heading" className="text-2xl font-semibold tracking-tight text-foreground">Reports</h1><p className="mt-1 text-sm text-muted-foreground">View collection records and download reports.</p></div><Button onClick={exportExcel} className="w-fit bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"><Download data-icon="inline-start" />Export Excel</Button></header>

    <Card className="border-border/80 shadow-sm"><CardContent className="space-y-4 p-4 sm:p-5"><div className="flex gap-1 overflow-x-auto border-b border-border pb-3" role="tablist" aria-label="Report period">{periods.map((item) => <button key={item} type="button" role="tab" aria-selected={period === item} onClick={() => setPeriod(item)} className={cn("shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition", period === item ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>{item}</button>)}</div><div className="flex flex-col gap-3 sm:flex-row sm:items-end"><PeriodSelect period={period} /><label className="relative flex min-w-0 flex-1 flex-col gap-1.5 text-xs font-medium text-muted-foreground"><span>Status</span><select className={selectClass} value={status} onChange={(event) => setStatus(event.target.value)}><option>All</option><option>Paid</option><option>Due</option><option>Overdue</option></select><ChevronDown className="pointer-events-none absolute bottom-3 right-3 size-4 text-muted-foreground" /></label><label className="relative flex min-w-0 flex-1 flex-col gap-1.5 text-xs font-medium text-muted-foreground"><span>Frequency</span><select className={selectClass} value={frequency} onChange={(event) => setFrequency(event.target.value)}><option>All</option><option>Daily</option><option>Weekly</option><option>Monthly</option><option>Quarterly</option><option>Half-Yearly</option><option>Yearly</option></select><ChevronDown className="pointer-events-none absolute bottom-3 right-3 size-4 text-muted-foreground" /></label></div></CardContent></Card>

    <Card className="overflow-hidden border-border/80 shadow-sm"><CardHeader className="border-b border-border/70 p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><div><CardTitle className="text-lg">Collection Records</CardTitle><p className="mt-1 text-sm text-muted-foreground">{period === "Monthly" ? "Monthly collection — September 2026" : `${period} collection records`}</p></div><Badge variant="secondary" className="bg-primary/10 text-primary">{filteredRecords.length} records</Badge></div></CardHeader><CardContent className="p-0">{filteredRecords.length === 0 ? <div className="p-10 text-center text-sm text-muted-foreground">No collection records found.</div> : <><div className="hidden overflow-x-auto md:block"><table className="w-full text-sm"><thead className="bg-muted/35 text-left text-xs uppercase tracking-wide text-muted-foreground"><tr>{["Customer", "Customer ID", "Account", "Frequency", "Expected", "Paid", "Payment Date", "Status"].map((heading) => <th key={heading} className="whitespace-nowrap px-5 py-3 font-medium">{heading}</th>)}</tr></thead><tbody>{filteredRecords.map((record) => <tr key={record.account} className="border-t border-border/70"><td className="px-5 py-4 font-medium text-foreground">{record.customer}</td><td className="px-5 py-4 text-muted-foreground">{record.customerId}</td><td className="px-5 py-4 text-muted-foreground">{record.account}</td><td className="px-5 py-4 text-muted-foreground">{record.frequency}</td><td className="px-5 py-4 text-foreground">{money(record.expected)}</td><td className="px-5 py-4 font-medium text-foreground">{record.paid ? money(record.paid) : "—"}</td><td className="px-5 py-4 text-muted-foreground">{record.paymentDate}</td><td className="px-5 py-4"><Badge variant="outline" className={statusClass(record.status)}>{record.status}</Badge></td></tr>)}</tbody></table></div><div className="flex flex-col gap-3 p-4 md:hidden">{filteredRecords.map((record) => <article key={record.account} className="rounded-xl border border-border/70 bg-background p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-medium text-foreground">{record.customer}</h3><p className="mt-1 text-xs text-muted-foreground">{record.customerId} · {record.account} · {record.frequency}</p></div><Badge variant="outline" className={statusClass(record.status)}>{record.status}</Badge></div><div className="mt-4 grid grid-cols-3 gap-3 text-xs"><div><p className="text-muted-foreground">Expected</p><p className="mt-1 font-semibold text-foreground">{money(record.expected)}</p></div><div><p className="text-muted-foreground">Paid</p><p className="mt-1 font-semibold text-foreground">{record.paid ? money(record.paid) : "—"}</p></div><div><p className="text-muted-foreground">Date</p><p className="mt-1 font-semibold text-foreground">{record.paymentDate}</p></div></div></article>)}</div></>}</CardContent></Card>
    <p className="flex items-center gap-2 text-xs text-muted-foreground"><FileSpreadsheet className="size-3.5" />Only approved payments are counted as Paid. Export includes the currently selected filters.</p>
  </section>;
}
