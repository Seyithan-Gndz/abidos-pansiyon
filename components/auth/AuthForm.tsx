"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, signup, type AuthState } from "@/app/auth/actions";

const initialState: AuthState = null;

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const action = mode === "login" ? login : signup;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="mt-7 space-y-4">
      {mode === "signup" && (
        <label className="form-field">
          <span>AD SOYAD</span>
          <input name="fullName" autoComplete="name" required minLength={2} />
        </label>
      )}
      <label className="form-field">
        <span>E-POSTA</span>
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label className="form-field">
        <span>ŞİFRE</span>
        <input name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} required minLength={8} />
      </label>
      {state?.error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{state.error}</p>}
      {state?.success && <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{state.success}</p>}
      <button disabled={pending} className="w-full rounded-lg bg-[#173545] px-4 py-3 font-bold text-white disabled:opacity-60">
        {pending ? "İşleniyor..." : mode === "login" ? "Giriş yap" : "Hesap oluştur"}
      </button>
      <p className="text-center text-sm text-slate-500">
        {mode === "login" ? "Hesabınız yok mu? " : "Zaten hesabınız var mı? "}
        <Link className="font-bold text-[#287da5]" href={mode === "login" ? "/signup" : "/login"}>
          {mode === "login" ? "Kayıt olun" : "Giriş yapın"}
        </Link>
      </p>
    </form>
  );
}

