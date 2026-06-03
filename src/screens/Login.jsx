"use client";
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { supabase } from "../lib/supabase";
import Icon from "../components/Icon";

const TAGLINES = [
  "Track time. Not excuses.",
  "Your team, one screen.",
  "Leave approved. Go rest.",
  "Payroll, without the paperwork.",
];

const Login = ({ onLogin }) => {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [tagline, setTagline] = useState(TAGLINES[0]);
  useEffect(() => {
    setTagline(TAGLINES[Math.floor(Math.random() * TAGLINES.length)]);
  }, []);

  const cardRef  = useRef(null);
  const leftRef  = useRef(null);
  const formRef  = useRef(null);
  const errRef   = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(leftRef.current,  { x: -32, opacity: 0, duration: 0.7 })
      .from(cardRef.current,  { x:  32, opacity: 0, duration: 0.7 }, "-=0.5")
      .from(formRef.current.querySelectorAll(".login-field, .login-btn, .login-footer"),
            { y: 16, opacity: 0, duration: 0.45, stagger: 0.07 }, "-=0.4");
  }, []);

  const shakeCard = () => {
    gsap.fromTo(cardRef.current,
      { x: 0 },
      { x: [-10, 10, -8, 8, -4, 4, 0], duration: 0.45, ease: "none" }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter your email and password.");
      shakeCard();
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data?.user) {
        setError("Incorrect email or password. Contact your team lead to reset access.");
        shakeCard();
        if (errRef.current) gsap.from(errRef.current, { y: -8, opacity: 0, duration: 0.3, ease: "power2.out" });
      } else {
        // Brief success animation — redirect is handled by the page via AppContext
        gsap.to(cardRef.current, { scale: 0.98, duration: 0.12, yoyo: true, repeat: 1, onComplete: () => onLogin(data.user) });
      }
    } catch (err) {
      console.error("[Login] signIn error:", err);
      setError("Connection error — please check your network and try again.");
      shakeCard();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg)",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* ── LEFT PANEL — editorial branding ── */}
      <div ref={leftRef} style={{
        padding: "52px 56px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRight: "1.5px solid var(--border)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* giant decorative number */}
        <div style={{
          position: "absolute", left: -40, bottom: -80,
          fontFamily: "var(--font-display)", fontSize: 440, fontWeight: 700,
          color: "var(--bg-elev-2)", lineHeight: 0.8, letterSpacing: "-0.06em",
          pointerEvents: "none", userSelect: "none",
        }}>
          HR
        </div>

        {/* brand mark */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 44, height: 44,
              background: "var(--accent)", color: "var(--accent-ink)",
              display: "grid", placeItems: "center",
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22,
              border: "2px solid var(--border-strong)",
            }}>A</div>
            <div>
              <div className="t-display" style={{ fontSize: 18, letterSpacing: "-0.01em" }}>AMRYTT MEDIA</div>
              <div className="t-eyebrow" style={{ fontSize: 10, marginTop: 2 }}>Internal · HRMS v1.4</div>
            </div>
          </div>
        </div>

        {/* main editorial copy */}
        <div style={{ position: "relative" }}>
          <div className="t-eyebrow" style={{ marginBottom: 20 }}>PEOPLE OPS · 2026</div>
          <h1 className="t-display" style={{
            fontSize: 72, lineHeight: 0.92, letterSpacing: "-0.04em",
            margin: 0, maxWidth: 480,
          }}>
            Your team,<br />
            <span style={{ color: "var(--accent)" }}>one place.</span>
          </h1>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: 15, color: "var(--text-dim)",
            marginTop: 24, maxWidth: 380, lineHeight: 1.6,
          }}>
            {tagline} — Check-in, leave, payroll, celebrations and your whole team directory, unified.
          </p>

          {/* feature pills */}
          <div style={{ display: "flex", gap: 8, marginTop: 28, flexWrap: "wrap" }}>
            {["Check-in / out", "Leave tracker", "Payroll", "Celebrations", "Directory"].map(f => (
              <span key={f} className="pill" style={{ fontSize: 10 }}>
                <span className="dot" style={{ background: "var(--accent)" }}></span>
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* footer */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-mute)",
          position: "relative",
        }}>
          <span>© 2026 AMRYTT MEDIA LLC</span>
          <span className="pill" style={{ fontSize: 9.5 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--good)" }}></span>
            ALL SYSTEMS OPERATIONAL
          </span>
        </div>
      </div>

      {/* ── RIGHT PANEL — login form ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "52px 56px",
      }}>
        <div ref={cardRef} style={{ width: "100%", maxWidth: 420 }}>
          {/* header */}
          <div style={{ marginBottom: 36 }}>
            <div className="t-eyebrow" style={{ marginBottom: 10 }}>INTERNAL ACCESS ONLY</div>
            <h2 className="t-display" style={{ fontSize: 40, margin: 0, letterSpacing: "-0.03em" }}>
              Sign in.
            </h2>
            <p style={{ color: "var(--text-mute)", fontFamily: "var(--font-mono)", fontSize: 11, marginTop: 10, lineHeight: 1.6 }}>
              No public sign-ups. Contact your team lead<br />to get access credentials.
            </p>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="field login-field" style={{ marginBottom: 16 }}>
              <label>Work email</label>
              <div style={{ position: "relative" }}>
                <input
                  type="email"
                  className="input"
                  placeholder="you@amrytt.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(""); }}
                  autoComplete="email"
                  style={{
                    width: "100%",
                    paddingLeft: 40,
                    borderColor: error ? "var(--bad)" : undefined,
                  }}
                />
                <span style={{
                  position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                  color: "var(--text-mute)", display: "flex",
                }}>
                  <Icon name="user" size={14} />
                </span>
              </div>
            </div>

            {/* Password */}
            <div className="field login-field" style={{ marginBottom: 10 }}>
              <label>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  className="input"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  autoComplete="current-password"
                  style={{
                    width: "100%",
                    paddingLeft: 40,
                    paddingRight: 44,
                    borderColor: error ? "var(--bad)" : undefined,
                  }}
                />
                <span style={{
                  position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                  color: "var(--text-mute)", display: "flex",
                }}>
                  <Icon name="settings" size={14} />
                </span>
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  style={{
                    position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                    color: "var(--text-mute)", padding: 4, background: "none", border: 0, cursor: "pointer",
                  }}
                  tabIndex={-1}
                >
                  <Icon name={showPass ? "moon" : "sun"} size={13} />
                </button>
              </div>
            </div>

            {/* Error */}
            <div ref={errRef} style={{ minHeight: 36, marginBottom: 4 }}>
              {error && (
                <div style={{
                  display: "flex", alignItems: "flex-start", gap: 8,
                  padding: "8px 12px",
                  background: "rgba(255,77,77,0.08)",
                  border: "1.5px solid var(--bad)",
                  borderRadius: "var(--r-sm)",
                  color: "var(--bad)",
                  fontFamily: "var(--font-mono)", fontSize: 11, lineHeight: 1.5,
                }}>
                  <Icon name="x" size={13} style={{ flexShrink: 0, marginTop: 1 }} />
                  {error}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="brut-btn brut-btn--primary login-btn"
              disabled={loading}
              style={{
                width: "100%", justifyContent: "center",
                padding: "14px 20px", fontSize: 14,
                opacity: loading ? 0.75 : 1,
                transition: "opacity .2s",
                marginTop: 8,
              }}
            >
              {loading ? (
                <>
                  <LoadingDots /> Verifying…
                </>
              ) : (
                <>
                  Sign in <Icon name="arrow-r" size={14} />
                </>
              )}
            </button>

            {/* Footer note */}
            <div className="login-footer" style={{
              marginTop: 28, paddingTop: 20,
              borderTop: "1.5px solid var(--border)",
              fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--text-mute)",
              lineHeight: 1.7,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <Icon name="check" size={12} />
                <span>Single sign-on · <b style={{ color: "var(--text-dim)" }}>@amrytt.com</b> emails only</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="check" size={12} />
                <span>Session persists across tabs until you sign out</span>
              </div>
              <div style={{ marginTop: 14, color: "var(--text-mute)" }}>
                Locked out? Ping <b style={{ color: "var(--accent)" }}>dev.p@amrytt.com</b>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

/** Animated loading indicator */
const LoadingDots = () => {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setFrame(f => (f + 1) % 4), 200);
    return () => clearInterval(id);
  }, []);
  return <span style={{ fontFamily: "var(--font-mono)", letterSpacing: 2, marginRight: 4 }}>{"·".repeat(frame)}{" ".repeat(3 - frame)}</span>;
};

export default Login;
