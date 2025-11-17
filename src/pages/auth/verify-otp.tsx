import { verifyOtp } from "@/api/user";
import React, { useState, useRef, type ChangeEvent, type KeyboardEvent, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";



const OTPVerification: React.FC = () => {
  const digits = 6;
  const [searchParams] = useSearchParams();
  const [otp, setOtp] = useState<string[]>(Array(digits).fill(""));
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const time = searchParams.get("expirey") ? searchParams.get("expirey") + ":00" : "00:00"
  const [timeLeft, setTimeLeft] = useState(time);

  const navigate = useNavigate();

  const email = searchParams.get("email") || "";


  const inputRefs = useRef<HTMLInputElement[]>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return; // allow only digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input when value is typed
    if (value && index < digits - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const pasted = e.clipboardData.getData("text").slice(0, digits);
    if (!/^\d+$/.test(pasted)) return;

    const newOtp = pasted.split("");
    setOtp(newOtp);

    inputRefs.current[digits - 1]?.focus();
  };

  const handleVerify = async () => {
    const fullOtp = otp.join("");

    try {
      setError("");
      setLoading(true);
      const payload = {
        email,
        otp: fullOtp
      }
      const res = await verifyOtp(payload);
      if (res.success) {
        toast.success("Signup successful! Please log in.");
        return navigate("/auth/login");
      } else {
        toast.error("Signup failed: " + res.message);
      }
      setLoading(false)
    } catch (err) {
      console.log(err)
      setError("Invalid OTP. Please try again.");
      setLoading(false)
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  const handleTimeLeft = () => {
    setTimeLeft(prev => {
      const [m, s] = prev.split(":").map(Number);

      if (m === 0 && s === 0) return prev;

      let min = m;
      let sec = s - 1;

      if (sec < 0) {
        min = min - 1;
        sec = 59;
      }

      return `${min}:${sec.toString().padStart(2, "0")}`;
    });
  }


  useEffect(() => {
    const interval = setInterval(handleTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
          Verify Your Email
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Enter the {digits}-digit verification code sent to your email.
        </p>

        {/* OTP Inputs */}
        <div
          className="flex justify-between gap-2 mb-4"
          onPaste={handlePaste}
        >
          {otp.map((value, index) => (
            <input
              key={index}
              ref={(el) => {
                if (el) inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={value}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange(e.target.value, index)
              }
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-center text-xl border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          ))}
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-center text-sm mb-2">{error}</p>
        )}
        <div className="flex justify-center mb-3">
          <span className="px-4 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium border border-gray-300 shadow-sm">
            ⏳ Time Left: <span className="text-red-600 font-semibold">{timeLeft}</span>
          </span>
        </div>

        {/* Verify Button */}
        <button
          disabled={!isOtpComplete || loading}
          onClick={handleVerify}
          className={`w-full py-3 rounded-lg text-white font-semibold transition 
          ${!isOtpComplete || loading ? "bg-gray-300" : "bg-indigo-600 hover:bg-indigo-700"}`}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {/* Resend */}
        <p className="text-center mt-4 text-gray-500 text-sm">
          Didn’t receive the code?{" "}
          <button disabled={timeLeft!=='0:00'} className="text-indigo-600 hover:underline font-medium disabled:text-gray-400 disabled:cursor-not-allowed! disabled:hover:no-underline">
            Resend OTP
          </button>
        </p>
      </div>
    </div>
  );
};

export default OTPVerification;
