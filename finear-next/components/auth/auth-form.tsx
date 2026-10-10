"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import { api, getErrorMessage } from "@/lib/api/client";
import { useToast } from "@/components/ui/toast-provider";

export type AuthMode = "login" | "signup" | "verify" | "forgot" | "reset";

const copy: Record<
  AuthMode,
  { eyebrow: string; title: string; detail: string; button: string }
> = {
  login: {
    eyebrow: "WELCOME BACK",
    title: "Your money, in focus.",
    detail:
      "Sign in to see your balances, plans, and progress in one calm place.",
    button: "Sign in to Finear",
  },
  signup: {
    eyebrow: "START FRESH",
    title: "Make room for better money habits.",
    detail: "Create your account and bring your finances into focus.",
    button: "Create my account",
  },
  verify: {
    eyebrow: "ONE QUICK CHECK",
    title: "Confirm it’s really you.",
    detail: "Enter the six-digit code sent to your email address.",
    button: "Verify email",
  },
  forgot: {
    eyebrow: "ACCOUNT RECOVERY",
    title: "Let’s get you back in.",
    detail: "Enter your email and we’ll send a secure reset code.",
    button: "Send reset code",
  },
  reset: {
    eyebrow: "NEW PASSWORD",
    title: "Choose a fresh password.",
    detail: "Enter the reset code and choose a new password for your account.",
    button: "Update password",
  },
};

export function AuthForm({
  mode,
  initialEmail = "",
}: {
  mode: AuthMode;
  initialEmail?: string;
}) {
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState(initialEmail);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    try {
      if (mode === "login") {
        await api.post("/auth/login", { email, password });
        toast.success("You’re signed in.");
        router.push("/dashboard");
      } else if (mode === "signup") {
        await api.post("/auth/signup", { name, email, password });
        toast.success("Verification code sent to your email.");
        router.push(`/verify?email=${encodeURIComponent(email)}`);
      } else if (mode === "verify") {
        await api.post("/auth/verify-email", { email, otp });
        toast.success("Your email is verified.");
        router.push("/dashboard");
      } else if (mode === "forgot") {
        await api.post("/auth/forgot-password", { email });
        toast.info("If the account exists, a reset code is on its way.");
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      } else {
        await api.post("/auth/reset-password", { email, otp, password });
        toast.success("Password updated. Sign in with your new password.");
        router.push(`/login?email=${encodeURIComponent(email)}`);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  async function resendOtp() {
    setBusy(true);
    try {
      await api.post("/auth/resend-otp", { email });
      toast.success("A new verification code was sent.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  const content = copy[mode];
  return (
    <main className="auth-screen">
      <section className="auth-showcase">
        <Link className="brand brand-light" href="/login">
          <Image className="brand-image" src="/logo-white.svg" alt="Finear" width={162} height={39} priority />
        </Link>
        <div className="showcase-copy">
          <span className="overline">A clearer view of your finances</span>
          <h1>
            Small steps.
            <br />
            <em>Stronger</em> financial habits.
          </h1>
          <p>
            Bring your day-to-day money and the things you’re saving for into
            one thoughtful workspace.
          </p>
        </div>
        <div className="showcase-foot">
          <BadgeCheck size={17} /> Private by design <span>·</span> Made for
          real life
        </div>
        <div className="orb orb-one" />
        <div className="orb orb-two" />
      </section>

      <section className="auth-panel-wrap">
        <div className="auth-panel">
          <Link href="/login" className="brand brand-dark">
            <Image className="brand-image" src="/logo.svg" alt="Finear" width={162} height={39} priority />
          </Link>
          <div className="auth-heading">
            <p className="overline">{content.eyebrow}</p>
            <h2>{content.title}</h2>
            <p>{content.detail}</p>
          </div>

          <form className="form-stack" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <label className="field">
                <span>Full name</span>
                <input
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Awais Maqbool"
                  required
                  minLength={2}
                  maxLength={120}
                />
              </label>
            )}
            <label className="field">
              <span>Email address</span>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                maxLength={191}
              />
            </label>
            {(mode === "verify" || mode === "reset") && (
              <label className="field">
                <span>6-digit code</span>
                <input
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={otp}
                  onChange={(event) =>
                    setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="000000"
                  required
                  pattern="\d{6}"
                />
              </label>
            )}
            {(mode === "login" || mode === "signup" || mode === "reset") && (
              <label className="field">
                <span>Password</span>
                <span className="password-wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete={
                      mode === "login" ? "current-password" : "new-password"
                    }
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="At least 5 characters"
                    required
                    minLength={5}
                    maxLength={72}
                  />
                  <button
                    className="password-toggle"
                    type="button"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </span>
              </label>
            )}
            {mode === "login" && (
              <div className="form-extra">
                <span>Welcome to your dashboard</span>
                <Link href="/forgot-password">Forgot password?</Link>
              </div>
            )}
            <button
              className="button button-primary button-wide"
              disabled={busy}
            >
              {busy ? "Please wait…" : content.button}
              <ArrowRight size={17} />
            </button>
          </form>

          {mode === "verify" && (
            <button
              className="text-button resend-button"
              disabled={busy || !email}
              onClick={resendOtp}
              type="button"
            >
              Resend verification code
            </button>
          )}
          <div className="auth-bottom">
            {mode === "login" && (
              <>
                New to Finear? <Link href="/signup">Create an account</Link>
              </>
            )}
            {mode === "signup" && (
              <>
                Already have an account? <Link href="/login">Sign in</Link>
              </>
            )}
            {mode === "verify" && (
              <Link href="/signup">
                <ArrowLeft size={15} /> Back to sign up
              </Link>
            )}
            {(mode === "forgot" || mode === "reset") && (
              <Link href="/login">
                <ArrowLeft size={15} /> Back to sign in
              </Link>
            )}
          </div>
          <p className="auth-legal">
            Your financial details stay private and protected.
          </p>
        </div>
      </section>
    </main>
  );
}
