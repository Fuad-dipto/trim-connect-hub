import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Briefcase, Plus, MapPin, Users, CalendarDays, BadgeCheck, Pencil, Trash2,
  Pause, Play, CheckCircle2, X, Mail, Phone, FileText, Star,
} from "lucide-react";
import { toast } from "sonner";
import { OwnerShell } from "@/components/owner-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import {
  useJobsStore, jobsActions, POSITIONS, EMPLOYMENTS,
  type Job, type AppStatus, type Position, type Employment,
} from "@/lib/jobs-store";
import { useOwnerStore } from "@/lib/owner-store";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/owner/jobs")({ component: OwnerJobs });

const APP_TABS: { key: AppStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "new", label: "New" },
  { key: "shortlisted", label: "Shortlisted" },
  { key: "interview", label: "Interview" },
  { key: "hired", label: "Hired" },
  { key: "rejected", label: "Rejected" },
];

function OwnerJobs() {
  const { t } = useT();
  const profile = useOwnerStore((s) => s.profile);
  const jobs = useJobsStore((s) => s.jobs);
  const apps = useJobsStore((s) => s.apps);

  const myJobs = useMemo(() => jobs.filter((j) => j.salonName === profile.name), [jobs, profile.name]);

  const [editing, setEditing] = useState<Job | null>(null);
  const [creating, setCreating] = useState(false);
  const [viewing, setViewing] = useState<Job | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Job | null>(null);
  const [tab, setTab] = useState<AppStatus | "all">("all");

  const viewingApps = useMemo(
    () => (viewing ? apps.filter((a) => a.jobId === viewing.id) : []),
    [apps, viewing],
  );
  const filteredApps = useMemo(
    () => (tab === "all" ? viewingApps : viewingApps.filter((a) => a.status === tab)),
    [viewingApps, tab],
  );

  return (
    <OwnerShell
      title={t("Salon Jobs")}
      subtitle={t("Post vacancies and manage applicants")}
      action={
        <Button size="sm" className="rounded-lg" onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4 mr-1" /> {t("Post a job")}
        </Button>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPI label={t("Active jobs")} value={myJobs.filter((j) => j.status === "active").length} icon={<Briefcase className="h-4 w-4" />} tone="primary" />
        <KPI label={t("Total applicants")} value={apps.filter((a) => myJobs.some((j) => j.id === a.jobId)).length} icon={<Users className="h-4 w-4" />} />
        <KPI label={t("Shortlisted")} value={apps.filter((a) => a.status === "shortlisted" && myJobs.some((j) => j.id === a.jobId)).length} icon={<Star className="h-4 w-4" />} />
        <KPI label={t("Hired")} value={apps.filter((a) => a.status === "hired" && myJobs.some((j) => j.id === a.jobId)).length} icon={<CheckCircle2 className="h-4 w-4" />} />
      </div>

      <section className="mt-6 rounded-2xl bg-card border border-border overflow-hidden">
        <div className="p-5 flex items-center justify-between">
          <h2 className="font-semibold">{t("Your job posts")}</h2>
          <span className="text-xs text-muted-foreground">{myJobs.length} {t("posts")}</span>
        </div>

        {myJobs.length === 0 ? (
          <div className="px-5 pb-8 text-center">
            <Briefcase className="h-10 w-10 mx-auto text-muted-foreground/40" />
            <p className="mt-3 font-semibold">{t("No job posts yet")}</p>
            <p className="text-xs text-muted-foreground mt-1">{t("Publish your first vacancy to start receiving applications.")}</p>
            <Button className="mt-4" onClick={() => setCreating(true)}>
              <Plus className="h-4 w-4 mr-1" /> {t("Post a job")}
            </Button>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {myJobs.map((j) => {
              const count = apps.filter((a) => a.jobId === j.id).length;
              return (
                <li key={j.id} className="p-5 hover:bg-secondary/30 transition">
                  <div className="flex items-start gap-4">
                    <div className="h-11 w-11 shrink-0 rounded-xl bg-foreground text-background flex items-center justify-center">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold truncate">{j.title}</p>
                        <StatusBadge status={j.status} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {j.position} · {j.employment} · {j.salaryMin.toLocaleString()}–{j.salaryMax.toLocaleString()}৳
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {j.location}</span>
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {j.vacancies} {t("vacancies")}</span>
                        <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" /> {j.deadline}</span>
                        <span className="font-semibold text-foreground">· {count} {t("applicants")}</span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button size="sm" variant="secondary" onClick={() => { setViewing(j); setTab("all"); }}>
                        <Users className="h-3.5 w-3.5 mr-1" /> {t("Applicants")}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditing(j)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      {j.status === "active" ? (
                        <Button size="sm" variant="outline" onClick={() => { jobsActions.updateJob(j.id, { status: "paused" }); toast.success(t("Job paused")); }}>
                          <Pause className="h-3.5 w-3.5" />
                        </Button>
                      ) : j.status === "paused" ? (
                        <Button size="sm" variant="outline" onClick={() => { jobsActions.updateJob(j.id, { status: "active" }); toast.success(t("Job resumed")); }}>
                          <Play className="h-3.5 w-3.5" />
                        </Button>
                      ) : null}
                      {j.status !== "filled" && (
                        <Button size="sm" variant="outline" onClick={() => { jobsActions.updateJob(j.id, { status: "filled" }); toast.success(t("Marked as filled")); }}>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => setConfirmDelete(j)}>
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <JobFormDialog
        open={creating || !!editing}
        onOpenChange={(v) => { if (!v) { setCreating(false); setEditing(null); } }}
        existing={editing}
        salonName={profile.name}
      />

      <Dialog open={!!viewing} onOpenChange={(v) => !v && setViewing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {t("Applicants for")} {viewing.title}
                </DialogTitle>
                <DialogDescription>
                  {viewingApps.length} {t("total applications")}
                </DialogDescription>
              </DialogHeader>
              <div className="flex gap-1.5 flex-wrap mb-1">
                {APP_TABS.map((tb) => {
                  const c = tb.key === "all" ? viewingApps.length : viewingApps.filter((a) => a.status === tb.key).length;
                  return (
                    <button
                      key={tb.key}
                      onClick={() => setTab(tb.key)}
                      className={cn(
                        "px-2.5 py-1 rounded-full text-[11px] font-medium transition",
                        tab === tb.key ? "bg-foreground text-background" : "bg-secondary text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {t(tb.label)} {c}
                    </button>
                  );
                })}
              </div>
              {filteredApps.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">{t("No applicants in this stage yet.")}</p>
              ) : (
                <ul className="space-y-3">
                  {filteredApps.map((a) => (
                    <li key={a.id} className="rounded-xl border border-border p-4">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-semibold">
                          {a.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <p className="font-semibold truncate">{a.fullName}</p>
                            <AppStatusBadge status={a.status} />
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{a.experience} {t("Expected")} {a.expectedSalary.toLocaleString()}৳</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {a.skills.slice(0, 6).map((s) => (
                              <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-foreground">{s}</span>
                            ))}
                          </div>
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                            <a className="flex items-center gap-1 hover:text-foreground" href={`tel:${a.phone}`}><Phone className="h-3 w-3"/>{a.phone}</a>
                            <a className="flex items-center gap-1 hover:text-foreground" href={`mailto:${a.email}`}><Mail className="h-3 w-3"/>{a.email}</a>
                            {a.cvName && <span className="flex items-center gap-1"><FileText className="h-3 w-3"/>{a.cvName}</span>}
                          </div>
                          {a.coverLetter && (
                            <p className="text-xs mt-2 text-muted-foreground line-clamp-3">{a.coverLetter}</p>
                          )}
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            <ActionBtn label={t("Shortlist")} icon={<Star className="h-3 w-3"/>} active={a.status==="shortlisted"} onClick={() => jobsActions.setAppStatus(a.id, "shortlisted")} />
                            <ActionBtn label={t("Interview")} icon={<CalendarDays className="h-3 w-3"/>} active={a.status==="interview"} onClick={() => jobsActions.setAppStatus(a.id, "interview")} />
                            <ActionBtn label={t("Hire")} icon={<CheckCircle2 className="h-3 w-3"/>} active={a.status==="hired"} onClick={() => jobsActions.setAppStatus(a.id, "hired")} />
                            <ActionBtn label={t("Reject")} icon={<X className="h-3 w-3"/>} active={a.status==="rejected"} onClick={() => jobsActions.setAppStatus(a.id, "rejected")} danger />
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!confirmDelete} onOpenChange={(v) => !v && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("Delete this job post?")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("This will remove the post and all applications received for it.")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (confirmDelete) { jobsActions.deleteJob(confirmDelete.id); toast.success(t("Job deleted")); }
              setConfirmDelete(null);
            }}>{t("Delete")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </OwnerShell>
  );
}

function KPI({ label, value, icon, tone }: { label: string; value: React.ReactNode; icon: React.ReactNode; tone?: "primary" }) {
  return (
    <div className={cn("rounded-2xl p-4 border", tone === "primary" ? "bg-foreground text-background border-transparent" : "bg-card border-border")}>
      <div className="flex items-center justify-between">
        <span className={cn("h-8 w-8 rounded-lg flex items-center justify-center", tone === "primary" ? "bg-accent text-accent-foreground" : "bg-secondary")}>{icon}</span>
      </div>
      <p className={cn("text-xs mt-3", tone === "primary" ? "opacity-90" : "text-muted-foreground")}>{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: Job["status"] }) {
  const map: Record<Job["status"], string> = {
    active: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    paused: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    closed: "bg-muted text-muted-foreground",
    filled: "bg-accent/30 text-accent-foreground",
  };
  return <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium uppercase", map[status])}>{status}</span>;
}

function AppStatusBadge({ status }: { status: AppStatus }) {
  const map: Record<AppStatus, string> = {
    new: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
    shortlisted: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    interview: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
    hired: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    rejected: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
  };
  return <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium uppercase", map[status])}>{status}</span>;
}

function ActionBtn({ label, icon, active, onClick, danger }: { label: string; icon: React.ReactNode; active?: boolean; onClick: () => void; danger?: boolean }) {
  return (
    <button onClick={onClick} className={cn(
      "inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition border",
      active
        ? (danger ? "bg-rose-500 text-white border-rose-500" : "bg-foreground text-background border-foreground")
        : "bg-background text-foreground border-border hover:bg-secondary",
    )}>
      {icon} {label}
    </button>
  );
}

function JobFormDialog({ open, onOpenChange, existing, salonName }: {
  open: boolean; onOpenChange: (v: boolean) => void; existing: Job | null; salonName: string;
}) {
  const { t } = useT();
  const init = existing ?? {
    title: "", position: "Hair Stylist" as Position, employment: "Full-Time" as Employment,
    salaryMin: 15000, salaryMax: 30000, experience: "1+ years", experienceYears: 1,
    skills: [] as string[], description: "", location: "", vacancies: 1,
    deadline: new Date(Date.now() + 14*864e5).toISOString().slice(0,10),
    contact: "", benefits: "", salonName, salonVerified: true,
  };
  const [form, setForm] = useState(() => ({
    ...init,
    skillsText: (existing?.skills ?? []).join(", "),
  }));

  function reset() {
    setForm({ ...init, skillsText: (existing?.skills ?? []).join(", ") });
  }

  function submit() {
    if (!form.title.trim()) { toast.error(t("Job title is required")); return; }
    if (!form.location.trim()) { toast.error(t("Location is required")); return; }
    const skills = form.skillsText.split(",").map((s) => s.trim()).filter(Boolean);
    const payload = {
      title: form.title.trim(),
      position: form.position,
      employment: form.employment,
      salaryMin: Number(form.salaryMin) || 0,
      salaryMax: Number(form.salaryMax) || 0,
      experience: form.experience,
      experienceYears: Number(form.experienceYears) || 0,
      skills,
      description: form.description,
      location: form.location.trim(),
      vacancies: Number(form.vacancies) || 1,
      deadline: form.deadline,
      contact: form.contact,
      benefits: form.benefits,
      salonName,
      salonVerified: existing?.salonVerified ?? true,
    };
    if (existing) {
      jobsActions.updateJob(existing.id, payload);
      toast.success(t("Job updated"));
    } else {
      jobsActions.addJob(payload);
      toast.success(t("Job published"));
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (v) reset(); }}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{existing ? t("Edit job post") : t("Post a job")}</DialogTitle>
          <DialogDescription>{t("Fill the details to publish a vacancy.")}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label={t("Job title")} className="sm:col-span-2">
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder={t("e.g. Senior Hair Stylist")} />
          </Field>
          <Field label={t("Position")}>
            <Select value={form.position} onValueChange={(v) => setForm({ ...form, position: v as Position })}>
              <SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent>{POSITIONS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label={t("Employment type")}>
            <Select value={form.employment} onValueChange={(v) => setForm({ ...form, employment: v as Employment })}>
              <SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent>{EMPLOYMENTS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label={t("Min salary (৳)")}>
            <Input type="number" value={form.salaryMin} onChange={(e) => setForm({ ...form, salaryMin: Number(e.target.value) })} />
          </Field>
          <Field label={t("Max salary (৳)")}>
            <Input type="number" value={form.salaryMax} onChange={(e) => setForm({ ...form, salaryMax: Number(e.target.value) })} />
          </Field>
          <Field label={t("Required experience")}>
            <Input value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} placeholder="e.g. 2+ years" />
          </Field>
          <Field label={t("Years (number)")}>
            <Input type="number" min={0} value={form.experienceYears} onChange={(e) => setForm({ ...form, experienceYears: Number(e.target.value) })} />
          </Field>
          <Field label={t("Required skills (comma separated)")} className="sm:col-span-2">
            <Input value={form.skillsText} onChange={(e) => setForm({ ...form, skillsText: e.target.value })} placeholder="Color, Fade, Styling" />
          </Field>
          <Field label={t("Work location")} className="sm:col-span-2">
            <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Gulshan 2, Dhaka" />
          </Field>
          <Field label={t("Number of vacancies")}>
            <Input type="number" min={1} value={form.vacancies} onChange={(e) => setForm({ ...form, vacancies: Number(e.target.value) })} />
          </Field>
          <Field label={t("Application deadline")}>
            <Input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
          </Field>
          <Field label={t("Contact information")} className="sm:col-span-2">
            <Input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="hr@salon.com / +880…" />
          </Field>
          <Field label={t("Benefits")} className="sm:col-span-2">
            <Input value={form.benefits} onChange={(e) => setForm({ ...form, benefits: e.target.value })} placeholder="Tips, training, bonus" />
          </Field>
          <Field label={t("Job description")} className="sm:col-span-2">
            <Textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t("Cancel")}</Button>
          <Button onClick={submit}>
            <BadgeCheck className="h-4 w-4 mr-1" />
            {existing ? t("Save changes") : t("Publish Job")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <Label className="text-xs mb-1 block">{label}</Label>
      {children}
    </div>
  );
}