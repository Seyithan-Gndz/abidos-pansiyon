import { LogOut } from "lucide-react";
import { logout } from "@/app/auth/actions";

export function LogoutButton() {
  return <form action={logout}><button className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-600"><LogOut size={15}/>Çıkış</button></form>;
}

