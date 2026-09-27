"use client";

import { useState } from "react";
import { Bell, Check, Clock3, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
const approvalEntries = [
  { id: 1, initials: "RK", customer: "Ramesh Kumar", staff: "Rajesh Meena", cadence: "Daily", amount: "₹4,500", time: "Today, 10:42 AM" },
  { id: 2, initials: "SD", customer: "Sunita Devi", staff: "Priya Sharma", cadence: "Weekly", amount: "₹2,800", time: "Today, 09:18 AM" },
];

export function ApprovalsSection() {
  const [entries, setEntries] = useState(approvalEntries);
  const removeEntry = (id: number) => setEntries((current) => current.filter((entry) => entry.id !== id));

  return (
    <section className="mx-auto w-full space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent-foreground"><Bell aria-hidden="true" /></div>
          <div><p className="text-sm font-medium text-accent-foreground">Review queue</p><h1 className="text-2xl font-semibold tracking-tight text-foreground">Collection approvals</h1><p className="mt-1 text-sm text-muted-foreground">Approve staff collections before they are added to your books.</p></div>
        </div>
        <Badge variant="secondary" className="w-fit rounded-full bg-accent/15 px-3 py-1 text-accent-foreground">{entries.length} pending</Badge>
      </header>

      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-4 sm:px-6"><div><p className="font-semibold text-foreground">Pending entries</p><p className="text-sm text-muted-foreground">{entries.length} collection submissions need your review.</p></div><p className="text-sm font-semibold tabular-nums text-accent-foreground">₹7,300 total</p></div>
        <div className="divide-y divide-border/60">
          {entries.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-6 py-12 text-center"><Check className="size-8 text-accent-foreground" /><p className="font-medium">All caught up</p><p className="text-sm text-muted-foreground">There are no collection entries waiting for approval.</p></div>
          ) : entries.map((entry) => (
            <div key={entry.id} className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:px-6">
              <div className="flex min-w-0 flex-1 items-center gap-3"><div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent/15 text-sm font-semibold text-accent-foreground">{entry.initials}</div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><p className="font-semibold text-foreground">{entry.customer}</p><Badge variant="outline" className="rounded-full border-accent/30 bg-accent/15 text-accent-foreground">{entry.cadence}</Badge></div><p className="truncate text-sm text-muted-foreground">Collected by <span className="font-medium text-foreground/80">{entry.staff}</span></p><p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><Clock3 className="size-3" />{entry.time}</p></div></div>
              <div className="flex items-center justify-between gap-3 sm:justify-end"><p className="text-lg font-semibold tabular-nums text-foreground">{entry.amount}</p><div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => removeEntry(entry.id)} className="border-border text-muted-foreground hover:border-primary/40 hover:bg-accent/15 hover:text-accent-foreground"><X data-icon="inline-start" />Reject</Button><Button size="sm" onClick={() => removeEntry(entry.id)} className="bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"><Check data-icon="inline-start" />Approve</Button></div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
