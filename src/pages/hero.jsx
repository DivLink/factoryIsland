  import { useState, useEffect, useRef } from "react";
  import { ShoppingCartIcon, HeartIcon, QuestionMarkCircleIcon, GlobeAltIcon, BellIcon, MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/solid";
  import shopping1Img from "../assets/shopping1.png";
  import gaming_set from "../assets/gaming_set.jpg";
  import soldOutImg from "../assets/soldout.png";
  import { useNavigate } from "react-router-dom";
  import {signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
  import { auth } from "../firebase"; 
  import app, { analytics } from '../firebase';
  import { getAuth } from "firebase/auth";
  import { onAuthStateChanged } from "firebase/auth";
  import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
  import { getFirestore } from "firebase/firestore";
  import { getStorage } from "firebase/storage";
  import Nav from "./nav";


  const db = getFirestore(app);
  const storage = getStorage(app);

  const products = [
    {
      id: 1,
      name: "Miniblox - 100 choices character",
      price: 605,
      discount: 40,
      location: "Suarez, Iligan City",
      image: shopping1Img,
      shipping: "Free Shipping",
      preferred: true,
      rating: 4,
      soldOut: false,
    },
    {
      id: 2,
      name: "Prime Gaming Set - Mega Price",
      price: 999,
      discount: 55,
      location: "Suarez, Iligan City",
      image: gaming_set,
      shipping: "Free Shipping",
      preferred: false,
      rating: 3,
      soldOut: true,
    },
  ];
  
  function Hero() {
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [showSignupPopup, setShowSignupPopup] = useState(false);
  
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
  
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [signupMessage, setSignupMessage] = useState("");
    const [currentUser, setCurrentUser] = useState(null);

    const googleButtonRef = useRef(null); 
    const navigate = useNavigate();
  
    
    const [hasManuallyOpened, setHasManuallyOpened] = useState(false);

  
    useEffect(() => {
      if (window.google && googleButtonRef.current && showLoginPopup) {
        window.google.accounts.id.initialize({
          client_id: "221092067778-09gk8gb2ak055lufa3opjvqmekpscmk7.apps.googleusercontent.com",
          callback: handleGoogleResponse,
        });
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: "outline",
          size: "large",
          width: "100%",
        });
      }
    }, [showLoginPopup]);    
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
      });
      return unsubscribe;
    }, []);

    const handleGoogleResponse = async (response) => {
      console.log("Google Credential Response:", response);
      if (!response.credential) {
        setMessage("Google login failed: No credential received.");
        return;
      }
      try {
        const credential = GoogleAuthProvider.credential(response.credential);
        const userCredential = await signInWithCredential(auth, credential);
        console.log("Firebase Google sign-in user:", userCredential.user);
    
        setMessage("Google login successful!");
        closeLoginPopup();
        setCurrentUser(userCredential.user);
        navigate("/dashboard");
      } catch (error) {
        console.error("Google sign-in failed:", error);
        setMessage(`Google login failed: [${error.code}] ${error.message}`);
      }
    };
    
  
    const openLoginPopup = () => {
      setMessage("");
      setHasManuallyOpened(true);
      setShowLoginPopup(true);
      setShowSignupPopup(false);  // ensure only 1 popup
    };
    
    const closeLoginPopup = () => {
      setShowLoginPopup(false);
    };
    
    const openSignupPopup = () => {
      setSignupMessage("");
      setHasManuallyOpened(true);
      setShowSignupPopup(true);
      setShowLoginPopup(false);  // ensure only 1 popup
    };
    
    const closeSignupPopup = () => {
      setShowSignupPopup(false);
    };

    
    useEffect(() => {
      if (hasManuallyOpened) return; // skip automatic popup if manual opened
    
      const timer = setTimeout(() => {
        setShowLoginPopup(true);
      }, 5000);
    
      return () => clearTimeout(timer);
    }, [hasManuallyOpened]);
    
  
    const handleLogin = async (e) => {
      e.preventDefault();
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Logged in:", userCredential.user);
        setMessage("Login successful!");
        setTimeout(() => {
          closeLoginPopup();
          navigate("/dashboard");
        }, 1000);
      } catch (error) {
        if (error.code === "user not found") {
          setMessage("No user found with this email.");
        } else if (error.code === "wrong password") {
          setMessage("Incorrect password.");
        } else {
          setMessage(error.message);
        }
      }
    };

    
  
    const handleSignup = async (e) => {
      e.preventDefault();
      if (!signupEmail || !signupPassword) {
        setSignupMessage("Please fill in all fields.");
        return;
      }
  
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
        console.log("User signed up:", userCredential.user);
  
        setSignupMessage("Signup successful!");
        setSignupEmail("");
        setSignupPassword("");
  
        setTimeout(() => {
          closeSignupPopup();
          navigate("/dashboard");
        }, 1000);
      } catch (error) {
        if (error.code === "email already in use") {
          setSignupMessage("Email already in use.");
        } else if (error.code === "invalid email") {
          setSignupMessage("Invalid email format.");
        } else if (error.code === "weak password") {
          setSignupMessage("Password should be at least 6 characters.");
        } else {
          setSignupMessage(error.message);
        }
      }
    };

    const [signupStep, setSignupStep] = useState(1);
const [confirmationCode, setConfirmationCode] = useState("");
const [generatedCode, setGeneratedCode] = useState(null);
const [timeLeft, setTimeLeft] = useState(0);
const [isCodeExpired, setIsCodeExpired] = useState(false);

const startCountdown = () => {
  setTimeLeft(60); // 60 seconds
  setIsCodeExpired(false);

  const countdownInterval = setInterval(() => {
    setTimeLeft(prev => {
      if (prev <= 1) {
        clearInterval(countdownInterval);
        setIsCodeExpired(true); // mark code as expired
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
};

const sendConfirmationCode = async () => {
  if (!signupEmail || !signupPassword) {
    setSignupMessage("Please fill in all fields.");
    return;
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  setGeneratedCode(code);

  setLoading(true); // ✅ start loading
  await new Promise((resolve) => setTimeout(resolve, 50)); // ensure overlay renders

  try {
    const response = await fetch("http://localhost:3001/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: signupEmail, code }),
    });

    if (!response.ok) throw new Error("Failed to send confirmation code email.");

    setSignupMessage("Confirmation code sent to your email. Please check your inbox.");
    setSignupStep(2);
    startCountdown(); // start countdown after sending code
  } catch (error) {
    setSignupMessage(error.message);
  } finally {
    setLoading(false); // ✅ stop loading
  }
};

const handleSendConfirmationCode = async (e) => {
  e.preventDefault();
  await sendConfirmationCode();
};



const handleConfirmCode = async (e) => {
  e.preventDefault();

  if (isCodeExpired) {
    setSignupMessage("The confirmation code has expired. Please request a new one.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3001/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: signupEmail, code: confirmationCode }),
    });

    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error("Invalid confirmation code.");
    }

    if (!response.ok) {
      throw new Error(data.error || "Invalid confirmation code.");
    }

    // ✅ Code verified
    const userCredential = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
    console.log("User signed up:", userCredential.user);

    setSignupMessage("Signup successful!");
    setSignupEmail("");
    setSignupPassword("");
    setConfirmationCode("");
    setSignupStep(1);

    setTimeout(() => {
      closeSignupPopup();
      navigate("/dashboard");
    }, 1000);
  } catch (error) {
    setSignupMessage(error.message);
  }
};

const [forgotStep, setForgotStep] = useState(1);
const [forgotEmail, setForgotEmail] = useState("");
const [otp, setOtp] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [showForgotPopup, setShowForgotPopup] = useState(false);
const [loading, setLoading] = useState(false);


const handleForgotPassword = () => {
  setShowLoginPopup(false);
  setShowForgotPopup(true);
  setForgotStep(1); // reset to first step
};


const handleBackToLoginClick = () => {
  setShowForgotPopup(false); // hide forgot
  setShowLoginPopup(true);   // show login
};


const handleForgotSubmit = async () => {
  setLoading(true); // start loading

  try {
    if (forgotStep === 1) {
      if (!forgotEmail) {
        alert("Please enter your email");
        setLoading(false);
        return;
      }

      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

      const res = await fetch("http://localhost:3001/recovery-send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail })
      });

      const data = await res.json();
      if (res.ok) {
        console.log("OTP sent:", otpCode);
        setForgotStep(2);
      } else {
        alert(data.error || "Failed to send OTP");
      }
    }

    if (forgotStep === 2) {
      const res = await fetch("http://localhost:3001/recovery-verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, code: otp })
      });

      const data = await res.json();
      if (res.ok) {
        setForgotStep(3);
      } else {
        alert(data.error || "Invalid OTP");
      }
    }

  } catch (err) {
    console.error(err);
    alert("An error occurred");
  } finally {
    setLoading(false); // stop loading
  }


  // Step 3: reset password
  if (forgotStep === 3) {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // TODO: send new password to backend
    alert("Password updated successfully!");
    setShowForgotPopup(false);
  }
};
const [forgotTimeLeft, setForgotTimeLeft] = useState(0);
const [isForgotCodeExpired, setIsForgotCodeExpired] = useState(false);
const [forgotMessage, setForgotMessage] = useState("");

useEffect(() => {
  // On component mount, check if there’s an existing expiry time in localStorage
  const expiry = localStorage.getItem("forgotOtpExpiry");
  if (expiry) {
    const now = Date.now();
    const timeLeft = Math.floor((parseInt(expiry) - now) / 1000);

    if (timeLeft > 0) {
      setIsForgotCodeExpired(false);
      setForgotTimeLeft(timeLeft);
      startForgotCountdown(timeLeft); // Resume countdown
    } else {
      setIsForgotCodeExpired(true);
      setForgotTimeLeft(0);
    }
  }
}, []);

const startForgotCountdown = (startFrom = 60) => {
  const expiryTime = Date.now() + startFrom * 1000;
  localStorage.setItem("forgotOtpExpiry", expiryTime); // Save to localStorage

  setForgotTimeLeft(startFrom);
  setIsForgotCodeExpired(false);

  const countdownInterval = setInterval(() => {
    setForgotTimeLeft((prev) => {
      if (prev <= 1) {
        clearInterval(countdownInterval);
        setIsForgotCodeExpired(true);
        localStorage.removeItem("forgotOtpExpiry"); // Clean up after expiry
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
};

const sendForgotOtpCode = async () => {
  if (!forgotEmail) {
    setForgotMessage("Please enter your email.");
    return;
  }
  setLoading(true);
  try {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const res = await fetch("http://localhost:3001/recovery-send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: forgotEmail, code: otpCode }),
    });

    if (!res.ok) throw new Error("Failed to send OTP code.");
    setForgotStep(2);
    setForgotMessage("OTP sent to your email.");
    startForgotCountdown(); // Start countdown from 60s
  } catch (error) {
    setForgotMessage(error.message);
  } finally {
    setLoading(false);
  }
};

// end function...


// ----------------------------------------------------------------------------------


// stracture start ....

    return (
      <div className="min-h-screen bg-[#121212] text-white font-sans">
        
      <Nav
      openLoginPopup={openLoginPopup}
      openSignupPopup={openSignupPopup} />


{/* ------------------------------------------------------------ login popup box ----------------------------------------------------- */}
        {/* Login Popup */}
        {showLoginPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-[#2C2F4A] w-[90%] max-w-md rounded-xl shadow-2xl p-8 relative text-white border border-[#5B5F80]">
              <button
                onClick={closeLoginPopup}
                aria-label="Close login popup"
                className="absolute top-4 right-4 text-[#A0AEC0] hover:text-white text-2xl font-bold"
              >
                ×
              </button>

              <h2 className="text-3xl font-extrabold text-center text-[#C3BFFA] mb-1">
                Welcome Back
              </h2>
              <p className="text-center text-sm text-[#9CA3AF] mb-6">
                Log in to continue shopping
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 rounded-md bg-[#3B3F63] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 rounded-md bg-[#3B3F63] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="submit"
                  className="w-full bg-[#6C63FF] hover:bg-[#5848D6] text-white py-2 rounded-md font-semibold transition"
                >
                  Log In
                </button>

                {message && (
                  <p className="text-center text-sm text-[#F87171]">{message}</p>
                )}
              </form>

              {/* Google Login Button */}
              <div className="w-full mt-4 flex flex-col items-center">
                <div ref={googleButtonRef} className="flex justify-center"></div>

                {/* Forgot Password Link */}
                <button
                  type="button"
                  onClick={handleForgotPassword} // no argument
                  className="mt-3 text-sm text-[#89F0D6] hover:text-white underline"
                >
                  Forgot Password?
                </button>
              </div>

              <div className="text-center mt-4 text-sm text-[#A0AEC0]">
                Don't have an account?{" "}
                <button
                  onClick={() => {
                    closeLoginPopup();
                    openSignupPopup();
                  }}
                  className="underline hover:text-white"
                >
                  Sign up
                </button>
              </div>
            </div>
          </div>
        )}
{showForgotPopup && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
    <div className="bg-[#2C2F4A] w-[90%] max-w-md min-h-[420px] rounded-xl shadow-2xl p-8 relative text-white border border-[#5B5F80] flex flex-col justify-between">

      {/* Loading Spinner Overlay covering entire box */}
      {loading && (
        <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center rounded-xl">
          <div className="w-16 h-16 border-4 border-t-[#6C63FF] border-b-[#6C63FF] border-l-transparent border-r-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Close Button */}
      <button
        onClick={() => setShowForgotPopup(false)}
        className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold"
        disabled={loading} // prevent closing while loading
      >
        ×
      </button>

      {/* top section - Titles */}
      <div>
        {forgotStep === 1 && (
          <>
            <h2 className="text-3xl font-extrabold text-center text-[#C3BFFA] mb-2 mt-2">
              Forgot Password
            </h2>
            <p className="text-center text-sm text-[#9CA3AF] mb-6">
              Enter your email to get a verification code
            </p>
          </>
        )}

        {forgotStep === 2 && (
          <>
            <h2 className="text-3xl font-extrabold text-center text-[#C3BFFA] mb-1">
              Verify OTP
            </h2>
            <p className="text-center text-sm text-[#9CA3AF] mb-6">
              Enter the 6-digit code sent to {forgotEmail}
            </p>
          </>
        )}

        {forgotStep === 3 && (
          <>
            <h2 className="text-3xl font-extrabold text-center text-[#C3BFFA] mb-2 mt-2">
              Reset Password
            </h2>
            <p className="text-center text-sm text-[#9CA3AF] mb-6">
              Create your new password
            </p>
          </>
        )}
      </div>

      {/* center section - Form */}
      <div className="flex flex-col justify-center flex-1 relative">

        {forgotStep === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 rounded bg-[#1E2035] border border-[#5B5F80]"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              disabled={loading} // disable input while loading
            />
            <button
              className="mt-4 w-full bg-blue-500 hover:bg-blue-400 transition p-3 rounded font-semibold"
              onClick={handleForgotSubmit}
              disabled={loading} // disable while loading
            >
              Send OTP
            </button>
          </>
        )}

{forgotStep === 2 && (
  <>
    {/* OTP Input Fields */}
    <div className="flex justify-center space-x-2 mt-4">
      {[...Array(6)].map((_, i) => (
        <input
          key={i}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          className="w-10 h-12 text-center text-xl rounded-md bg-[#3B3F63] text-white placeholder-[#B5BFD3] focus:outline-none focus:ring-2 focus:ring-[#89F0D6]"
          value={otp[i] || ""}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/, "");
            const newOtp = otp.split("");
            newOtp[i] = val || "";
            setOtp(newOtp.join(""));
            if (val && i < 5) {
              const nextInput = document.getElementById(`otp-input-${i + 1}`);
              if (nextInput) nextInput.focus();
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace") {
              if (otp[i]) {
                const newOtp = otp.split("");
                newOtp[i] = "";
                setOtp(newOtp.join(""));
              } else if (i > 0) {
                const prevInput = document.getElementById(`otp-input-${i - 1}`);
                if (prevInput) prevInput.focus();
              }
            }
          }}
          id={`otp-input-${i}`}
          disabled={loading || isForgotCodeExpired}
          required
        />
      ))}
    </div>

    {/* Confirm Button */}
    <button
      className="mt-4 w-full bg-green-500 hover:bg-green-400 transition p-3 rounded font-semibold"
      onClick={handleForgotSubmit}
      disabled={loading || isForgotCodeExpired}
    >
      Verify OTP
    </button>

    {/* Info text */}
    <p className="text-sm text-gray-300 text-center mt-4">
      Confirmation code sent to your email. Please check your inbox.
    </p>

    {/* Countdown */}
    <div className="text-center mt-2 text-sm text-[#A0AEC0]">
      {forgotTimeLeft > 0 && !isForgotCodeExpired ? (
        <p>
          Code expires in{" "}
          <span className="text-[#3B82F6] font-bold">{forgotTimeLeft}s</span>
        </p>
      ) : (
        <p className="text-red-400">Code expired. Please request a new one.</p>
      )}

      {(!forgotTimeLeft || isForgotCodeExpired) && (
        <button
          onClick={() => {
            setOtp("");
            setForgotMessage("");
            sendForgotOtpCode(); 
          }}
          className="underline hover:text-white mt-1"
          disabled={loading}
        >
          Resend Code
        </button>
      )}
    </div>
  </>
)}



        {forgotStep === 3 && (
          <>
            <input
              type="password"
              placeholder="New Password"
              className="w-full p-3 rounded bg-[#1E2035] border border-[#5B5F80] mb-2"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading} // disable input while loading
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full p-3 rounded bg-[#1E2035] border border-[#5B5F80]"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading} // disable input while loading
            />
            <button
              className="mt-4 w-full bg-purple-500 hover:bg-purple-400 transition p-3 rounded font-semibold"
              onClick={handleForgotSubmit}
              disabled={loading} // disable while loading
            >
              Update Password
            </button>
          </>
        )}
      </div>
    </div>
  </div>
)}




  {/* Signup Popup */}
{showSignupPopup && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
    <div className="bg-[#2C2F4A] w-[90%] max-w-md rounded-xl shadow-2xl p-8 relative text-white border border-[#5B5F80]">

      {/* Loading Spinner Overlay covering entire box */}
      {loading && (
        <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center rounded-xl">
          <div className="w-16 h-16 border-4 border-t-[#6C63FF] border-b-[#6C63FF] border-l-transparent border-r-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <button
        onClick={closeSignupPopup}
        aria-label="Close signup popup"
        className="absolute top-4 right-4 text-[#A0AEC0] hover:text-white text-2xl font-bold"
        disabled={loading} // prevent closing while loading
      >
        ×
      </button>

      {signupStep === 1 && (
        <>
          <h2 className="text-3xl font-extrabold text-center text-[#C3BFFA] mb-1">Create Account</h2>
          <p className="text-center text-sm text-[#9CA3AF] mb-6">Join us to get the best deals!</p>

          <form onSubmit={handleSendConfirmationCode} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 rounded-md bg-[#3B3F63] text-white placeholder-[#B5BFD3] focus:outline-none focus:ring-2 focus:ring-[#89F0D6]"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              required
              disabled={loading} // disable input while loading
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 rounded-md bg-[#3B3F63] text-white placeholder-[#B5BFD3] focus:outline-none focus:ring-2 focus:ring-[#89F0D6]"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              required
              disabled={loading} // disable input while loading
            />
            <button
              type="submit"
              className="w-full bg-[#6C63FF] hover:bg-[#5848D6] text-white py-2 rounded-md font-semibold transition"
              disabled={loading} // disable while sending code
            >
              Send Confirmation Code
            </button>
            {signupMessage && (
              <p className="text-sm text-[#3B82F6] text-center">{signupMessage}</p>
            )}
          </form>

          <div className="text-center mt-4 text-sm text-[#A0AEC0]">
            Already have an account?{" "}
            <button
              onClick={() => {
                closeSignupPopup();
                openLoginPopup();
              }}
              className="underline hover:text-white"
              disabled={loading} // disable while loading
            >
              Log in
            </button>
          </div>
        </>
      )}

      {signupStep === 2 && (
        <>
          <h2 className="text-3xl font-extrabold text-center text-[#C3BFFA] mb-1">
            Confirm Your Email
          </h2>
          <p className="text-center text-sm text-[#9CA3AF] mb-6">
            Enter the 6-digit code sent to {signupEmail}
          </p>

          <form onSubmit={handleConfirmCode} className="space-y-4">
            <div className="flex justify-center space-x-2">
              {[...Array(6)].map((_, i) => (
                <input
                  key={i}
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={1}
                  className="w-10 h-12 text-center text-xl rounded-md bg-[#3B3F63] text-white placeholder-[#B5BFD3] focus:outline-none focus:ring-2 focus:ring-[#89F0D6]"
                  value={confirmationCode[i] || ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/, '');
                    const newCode = confirmationCode.split('');
                    newCode[i] = val || '';
                    setConfirmationCode(newCode.join(''));
                    if (val && i < 5) {
                      const nextInput = document.getElementById(`code-input-${i + 1}`);
                      if (nextInput) nextInput.focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace') {
                      if (confirmationCode[i]) {
                        const newCode = confirmationCode.split('');
                        newCode[i] = '';
                        setConfirmationCode(newCode.join(''));
                      } else if (i > 0) {
                        const prevInput = document.getElementById(`code-input-${i - 1}`);
                        if (prevInput) prevInput.focus();
                      }
                    }
                  }}
                  onPaste={(e) => {
                    e.preventDefault();
                    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
                    if (paste) {
                      const newCode = confirmationCode.split('');
                      paste.split('').forEach((char, idx) => {
                        if (i + idx < 6) {
                          newCode[i + idx] = char;
                        }
                      });
                      setConfirmationCode(newCode.join(''));
                      const lastIndex = Math.min(i + paste.length - 1, 5);
                      const lastInput = document.getElementById(`code-input-${lastIndex}`);
                      if (lastInput) lastInput.focus();
                    }
                  }}
                  id={`code-input-${i}`}
                  required
                  disabled={loading} // disable input while loading
                />
              ))}
            </div>

            <button
              type="submit"
              className="w-full bg-[#6C63FF] hover:bg-[#5848D6] text-white py-2 rounded-md font-semibold transition"
              disabled={loading} // disable while loading
            >
              Confirm and Sign Up
            </button>

            {signupMessage && (
              <p className="text-sm text-[#3B82F6] text-center">{signupMessage}</p>
            )}
          </form>

          <div className="text-center mt-4 text-sm text-[#A0AEC0]">
            {timeLeft > 0 && !isCodeExpired ? (
              <p>
                Code expires in{' '}
                <span className="text-[#3B82F6] font-bold">{timeLeft}s</span>
              </p>
            ) : (
              <p className="text-red-400">Code expired. Please request a new one.</p>
            )}

            {!timeLeft || isCodeExpired ? (
              <button
                onClick={() => {
                  setSignupMessage('');
                  sendConfirmationCode();
                }}
                className="underline hover:text-white"
                disabled={loading} // disable resend while loading
              >
                Resend Code
              </button>
            ) : null}
          </div>
        </>
      )}
    </div>
  </div>
)}



        {/* Sidebar + Products */}
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar */}
          <aside className="hidden lg:block lg:w-64 h-[calc(100vh-64px)] bg-[#1f1f1f] p-6 shadow-md overflow-y-auto sticky top-[64px]">
            <h2 className="text-lg font-semibold mb-4 text-[#00B8A9]">🔍 Filter Products</h2>
            <div>
              <h3 className="font-medium mb-2 text-[#00B8A9]">By Category</h3>
              <div className="space-y-2">
                {["Headphones", "Gaming Headsets", "Speakers", "Laptops"].map((cat) => (
                  <label key={cat} className="flex items-center space-x-2 text-gray-300">
                    <input type="checkbox" className="accent-[#4C4C9D]" />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1 p-8">
            {/* Sort and Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <div className="flex gap-2">
                {["Relevant", "Latest", "Top Sale"].map((option) => (
                  <button
                    key={option}
                    className="px-4 py-1.5 rounded-full text-sm font-medium bg-[#2c2c2e] text-gray-200 hover:bg-[#444] transition"
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-400">Price:</label>
                <input
                  type="number"
                  placeholder="Min"
                  className="w-20 px-2 py-1 rounded-md bg-[#1e1e1e] text-gray-200 border border-gray-600 focus:outline-none"
                />
                <span className="text-gray-400">–</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-20 px-2 py-1 rounded-md bg-[#1e1e1e] text-gray-200 border border-gray-600 focus:outline-none"
                />
                <button className="px-3 py-1 rounded-md bg-[#00B8A9] text-white hover:bg-[#009688] transition text-sm">
                  Apply
                </button>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className={`relative bg-[#1e1e1e] p-3 rounded-lg shadow hover:shadow-lg transition duration-300 flex flex-col justify-between border ${
                    product.soldOut ? "opacity-60 cursor-not-allowed" : "border-[#2a2a2a]"
                  }`}
                >
                  {/* 🟥 Sold Out Badge at Top-Left */}
                  {product.soldOut && (
                    <div className="absolute top-2 left-2 z-10">
                      <img src={soldOutImg} alt="Sold Out" className="w-16 h-auto" />
                    </div>
                  )}

                  <div className="mb-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="rounded-md w-full h-36 object-cover mb-2"
                    />

                    {product.preferred && (
                      <span className="text-[11px] font-bold text-[#f44336]">★ Preferred</span>
                    )}

                    <h3 className="text-sm font-semibold text-white leading-tight mb-1 line-clamp-2">
                      {product.name}
                    </h3>

                    {/* ⭐ Rating */}
                    <div className="flex items-center mb-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <HeartIcon
                          key={i}
                          className={`h-4 w-4 mr-0.5 ${
                            i <= product.rating ? "text-[#ff6b81]" : "text-gray-600"
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-xs text-gray-400">{product.rating.toFixed(1)}</span>
                    </div>

                    {/* 💰 Price and Discount */}
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-[#00B8A9] font-bold text-base">₱{product.price}</div>
                      <div className="text-sm text-red-400 font-semibold">{product.discount}% OFF</div>
                    </div>

                    <div className="text-xs text-teal-400 mb-0.5">{product.shipping}</div>
                    <div className="text-xs text-gray-400">📍 {product.location}</div>
                  </div>

                  {/* 🛒 Buttons */}
                  <div className="mt-auto flex gap-2">
                    <button
                      disabled={product.soldOut}
                      className={`p-2 rounded-full transition ${
                        product.soldOut
                          ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                          : "bg-gray-700 hover:bg-gray-600 text-white"
                      }`}
                      title="Add to Cart"
                    >
                      <ShoppingCartIcon className="h-5 w-5" />
                    </button>
                    <button
                      disabled={product.soldOut}
                      className={`flex-1 py-1.5 rounded-full font-medium text-sm transition text-center ${
                        product.soldOut
                          ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                          : "bg-[#00B8A9] hover:bg-[#009688] text-white"
                      }`}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    );
  }

  export default Hero;
