import { useCallback, useEffect, useState } from "react";
import { handleCatchBlockError } from "@/utility";
import { loginWithGoogle } from "@/api/user";
import { toast } from "react-toastify";
import useUserStore from "@/stores/user.store";
import { useShallow } from "zustand/react/shallow";
import { useNavigate } from "react-router-dom";


function GoogleLoginButton() {
  const { stFnUpdateUser } = useUserStore(useShallow((state) => ({ stFnUpdateUser: state.stFnUpdateUser })))
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCallbackResponse = useCallback(
  async (data: { credential: string }) => {
    try {
      setLoading(true);

      const res = await loginWithGoogle(data.credential);

      if (res.success) {
        toast.success("Login successful!");
        stFnUpdateUser({ ...res.user, accessToken: res.accessToken });
        navigate("/app");
        return;
      } else {
        toast.error("Login failed: " + res.message);
      }

      setLoading(false);
    } catch (err) {
      console.error("Error in handleCallbackResponse:", err);
      handleCatchBlockError(err, "error in login with google");
      setLoading(false);
    }
  },
  [stFnUpdateUser, navigate]
  );
  
  useEffect(() => {
    window?.google?.accounts?.id?.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleCallbackResponse
    });

    window.google.accounts.id.renderButton(
      document.getElementById("googleLoginDiv"),
      { theme: "outline", width: 130, text: "signin" }
    );
  }, [handleCallbackResponse]);

  return <div className={loading?'bg-gray-500 cursor-not-allowed':''} id="googleLoginDiv"></div>;
}

export default GoogleLoginButton;