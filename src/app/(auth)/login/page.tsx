"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HAVOK } from "@/lib/brand/ink";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    window.location.href = "/performance";
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="display text-2xl text-foreground">{HAVOK.name}</h1>
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
          {HAVOK.product}
        </p>
      </div>

      <div className="space-y-3">
        <div className="grid gap-1.5">
          <Label htmlFor="email" className="text-xs">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-9 text-sm"
            required
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="password" className="text-xs">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-9 text-sm"
            required
          />
        </div>
      </div>

      <Button type="submit" className="w-full h-9 text-sm">
        Sign in
      </Button>
      <p className="text-[11px] text-center text-muted-foreground">
        Auth is not wired. This door opens the empty Command Center.
      </p>
    </form>
  );
}
