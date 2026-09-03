import Image from "next/image";

export function AuthShell({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return <main className="flex min-h-screen items-center justify-center p-5"><section className="panel w-full max-w-md p-7 md:p-9"><div className="flex items-center gap-3"><Image src="/images/logo.png" alt="Abidos Pansiyon" width={52} height={52}/><div><p className="text-[10px] font-bold tracking-[.18em] text-slate-400">ABİDOS PANSİYON</p><h1 className="font-display text-2xl font-extrabold text-[#173545]">{title}</h1></div></div><p className="mt-4 text-sm leading-6 text-slate-500">{description}</p>{children}</section></main>;
}

