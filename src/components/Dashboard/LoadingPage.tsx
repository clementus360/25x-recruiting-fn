import { useEffect, useState } from "react";
import { Bars } from "react-loader-spinner";

// components/LoadingPage.tsx
export default function LoadingPage({ loading }: { loading: boolean }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (loading) {
      setIsVisible(true);
    } else {
      // Delay the hiding to allow the fade-out animation to complete
      setTimeout(() => setIsVisible(false), 500); // Match the transition duration
    }
  }, [loading]);

  return isVisible ? (
    <div
      className={`absolute inset-0 bg-black bg-opacity-5 z-10 flex items-center justify-center fade-in-overlay ${
        loading ? "active" : ""
      }`}
    >
      <div className="flex flex-col items-center justify-center py-24">
        <Bars
          visible={true}
          height="40"
          width="40"
          color="#777777"
          ariaLabel="bars-loading"
          wrapperStyle={{}}
          wrapperClass="flex items-center justify-center"
        />
      </div>
    </div>
  ) : null;
}
