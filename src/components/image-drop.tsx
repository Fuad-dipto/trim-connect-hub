import { useRef, useState } from "react";
import { Camera, ImagePlus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ImageDrop({
  value, onChange, className, shape = "rect", label,
}: {
  value?: string;
  onChange: (dataUrl?: string) => void;
  className?: string;
  shape?: "rect" | "circle";
  label?: string;
}) {
  const [drag, setDrag] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const read = (file: File) => {
    const r = new FileReader();
    r.onload = () => onChange(r.result as string);
    r.readAsDataURL(file);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault(); setDrag(false);
        const f = e.dataTransfer.files?.[0];
        if (f && f.type.startsWith("image/")) read(f);
      }}
      onClick={() => input.current?.click()}
      className={cn(
        "relative cursor-pointer overflow-hidden border-2 border-dashed border-border bg-secondary/50 flex items-center justify-center text-muted-foreground transition group",
        shape === "circle" ? "rounded-full" : "rounded-2xl",
        drag && "border-accent bg-accent/10",
        className,
      )}
    >
      <input ref={input} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) read(f); }}/>
      {value ? (
        <>
          <img src={value} alt="" className="absolute inset-0 h-full w-full object-cover"/>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <span className="h-9 px-3 rounded-lg bg-white/90 text-foreground text-xs font-medium flex items-center gap-1"><Camera className="h-3.5 w-3.5"/>Replace</span>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(undefined); }}
              className="h-9 w-9 rounded-lg bg-white/90 text-destructive flex items-center justify-center"
            >
              <Trash2 className="h-3.5 w-3.5"/>
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-1.5 text-center p-3">
          <ImagePlus className="h-6 w-6"/>
          <p className="text-[11px] font-medium">{label ?? "Drop image or click to upload"}</p>
        </div>
      )}
    </div>
  );
}