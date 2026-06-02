import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Briefcase, MapPin, BadgeCheck, CalendarDays, Users, Upload, CheckCircle2, ArrowLeft, Mail,
} from "lucide-react";
import { toast } from "sonner";
import { MobileShell, PageHeader } from "@/components/mobile-shell";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { useJobsStore, jobsActions } from "@/lib/jobs-store";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/jobs/$id")({ component: JobDetail });

function JobDetail() {
  const { t } = useT();
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const job = useJobsStore((s) => s.jobs.find((j) => j.id === id));

  const [applyOpen, setApplyOpen] = useState(false);

  if (!job) {
    return (
      <MobileShell>
        <PageHeader title={t("Job not found")} back={() => navigate({ to: "/jobs" })} />
        <div className="p-6 text-center text-sm text-muted-foreground">
          {t("This job post is no longer available.")}
        </div>
      </MobileShell>
    );
  }

  const expired = new Date(job.deadline).getTime() < Date.now();
  const closed = job.status !== "active" || expired;

  return (
    <MobileShell>
      <PageHeader title={job.title} back={() => navigate({ to: "/jobs" })} />
      <div className="p-4 space-y-4">
        <button onClick={() => navigate({ to: "/jobs" })} className="text-xs text-muted-foreground flex items-center gap-1">
          <ArrowLeft className="h-3 w-3"/> {t("Back to jobs")}
        </button>

        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-start gap-3">
            <div className="h-12 w-12 shrink-0 rounded-xl bg-foreground text-background flex items-center justify-center">
              <Briefcase className="h-6 w-6"/>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold leading-tight">{job.title}</h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <p className="text-sm text-muted-foreground">{job.salonName}</p>
                {job.salonVerified && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 font-semibold">
                    <BadgeCheck className="h-3 w-3"/> {t("Verified")}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
            <Pill icon={<MapPin className="h-3.5 w-3.5"/>} label={t("Location")} value={job.location} />
            <Pill icon={<Briefcase className="h-3.5 w-3.5"/>} label={t("Type")} value={`${job.position} · ${job.employment}`} />
            <Pill icon={<Users className="h-3.5 w-3.5"/>} label={t("Vacancies")} value={String(job.vacancies)} />
            <Pill icon={<CalendarDays className="h-3.5 w-3.5"/>} label={t("Deadline")} value={job.deadline} />
          </div>

          <div className="mt-4 rounded-xl bg-secondary/60 p-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{t("Salary range")}</p>
            <p className="text-xl font-bold mt-0.5">{job.salaryMin.toLocaleString()}–{job.salaryMax.toLocaleString()}৳ <span className="text-xs font-normal text-muted-foreground">/ {t("month")}</span></p>
          </div>
        </div>

        <Section title={t("Requirements")}>
          <p className="text-sm">{job.experience}</p>
          {job.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {job.skills.map((s) => (
                <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-foreground">{s}</span>
              ))}
            </div>
          )}
        </Section>

        {job.benefits && (
          <Section title={t("Benefits")}>
            <p className="text-sm text-muted-foreground">{job.benefits}</p>
          </Section>
        )}

        {job.description && (
          <Section title={t("Job description")}>
            <p className="text-sm whitespace-pre-wrap text-muted-foreground">{job.description}</p>
          </Section>
        )}

        <Section title={t("Contact")}>
          <p className="text-sm flex items-center gap-1"><Mail className="h-3.5 w-3.5"/> {job.contact || "—"}</p>
        </Section>
      </div>

      <div className="sticky bottom-20 px-4 pt-2">
        <Button
          size="lg"
          className="w-full rounded-xl shadow-lg"
          disabled={closed}
          onClick={() => setApplyOpen(true)}
        >
          {closed ? t("Applications closed") : t("Apply Now")}
        </Button>
      </div>

      <ApplyDialog open={applyOpen} onOpenChange={setApplyOpen} jobId={job.id} jobTitle={job.title} />
    </MobileShell>
  );
}

function Pill({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background p-2.5">
      <p className="text-[10px] uppercase text-muted-foreground font-semibold flex items-center gap-1">{icon} {label}</p>
      <p className="text-sm font-semibold mt-0.5 truncate">{value}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <h2 className="font-semibold text-sm">{title}</h2>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function ApplyDialog({ open, onOpenChange, jobId, jobTitle }: {
  open: boolean; onOpenChange: (v: boolean) => void; jobId: string; jobTitle: string;
}) {
  const { t } = useT();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    fullName: "", phone: "", email: "", address: "",
    experience: "", skillsText: "", expectedSalary: 0,
    coverLetter: "", cvName: "", portfolio: [] as string[],
  });

  function onCv(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setForm({ ...form, cvName: f.name });
  }
  function onPortfolio(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 5);
    Promise.all(files.map((f) => new Promise<string>((res) => {
      const r = new FileReader();
      r.onload = () => res(String(r.result));
      r.readAsDataURL(f);
    }))).then((urls) => setForm({ ...form, portfolio: urls }));
  }

  function submit() {
    if (!form.fullName.trim() || !form.phone.trim() || !form.email.trim()) {
      toast.error(t("Name, phone and email are required"));
      return;
    }
    jobsActions.apply({
      jobId,
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
      experience: form.experience,
      skills: form.skillsText.split(",").map((s) => s.trim()).filter(Boolean),
      expectedSalary: Number(form.expectedSalary) || 0,
      coverLetter: form.coverLetter,
      cvName: form.cvName || undefined,
      portfolio: form.portfolio,
    });
    setSubmitted(true);
    toast.success(t("Application submitted"));
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setSubmitted(false); }}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        {submitted ? (
          <div className="text-center py-6">
            <CheckCircle2 className="h-12 w-12 mx-auto text-emerald-500" />
            <h3 className="text-lg font-bold mt-3">{t("Application Received")}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {t("The salon will contact you shortly if shortlisted.")}
            </p>
            <Button className="mt-5 w-full" onClick={() => onOpenChange(false)}>{t("Done")}</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{t("Apply for")} {jobTitle}</DialogTitle>
              <DialogDescription>{t("One-click apply. Your details stay private.")}</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <Row label={t("Full Name")}><Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })}/></Row>
              <div className="grid grid-cols-2 gap-2">
                <Row label={t("Phone")}><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}/></Row>
                <Row label={t("Email")}><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}/></Row>
              </div>
              <Row label={t("Address")}><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}/></Row>
              <div className="grid grid-cols-2 gap-2">
                <Row label={t("Experience")}><Input value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} placeholder="2 yrs"/></Row>
                <Row label={t("Expected salary (৳)")}><Input type="number" value={form.expectedSalary || ""} onChange={(e) => setForm({ ...form, expectedSalary: Number(e.target.value) })}/></Row>
              </div>
              <Row label={t("Skills (comma separated)")}><Input value={form.skillsText} onChange={(e) => setForm({ ...form, skillsText: e.target.value })}/></Row>
              <Row label={t("Cover letter")}><Textarea rows={3} value={form.coverLetter} onChange={(e) => setForm({ ...form, coverLetter: e.target.value })}/></Row>
              <Row label={t("CV / Resume")}>
                <label className="flex items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 cursor-pointer hover:bg-secondary/50 text-sm">
                  <Upload className="h-4 w-4"/>
                  <span className="truncate">{form.cvName || t("Upload PDF or DOC")}</span>
                  <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={onCv}/>
                </label>
              </Row>
              <Row label={t("Portfolio images (optional)")}>
                <label className="flex items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 cursor-pointer hover:bg-secondary/50 text-sm">
                  <Upload className="h-4 w-4"/>
                  <span className="truncate">{form.portfolio.length ? `${form.portfolio.length} ${t("images selected")}` : t("Upload images")}</span>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={onPortfolio}/>
                </label>
              </Row>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>{t("Cancel")}</Button>
              <Button onClick={submit}>{t("Submit Application")}</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-xs mb-1 block">{label}</Label>
      {children}
    </div>
  );
}