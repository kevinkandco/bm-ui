import { Star } from "lucide-react";

export default function Component() {
  
  const handleFeedbackClick = () => {
    window.open(import.meta.env.VITE_FEEDBACK_PATH, "_blank");
  };

  return (
    <>
      <button
        onClick={handleFeedbackClick}
        className="fixed right-0 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-6 shadow-white-20 rounded-l-lg rounded-r-none shadow-lg transition-all duration-200 hover:shadow-xl z-50 hover:translate-x-[-10px]"
        style={{
          writingMode: "vertical-rl",
          textOrientation: "mixed",
        }}
      >
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4" />
          <span className="font-medium text-sm tracking-wide">Feedback</span>
        </div>
      </button>
    </>
  );
}
