"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
  Mail,
  LockKeyhole,
  UserRoundPlus,
  LogIn,
  LoaderCircle,
  FlaskConical,
  CircleCheck,
  Circle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { validateAuth, type AuthFields } from "@/lib/validations/auth";
export function AuthForm({ register = false }: { register?: boolean }) {
  const router = useRouter();
  const { setUser } = useAuth();
  const [values, setValues] = useState<AuthFields>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const errors = submitted ? validateAuth(values, register) : {};
  const prefix = register ? "register" : "login";
  function change(field: keyof AuthFields, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    setError("");
    setSuccess(false);
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    setError("");
    setSuccess(false);
    const invalid = validateAuth(values, register);
    const firstField = Object.keys(invalid)[0];
    if (firstField) {
      document
        .getElementById(
          prefix +
            "-" +
            (firstField === "confirmPassword"
              ? "confirm-password"
              : firstField),
        )
        ?.focus();
      return;
    }
    setBusy(true);
    try {
      const response = await fetch("/api/auth/" + prefix, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        signal: AbortSignal.timeout(20000),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }
      if (register) setSuccess(true);
      else {
        setUser(data);
        router.replace("/reading-logs");
        router.refresh();
      }
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main id="main-content" tabIndex={-1} className="shell auth-layout">
      <aside className="auth-story">
        <p className="eyebrow">A FEW PAGES, EVERY DAY</p>
        <h1>
          {register ? (
            <>
              Make room for
              <br />
              <em>better habits.</em>
            </>
          ) : (
            <>
              Your reading story,
              <br />
              <em>all in one place.</em>
            </>
          )}
        </h1>
        <p>
          Stay close to the little things.
          <br />
          They add up to the bigger picture.
        </p>
        <div className="story-note">
          <ShieldCheck size={23} />
          <div>
            <strong>A space that belongs to you</strong>
            <p>Your reading journal stays with your account.</p>
          </div>
        </div>
        <span className="story-mark" aria-hidden="true">
          ↗
        </span>
      </aside>
      <section className="auth-panel" aria-labelledby="auth-heading">
        <div className="auth-heading-icon" aria-hidden="true">
          {register ? <UserRoundPlus size={23} /> : <LogIn size={23} />}
        </div>
        <p className="eyebrow">
          {register ? "LET’S GET STARTED" : "GOOD TO SEE YOU AGAIN"}
        </p>
        <h2 id="auth-heading">
          {register ? "Create your account" : "Welcome back"}
        </h2>
        <p className="panel-description">
          {register
            ? "One simple step towards a clearer view."
            : "Sign in to pick up where you left off."}
        </p>
        <form
          noValidate
          onSubmit={submit}
          data-testid={prefix + "-form"}
          aria-busy={busy}
        >
          {(
            [
              "email",
              "password",
              ...(register ? ["confirmPassword"] : []),
            ] as (keyof AuthFields)[]
          ).map((field) => {
            const message = errors[field];
            const id =
              prefix +
              "-" +
              (field === "confirmPassword" ? "confirm-password" : field);
            return (
              <div className="field" key={field}>
                <Label htmlFor={id}>
                  {field === "email"
                    ? "Email address"
                    : field === "password"
                      ? "Password"
                      : "Confirm password"}
                </Label>
                <div className="input-wrap">
                  <span className="input-icon" aria-hidden="true">
                    {field === "email" ? (
                      <Mail size={17} />
                    ) : (
                      <LockKeyhole size={17} />
                    )}
                  </span>
                  <Input
                    name={field}
                    spellCheck={false}
                    autoCapitalize="none"
                    inputMode={field === "email" ? "email" : undefined}
                    onKeyUp={(e) => {
                      if (field !== "email")
                        setCapsLock(e.getModifierState("CapsLock"));
                    }}
                    onBlur={() => setCapsLock(false)}
                    id={id}
                    data-testid={id}
                    type={
                      field === "email" ? "email" : show ? "text" : "password"
                    }
                    autoComplete={
                      field === "email"
                        ? "email"
                        : register
                          ? "new-password"
                          : "current-password"
                    }
                    value={values[field]}
                    disabled={busy}
                    onChange={(e) => change(field, e.target.value)}
                    placeholder={
                      field === "email"
                        ? "you@example.com"
                        : field === "password"
                          ? register
                            ? "At least 6 characters"
                            : "Enter your password"
                          : "Enter your password again"
                    }
                    aria-invalid={Boolean(message)}
                    aria-describedby={message ? id + "-error" : undefined}
                  />
                  {field === "password" && (
                    <button
                      type="button"
                      className="show-password"
                      aria-label={show ? "Hide password" : "Show password"}
                      aria-pressed={show}
                      disabled={busy}
                      onClick={() => setShow((v) => !v)}
                    >
                      {show ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  )}
                </div>
                {field === "password" && capsLock && (
                  <p className="field-hint" role="status">
                    Caps Lock is on.
                  </p>
                )}
                {register && field === "password" && (
                  <div
                    className="password-guide"
                    aria-label="Password requirements"
                  >
                    <span
                      className={
                        values.password.length >= 6 ? "requirement-met" : ""
                      }
                    >
                      {values.password.length >= 6 ? (
                        <CircleCheck size={13} />
                      ) : (
                        <Circle size={13} />
                      )}
                      At least 6 characters
                    </span>
                  </div>
                )}
                {message && (
                  <p
                    id={id + "-error"}
                    data-testid={
                      "error-" +
                      (field === "confirmPassword" ? "confirm-password" : field)
                    }
                    className="field-error"
                    role="alert"
                  >
                    {message}
                  </p>
                )}
              </div>
            );
          })}
          {error && (
            <p className="form-error" data-testid="error-auth" role="alert">
              {error}
            </p>
          )}
          {success && (
            <div className="success-box" role="status">
              <CheckCircle2 size={18} />
              <div>
                <p data-testid="form-success">Registration successful</p>
                <Link href="/login">Continue to login →</Link>
              </div>
            </div>
          )}
          <Button
            type="submit"
            className="submit-button"
            data-testid={prefix + "-submit"}
            disabled={busy}
          >
            {busy
              ? register
                ? "Creating account…"
                : "Signing in…"
              : register
                ? "Create account"
                : "Login"}
            {busy ? (
              <LoaderCircle className="spin" size={17} aria-hidden="true" />
            ) : (
              <ArrowRight size={17} aria-hidden="true" />
            )}
          </Button>
        </form>
        <p className="switch-auth">
          {register ? "Already have an account?" : "New to ReadLog?"}{" "}
          <Link href={register ? "/login" : "/register"}>
            {register ? "Login" : "Create an account"}
          </Link>
        </p>
        {!register && (
          <div className="demo-box">
            <div>
              <strong>Just taking a look?</strong>
              <p>Try the shared demo account. Please use sample data only.</p>
            </div>
            <Button
              variant="outline"
              type="button"
              disabled={busy}
              onClick={() => {
                setValues({
                  email: "grader.qe190167@example.com",
                  password: "Test1234!",
                  confirmPassword: "",
                });
                setError("");
                setSubmitted(false);
                setSuccess(false);
                document.getElementById("login-submit")?.focus();
              }}
            >
              <FlaskConical size={16} aria-hidden="true" /> Fill demo account
            </Button>
            <small>grader.qe190167@example.com · Test1234!</small>
          </div>
        )}
      </section>
    </main>
  );
}
