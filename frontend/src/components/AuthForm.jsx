import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const EMAIL_REGEX =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i;

const USERNAME_REGEX = /^[A-Za-z][A-Za-z0-9_]{2,19}$/;

const STRONG_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,\-./:;<=>?@\[\\\]^_`{|}~]).{8,}$/;

export default function AuthForm({
  mode = "login",
  onSubmit,
  onForgotPassword,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [touched, setTouched] = useState({});

  const isLogin = mode === "login";

  const emailValid = EMAIL_REGEX.test(email);
  const usernameValid = isLogin ? true : USERNAME_REGEX.test(username);
  const passwordValid = STRONG_PASSWORD_REGEX.test(password);
  // const confirmValid = isLogin
  //   ? true
  //   : confirm.length > 0 && confirm === password;

  const formValid = emailValid && usernameValid && passwordValid;
  const inputBase =
    "w-full px-3 py-2 rounded-lg bg-white/15 text-white/90 placeholder-white/50 " + // <-- lighten
    "transition focus:outline-none focus:ring-2 focus:ring-fuchsia-400/60 " +
    "focus:bg-white/25 focus:shadow-[0_8px_30px_-12px_rgba(217,70,239,0.35)] " +
    "focus:-translate-y-[1px]";

  const errorText = "mt-1 text-xs text-rose-300";
  const labelText = "block text-sm text-white/90 mb-1";

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({
      email: true,
      username: true,
      password: true,
      confirm: true,
    });
    if (!formValid) return;
    onSubmit?.({ email, password, username: isLogin ? undefined : username });
    setEmail("");
    setPassword("");
    setUsername("");
    setConfirm("");
    setTouched({});
  };

  const passwordHint = useMemo(
    () => "Min 8 chars, with upper, lower, number, and special character.",
    []
  );

  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute -inset-24 rounded-[40px] opacity-60 blur-2xl"
        style={{
          background:
            "radial-gradient(600px circle at 50% 45%, rgba(168,85,247,.25), transparent 60%)",
        }}
      />

      <div className="relative bg-white/8 backdrop-blur-xl rounded-3xl p-8 w-[22rem] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]">
        <div className="absolute inset-0 rounded-3xl ring-1 ring-white/15 pointer-events-none" />

        <h2 className="text-center text-2xl font-semibold tracking-tight text-white/95">
          {isLogin ? "Welcome back" : "Create account"}
        </h2>
        <p className="mt-1 text-center text-sm text-white/60">
          {isLogin ? "Sign in to continue" : "It only takes a minute"}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          {!isLogin && (
            <div>
              <label className={labelText} htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="enter your name"
                className={inputBase}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, username: true }))}
                autoComplete="username"
                aria-invalid={touched.username && !usernameValid}
                aria-describedby="username-error"
                required
              />
              {touched.username && !usernameValid && (
                <p id="username-error" className={errorText}>
                  3–20 chars, start with a letter, letters/numbers/underscore
                  only.
                </p>
              )}
            </div>
          )}

          <div>
            <label className={labelText} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@email.com"
              className={inputBase}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              autoComplete="email"
              aria-invalid={touched.email && !emailValid}
              aria-describedby="email-error"
              required
              inputMode="email"
            />
            {touched.email && !emailValid && (
              <p id="email-error" className={errorText}>
                Enter a valid email address.
              </p>
            )}
          </div>

          <div>
            <label className={labelText} htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={inputBase + " pr-10"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setShowPassword(true); // 👈 show briefly
                  setTimeout(() => setShowPassword(false), 400); // 👈 then hide
                }}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                autoComplete={isLogin ? "current-password" : "new-password"}
                aria-invalid={touched.password && !passwordValid}
                aria-describedby="password-error password-hint"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white/90"
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                aria-controls="password"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff size={18} strokeWidth={2} aria-hidden="true" />
                ) : (
                  <Eye size={18} strokeWidth={2} aria-hidden="true" />
                )}
              </button>
            </div>

            {/* ✅ Keep only the hint */}
            {password && (
              <p id="password-hint" className="mt-1 text-xs text-white/60">
                {passwordHint}
              </p>
            )}

            {touched.password && !passwordValid && (
              <p id="password-error" className={errorText}>
                Password does not meet requirements.
              </p>
            )}
          </div>
          {/* 
          {!isLogin && (
            <div>
              <label className={labelText} htmlFor="confirm">
                Confirm password
              </label>
              <div className="relative">
                <input
                  id="confirm"
                  type={showConfirm ? "text" : "password"}
                  placeholder="repeat password"
                  className={inputBase + " pr-10"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
                  autoComplete="new-password"
                  aria-invalid={touched.confirm && !confirmValid}
                  aria-describedby="confirm-error"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white/90"
                  aria-label={showConfirm ? "Hide confirm" : "Show confirm"}
                  aria-pressed={showConfirm}
                  aria-controls="confirm"
                  title={showConfirm ? "Hide confirm" : "Show confirm"}
                >
                  {showConfirm ? (
                    <EyeOff size={18} strokeWidth={2} aria-hidden="true" />
                  ) : (
                    <Eye size={18} strokeWidth={2} aria-hidden="true" />
                  )}
                </button>
              </div>
              {touched.confirm && !confirmValid && (
                <p id="confirm-error" className={errorText}>
                  Passwords must match.
                </p>
              )}
            </div>
          )} */}

          <button
            type="submit"
            disabled={!formValid}
            className={
              "w-full relative overflow-hidden rounded-lg font-semibold py-2 text-white " +
              "bg-gradient-to-r from-fuchsia-500 via-violet-500 to-indigo-500 " +
              "shadow-[0_10px_30px_-12px_rgba(139,92,246,0.6)] " +
              "hover:shadow-[0_18px_40px_-18px_rgba(139,92,246,0.8)] " +
              "transition will-change-transform hover:-translate-y-[1px] active:translate-y-0 " +
              (formValid ? "" : "opacity-50 cursor-not-allowed")
            }
          >
            <span className="relative z-10">
              {isLogin ? "Login" : "Sign Up"}
            </span>
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" />
          </button>

          <div className="mt-6 text-sm text-white/70">
            <p className="text-center">
              {isLogin ? "No account yet?" : "Already have an account?"}{" "}
              <Link
                to={isLogin ? "/signup" : "/login"}
                className="text-fuchsia-300 hover:text-fuchsia-200 underline-offset-4 hover:underline"
              >
                {isLogin ? "Sign up" : "Log in"}
              </Link>
            </p>

            {isLogin && (
              <span
                onClick={() => onForgotPassword?.()} // 👈 Call parent function
                className="mt-2 block text-center text-fuchsia-300 hover:text-fuchsia-200 underline-offset-4 hover:underline"
              >
                Forgot password?
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
