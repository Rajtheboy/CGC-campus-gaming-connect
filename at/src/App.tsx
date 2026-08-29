import { useState } from "react";
import "./App.css";

type Page = "intro" | "auth" | "hub" | "portal";
type AuthMode = "login" | "signup";

type Portal = {
  title: string;
  description: string;
};

const portals: Record<string, Portal> = {
  campus: {
    title: "Select Campus",
    description: "Choose your campus and become part of its CGC community.",
  },
  esports: {
    title: "CGC Esports",
    description: "Compete, represent your campus, and connect with your team.",
  },
  gamers: {
    title: "Gamer Profiles",
    description: "Discover gamers across CGC and find people who play like you.",
  },
  profile: {
    title: "Your Profile",
    description:
      "Build your gaming identity, track your progress, and share your profile.",
  },
  platform: {
    title: "Play Your Way",
    description:
      "Explore games and connect with players across PC and mobile.",
  },
};

function App() {
  const [page, setPage] = useState<Page>("intro");
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [selectedPortal, setSelectedPortal] = useState("profile");

  const [gamerName, setGamerName] = useState("");
  const [collegeEmail, setCollegeEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const openAuth = (mode: AuthMode = "login") => {
    setAuthMode(mode);
    setAuthError("");
    setPage("auth");
  };

  const openPortal = (portal: string) => {
    setSelectedPortal(portal);
    setPage("portal");
  };

  const handleAuthSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setAuthError("");
    setAuthLoading(true);

    try {
      if (authMode === "login") {
        const response = await fetch(
          "http://localhost:5000/api/auth/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              collegeEmail,
              password,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setAuthError(data.message || "Login failed.");
          return;
        }

        console.log("LOGIN SUCCESS:", data.user);
        setPage("hub");
      } else {
        const response = await fetch(
          "http://localhost:5000/api/auth/signup",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              gamerName,
              collegeEmail,
              password,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setAuthError(data.message || "Signup failed.");
          return;
        }

        console.log("SIGNUP SUCCESS:", data.user);
        setPage("hub");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setAuthError("Unable to connect to CGC.");
    } finally {
      setAuthLoading(false);
    }
  };

  if (page === "intro") {
    return (
      <div className="landing">
        <header className="top-bar">
          <div className="brand">CGC</div>

          <button className="login-button" onClick={() => openAuth()}>
            LOGIN
          </button>
        </header>

        <main className="intro">
          <div className="logo-emblem">CGC</div>

          <p className="eyebrow">CAMPUS GAMING CONNECT</p>

          <h1>
            Your campus has gamers.
            <br />
            CGC gives them a place to connect.
          </h1>

          <p className="intro-description">
            Discover players, build your gaming identity, join communities,
            and compete together.
          </p>

          <button className="enter-button" onClick={() => openAuth("login")}>
            ENTER CGC
          </button>
        </main>
      </div>
    );
  }

  if (page === "auth") {
    return (
      <div className="landing auth-page">
        <header className="top-bar">
          <button
            className="brand brand-button"
            onClick={() => setPage("intro")}
          >
            CGC
          </button>

          <button
            className="login-button"
            onClick={() =>
              setAuthMode(authMode === "login" ? "signup" : "login")
            }
          >
            {authMode === "login" ? "SIGN UP" : "LOGIN"}
          </button>
        </header>

        <main className="auth-container">
          <p className="eyebrow">CAMPUS GAMING CONNECT</p>

          <h1>Welcome to CGC.</h1>

          <p className="auth-description">
            Your gaming identity starts here.
          </p>

          <div className="auth-switch">
            <button
              className={authMode === "login" ? "active" : ""}
              onClick={() => {
                setAuthMode("login");
                setAuthError("");
              }}
            >
              LOGIN
            </button>

            <button
              className={authMode === "signup" ? "active" : ""}
              onClick={() => {
                setAuthMode("signup");
                setAuthError("");
              }}
            >
              SIGN UP
            </button>
          </div>

          <form className="auth-form" onSubmit={handleAuthSubmit}>
            {authMode === "signup" && (
              <input
                type="text"
                placeholder="Gamer name"
                value={gamerName}
                onChange={(event) => setGamerName(event.target.value)}
                required
              />
            )}

            <input
              type="email"
              placeholder="College email"
              value={collegeEmail}
              onChange={(event) => setCollegeEmail(event.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            {authError && (
              <p className="auth-error">{authError}</p>
            )}

            <button
              type="submit"
              className="auth-submit"
              disabled={authLoading}
            >
              {authLoading
                ? "PLEASE WAIT..."
                : authMode === "login"
                  ? "LOGIN TO CGC"
                  : "CREATE ACCOUNT"}
            </button>
          </form>
        </main>
      </div>
    );
  }

  if (page === "portal") {
    const portal = portals[selectedPortal];

    return (
      <div className="landing auth-page">
        <main className="auth-container">
          <p className="eyebrow">CGC PORTAL</p>

          <h1>{portal.title}</h1>

          <p className="auth-description">{portal.description}</p>

          <button
            className="enter-button"
            onClick={() => setPage("hub")}
          >
            BACK TO HUB
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="landing hub-page">
      <main className="hero">
        <div className="hub-heading">
          <p className="eyebrow">WELCOME TO</p>
          <h1>CGC</h1>
          <p>Choose your portal.</p>
        </div>

        <div className="card-stage">
          <div
            className="game-card card-campus"
            onClick={() => openPortal("campus")}
          >
            <span>SELECT CAMPUS</span>
            <strong>🔒</strong>
            <p>Coming soon</p>
          </div>

          <div
            className="game-card card-esports"
            onClick={() => openPortal("esports")}
          >
            <span>CGC ESPORTS CLUB</span>
            <strong>ESPORTS</strong>
            <p>Compete. Represent. Connect.</p>
          </div>

          <div
            className="game-card card-gamers"
            onClick={() => openPortal("gamers")}
          >
            <span>GAMER PROFILES</span>
            <strong>DISCOVER</strong>
            <p>Find gamers across CGC.</p>
          </div>

          <div
            className="game-card card-profile"
            onClick={() => openPortal("profile")}
          >
            <span>YOUR PROFILE</span>
            <strong>YOUR IDENTITY</strong>
            <p>Build your gamer profile.</p>
          </div>

          <div
            className="game-card card-platform"
            onClick={() => openPortal("platform")}
          >
            <span>PLAY YOUR WAY</span>
            <strong>PC / MOBILE</strong>
            <p>Your game. Your platform.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;