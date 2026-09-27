"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  CheckCircle2,
  Eye,
  Mail,
  KeyRound,
  MoreHorizontal,
  Pencil,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/dashboard/metric-card";
import { Input } from "@/components/ui/input";

interface StaffMember {
  id: string;
  name: string;
  username: string;
  phone: string;
  email: string;
  status: "Active" | "Inactive";
  createdDate: string;
  totalCollection: number;
  pendingApproval: number;
  todayCollection: number;
}

const initialStaff: StaffMember[] = [
  { id: "STF-0001", name: "Rahul Kumar", username: "rahul01", phone: "+91 98765 43210", email: "rahul@company.com", status: "Active", createdDate: "12 Jun 2024", totalCollection: 184500, todayCollection: 12500, pendingApproval: 2 },
  { id: "STF-0002", name: "Priya Sharma", username: "priya02", phone: "+91 98123 45678", email: "priya@company.com", status: "Active", createdDate: "18 Jun 2024", totalCollection: 142300, todayCollection: 8400, pendingApproval: 1 },
  { id: "STF-0003", name: "Amit Verma", username: "amit03", phone: "+91 97654 32109", email: "amit@company.com", status: "Inactive", createdDate: "02 May 2024", totalCollection: 98500, todayCollection: 0, pendingApproval: 0 },
];

const emptyForm = { name: "", phone: "", email: "", username: "", password: "", confirmPassword: "", status: "Active" as StaffMember["status"] };

export function TeamSection() {
  const [staff, setStaff] = useState(initialStaff);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Today's Collection");
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const filteredStaff = useMemo(
    () => staff.filter((member) => `${member.name} ${member.username} ${member.id} ${member.phone}`.toLowerCase().includes(search.toLowerCase()) && (statusFilter === "All" || member.status === statusFilter)).sort((a, b) => sortBy === "Name" ? a.name.localeCompare(b.name) : sortBy === "Pending Approvals" ? b.pendingApproval - a.pendingApproval : sortBy === "Total Collection" ? b.totalCollection - a.totalCollection : sortBy === "This Month" ? b.totalCollection - a.totalCollection : b.todayCollection - a.todayCollection),
    [search, staff],
  );

  const updateForm = (field: keyof typeof emptyForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  };

  const createStaff = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim() || !form.username.trim() || !form.password) return setError("Name, username, and password are required.");
    if (!/^\\+?[0-9 ()-]{10,}$/.test(form.phone)) return setError("Enter a valid phone number.");
    if (staff.some((member) => member.username.toLowerCase() === form.username.trim().toLowerCase())) return setError("This username is already in use.");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match.");

    const nextId = `STF-${String(staff.length + 1).padStart(4, "0")}`;
    setStaff((current) => [...current, { id: nextId, name: form.name.trim(), username: form.username.trim(), phone: form.phone.trim(), email: form.email.trim(), status: form.status, createdDate: "Today", totalCollection: 0, todayCollection: 0, pendingApproval: 0 }]);
    setForm(emptyForm);
    setIsFormOpen(false);
    setError("");
  };

  const toggleStatus = (id: string) => setStaff((current) => current.map((member) => member.id === id ? { ...member, status: member.status === "Active" ? "Inactive" : "Active" } : member));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-accent">Admin workspace</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">Collection Agents</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage collection access, activity and approvals.</p>
        </div>
        <Button onClick={() => { setIsFormOpen(true); setSelectedStaff(null); }} className="bg-[#99CC00] text-accent-foreground shadow-sm hover:bg-accent/90">
          <Plus data-icon="inline-start" /> Add Agent
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

        {/* TOTAL FIELD AGENTS */}
        <div
          className="group relative overflow-hidden rounded-2xl border border-[#E8EDE0] bg-[#FCFDF9] p-5 transition-all duration-200 hover:border-[#DCE5C8] hover:shadow-[0_6px_20px_rgba(20,30,10,0.06)]">
          <div className="absolute left-0 top-0 h-full w-[3px] bg-[#99CC00] opacity-80"/>

          <div className="flex items-start justify-between gap-4">

            <div className="min-w-0">

              <p className="text-[12px] font-medium text-[#73786D]">
                Total Field Agents
              </p>

              <p className="mt-2 text-[28px] font-semibold leading-none tracking-[-0.02em] text-[#171914]">
                {staff.length}
              </p>

              <p className="mt-2 text-[11px] text-[#858A7E]">
                People with access
              </p>

            </div>

            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF6D9] text-[#6F9700]">
              <Users className="size-[18px]" />
            </div>

          </div>
        </div>


        {/* ACTIVE FIELD AGENTS */}
        <div
          className="group relative overflow-hidden rounded-2xl border border-[#E8EDE0] bg-[#FCFDF9] p-5 transition-all duration-200 hover:border-[#DCE5C8] hover:shadow-[0_6px_20px_rgba(20,30,10,0.06)]">
          <div className="absolute left-0 top-0  h-full w-[3px]  bg-[#7FA600]  opacity-80"/>

          <div className="flex items-start justify-between gap-4">

            <div className="min-w-0">

              <p className="text-[12px] font-medium text-[#73786D]">
                Active Field Agents
              </p>

              <p className="mt-2 text-[28px] font-semibold leading-none tracking-[-0.02em] text-[#171914]">
                {
                  staff.filter(
                    (member) => member.status === "Active"
                  ).length
                }
              </p>

              <p className="mt-2 text-[11px] text-[#858A7E]">
                Currently working
              </p>

            </div>

            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF3D3] text-[#6F9700]">
              <CheckCircle2 className="size-[18px]" />
            </div>

          </div>
        </div>


        {/* INACTIVE FIELD AGENTS */}
        <div
          className="group relative overflow-hidden rounded-2xl border border-[#E8EDE0] bg-[#FCFDF9] p-5 transition-all duration-200 hover:border-[#DCE5C8] hover:shadow-[0_6px_20px_rgba(20,30,10,0.06)]">
          <div
            className="absolute left-0 top-0 h-full w-[3px] bg-[#A8B58A] opacity-80" />

          <div className="flex items-start justify-between gap-4">

            <div className="min-w-0">

              <p className="text-[12px] font-medium text-[#73786D]">
                Inactive Field Agents
              </p>

              <p className="mt-2 text-[28px] font-semibold leading-none tracking-[-0.02em] text-[#171914]">
                {
                  staff.filter(
                    (member) => member.status === "Inactive"
                  ).length
                }
              </p>

              <p className="mt-2 text-[11px] text-[#858A7E]">
                Access paused
              </p>

            </div>

            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#F1F3EB] text-[#68705D]">
              <ShieldCheck className="size-[18px]" />
            </div>

          </div>
        </div>


        {/* PENDING APPROVALS */}
        <div
          className="group relative overflow-hidden rounded-2xl border border-[#E8EDE0] bg-[#FCFDF9] p-5 transition-all duration-200 hover:border-[#DCE5C8] hover:shadow-[0_6px_20px_rgba(20,30,10,0.06)]">
          <div className="absolute left-0 top-0 h-full w-[3px] bg-[#B8C96A] opacity-80"/>

          <div className="flex items-start justify-between gap-4">

            <div className="min-w-0">

              <p className="text-[12px] font-medium text-[#73786D]">
                Pending Approvals
              </p>

              <p className="mt-2 text-[28px] font-semibold leading-none tracking-[-0.02em] text-[#171914]">
                {
                  staff.reduce(
                    (total, member) =>
                      total + member.pendingApproval,
                    0
                  )
                }
              </p>

              <p className="mt-2 text-[11px] text-[#858A7E]">
                Need your review
              </p>

            </div>

            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#F2F5DF] text-[#718600]">
              <Activity className="size-[18px]" />
            </div>

          </div>
        </div>

      </div>

      <Card className="overflow-hidden rounded-xl border-border bg-card shadow-sm">
        <CardHeader className="flex flex-col gap-4 border-b border-border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div><CardTitle className="text-base">Collection Agents</CardTitle><p className="mt-1 text-xs text-muted-foreground">Manage collection access, activity and approvals.</p></div>
          <div className="grid w-full gap-2 sm:grid-cols-[minmax(220px,1fr)_130px_170px] sm:w-auto"><div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search agents..." className="border-border bg-muted/60 pl-9" /></div><select aria-label="Filter by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-10 rounded-md border border-border bg-muted/60 px-3 text-sm"><option>All</option><option>Active</option><option>Inactive</option></select><select aria-label="Sort agents" value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="h-10 rounded-md border border-border bg-muted/60 px-3 text-sm"><option>Today's Collection</option><option>This Month</option><option>Total Collection</option><option>Pending Approvals</option><option>Name</option></select></div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid gap-3 p-3 md:hidden">
            {filteredStaff.map((member) => <StaffCard key={member.id} member={member} onView={setSelectedStaff} onToggle={toggleStatus} />)}
          </div>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full table-fixed text-xs lg:text-sm"><thead><tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground"><th className="px-3 py-3 lg:px-5">Staff</th><th className="px-3 py-3 lg:px-5">Phone</th><th className="px-3 py-3 lg:px-5">Status</th><th className="px-3 py-3 lg:px-5">Today</th><th className="px-3 py-3 lg:px-5">This Month</th><th className="px-3 py-3 lg:px-5">Pending</th><th className="px-3 py-3 lg:px-5">Actions</th></tr></thead><tbody>{filteredStaff.map((member) => <tr key={member.id} className="border-b border-border last:border-0 hover:bg-muted/30"><td className="px-3 py-4 lg:px-5"><button onClick={() => setSelectedStaff(member)} className="text-left"><p className="font-medium text-foreground hover:text-accent">{member.name}</p><p className="text-xs text-muted-foreground">{member.id} · @{member.username}</p></button></td><td className="px-3 py-4 lg:px-5 text-muted-foreground">{member.phone}</td><td className="px-3 py-4 lg:px-5"><StatusBadge status={member.status} /></td><td className="px-3 py-4 lg:px-5 font-medium text-foreground">₹{member.todayCollection.toLocaleString("en-IN")}</td><td className="px-3 py-4 lg:px-5 font-medium text-foreground">₹{member.totalCollection.toLocaleString("en-IN")}</td><td className="px-3 py-4 lg:px-5 text-muted-foreground">{member.pendingApproval}</td><td className="px-3 py-4 lg:px-5"><div className="flex items-center gap-1"><Button variant="ghost" size="icon" onClick={() => setSelectedStaff(member)} aria-label={`View ${member.name}`}><Eye /></Button><Button variant="ghost" size="sm" onClick={() => setSelectedStaff(member)}>View</Button><Button variant="ghost" size="icon" onClick={() => toggleStatus(member.id)} aria-label={`${member.status === "Active" ? "Deactivate" : "Activate"} ${member.name}`}><MoreHorizontal /></Button></div></td></tr>)}</tbody></table>
          </div>
          {filteredStaff.length === 0 && <p className="p-8 text-center text-sm text-muted-foreground">No field agents found.</p>}
        </CardContent>
      </Card>

      {isFormOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4"><Card className="max-h-[90vh] w-full max-w-2xl overflow-y-auto border-border bg-card shadow-xl"><CardHeader className="flex flex-row items-center justify-between border-b border-border"><div><CardTitle>Add field agent</CardTitle><p className="mt-1 text-sm text-muted-foreground">Create secure login access for a field agent.</p></div><Button variant="ghost" size="icon" onClick={() => setIsFormOpen(false)} aria-label="Close"><X /></Button></CardHeader><form onSubmit={createStaff}><CardContent className="grid gap-5 p-5"><div className="grid gap-4 sm:grid-cols-2"><Field label="Full name *"><Input value={form.name} onChange={(event) => updateForm("name", event.target.value)} placeholder="Rahul Kumar" /></Field><Field label="Phone number"><Input value={form.phone} onChange={(event) => updateForm("phone", event.target.value)} placeholder="+91 98765 43210" /></Field><Field label="Email"><Input type="email" value={form.email} onChange={(event) => updateForm("email", event.target.value)} placeholder="name@company.com" /></Field><Field label="Username *"><Input value={form.username} onChange={(event) => updateForm("username", event.target.value)} placeholder="rahul01" /></Field><Field label="Password *"><Input type="password" value={form.password} onChange={(event) => updateForm("password", event.target.value)} /></Field><Field label="Confirm password *"><Input type="password" value={form.confirmPassword} onChange={(event) => updateForm("confirmPassword", event.target.value)} /></Field></div><div className="flex flex-wrap gap-2"><span className="mr-2 self-center text-sm font-medium">Status</span>{(["Active", "Inactive"] as const).map((status) => <Button key={status} type="button" variant={form.status === status ? "default" : "outline"} onClick={() => updateForm("status", status)} className={form.status === status ? "bg-accent text-accent-foreground hover:bg-accent/90" : ""}>{status}</Button>)}</div>{error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}</CardContent><div className="flex justify-end gap-2 border-t border-border p-5"><Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button><Button type="submit" className="bg-accent text-accent-foreground shadow-sm hover:bg-accent/90"><UserPlus data-icon="inline-start" />Create staff</Button></div></form></Card></div>}
      {selectedStaff && <StaffDetail member={selectedStaff} onClose={() => setSelectedStaff(null)} />}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="grid gap-2 text-sm font-medium text-foreground">{label}{children}</label>; }
function StatusBadge({ status }: { status: StaffMember["status"] }) { return <Badge variant="outline" className={status === "Active" ? "border-accent/30 bg-accent/10 text-accent-foreground" : "border-border text-muted-foreground"}>{status}</Badge>; }
function StaffCard({ member, onView, onToggle }: { member: StaffMember; onView: (member: StaffMember) => void; onToggle: (id: string) => void }) {
  const initials = member.name.split(" ").map((part) => part[0]).join("").slice(0, 2);

  return (
    <Card className="group relative overflow-hidden rounded-2xl border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-md">
      <div className="h-1 bg-accent" />
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-sm font-bold text-accent-foreground">
              {initials}
            </div>
            <div className="min-w-0">
              <button onClick={() => onView(member)} className="block max-w-full truncate text-left font-semibold text-foreground transition-colors hover:text-accent">
                {member.name}
              </button>
              <p className="truncate text-xs text-muted-foreground">{member.id} · @{member.username}</p>
            </div>
          </div>
          <StatusBadge status={member.status} />
        </div>

        <div className="mt-4 grid gap-2 rounded-xl bg-muted/35 p-3 text-xs text-muted-foreground">
          <div className="flex min-w-0 items-center gap-2"><Phone className="size-3.5 shrink-0 text-accent-foreground" /><span className="truncate">{member.phone}</span></div>
          {member.email && <div className="flex min-w-0 items-center gap-2"><Mail className="size-3.5 shrink-0 text-accent-foreground" /><span className="truncate">{member.email}</span></div>}
        </div>

        <div className="mt-3 grid grid-cols-2 divide-x divide-border rounded-xl border border-border bg-background">
          <div className="p-3"><p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Collection</p><p className="mt-1 text-base font-semibold text-foreground">₹{member.totalCollection.toLocaleString("en-IN")}</p></div>
          <div className="p-3 pl-4"><p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Pending</p><p className="mt-1 text-base font-semibold text-foreground">{member.pendingApproval}</p></div>
        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
          <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => onView(member)}>
            <Eye data-icon="inline-start" /> View details
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onToggle(member.id)}>
            {member.status === "Active" ? "Deactivate" : "Activate"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
function StaffDetail({ member, onClose }: { member: StaffMember; onClose: () => void }) { return <div className="fixed inset-0 z-50 flex items-end justify-end bg-slate-900/20"><div className="h-full w-full max-w-lg overflow-y-auto border-l border-border bg-card p-6 shadow-xl sm:p-8"><div className="flex items-start justify-between"><div><p className="text-sm text-muted-foreground">Field agent profile</p><h2 className="mt-1 text-2xl font-semibold text-foreground">{member.name}</h2><p className="mt-1 text-sm text-muted-foreground">{member.id} · @{member.username}</p></div><Button variant="ghost" size="icon" onClick={onClose} aria-label="Close staff details"><X /></Button></div><div className="mt-6 flex items-center gap-2"><StatusBadge status={member.status} /><Badge variant="outline"><Phone data-icon="inline-start" />{member.phone}</Badge></div><div className="mt-8 grid grid-cols-2 gap-3">{[["Today’s collection", "₹12,500"], ["This week", "₹42,800"], ["This month", `₹${member.totalCollection.toLocaleString("en-IN")}`], ["Pending approval", String(member.pendingApproval)]].map(([label, value]) => <div key={label} className="rounded-xl border border-border bg-muted/20 p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-lg font-semibold text-foreground">{value}</p></div>)}</div><div className="mt-8"><div className="flex items-center justify-between"><h3 className="font-semibold text-foreground">Collection history</h3><Button variant="ghost" size="sm"><KeyRound data-icon="inline-start" />Reset password</Button></div><div className="mt-3 rounded-xl border border-border p-4 text-sm"><div className="flex items-center justify-between"><div><p className="font-medium text-foreground">Customer collection</p><p className="text-xs text-muted-foreground">Today · UPI · Submitted for approval</p></div><Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">Pending</Badge></div></div></div></div></div>; }

export default TeamSection;
