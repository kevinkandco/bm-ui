import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks/useApi";
import useAuthStore from "@/store/useAuthStore";
import {
  Check,
  Copy,
  Eye,
  EyeOff,
  KeyRound,
  Loader,
  Lock,
  Mail,
  RefreshCcw,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const DownloadApp = () => {
  const user = useAuthStore((state) => state.user);
  const { call } = useApi();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownload = (filePath: string) => {
    const link = document.createElement("a");
    link.href = filePath;

    const fileName = filePath.split("/").pop() || "download";
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGeneratePassword = async () => {
    try {
      setLoading(true);

      const response = await call("get", "/settings/generate-password");
      if (!response) {
        setLoading(false);
        return;
      }

      setPassword(response.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
      toast.error(err.data.message || "Failed to generate password");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 md:col-span-3">
      <h2 className="mb-6 text-xl font-semibold text-text-primary">
        Download Desktop App
      </h2>
      <div className="w-full flex flex-col justify-center items-center">
        <div className="w-[500px] flex flex-col items-center mt-10">
          <img
            src="/lovable-uploads/10c02016-8844-4312-a961-c0bfeb309800.png"
            className="w-36 rounded-3xl mb-4"
          />
          <h1 className="text-5xl font-semibold text-text-primary my-3">
            Brief Me Desktop App
          </h1>
          <h4 className="mt-3 text-lg font-medium text-text-secondary text-center">
            Get intelligent briefings, meeting summaries, and productivity tools
            — all in one place. Download the Brief Me desktop app for a faster,
            smarter workflow.
          </h4>

          <div className="w-full mt-4 flex flex-col items-center gap-5 md:flex-row md:justify-center md:gap-3">
            <Button
              variant="default"
              className="px-6 py-3 text-white transition-all rounded-xl shadow-sm hover:shadow-md"
              onClick={() => handleDownload("/electron/Brief-me.zip")} // Add your Mac file path here
            >
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  clipRule="evenodd"
                  fillRule="evenodd"
                  height="40"
                  strokeLinejoin="round"
                  strokeMiterlimit="2"
                  viewBox="0 0 38 45"
                  width="40"
                >
                  <image
                    height="45"
                    width="38"
                    href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAtCAYAAADC+hltAAAACXBIWXMAAA7EAAAOxAGVKw4bAAACK0lEQVRYhc2Y3XHbMBAG9zh5j1JBlArCEliCOjA7iEtIKnA6kNKBUoGUCixVYKkCyxV8eQCgH5igaSfieWc84xEIYHkEcACMKyJpAtwAM8DMrLlmf4OQdCvpUSfW3k5IWug5i/coJUm3nlLfC1KSNPWSmvRILVykolgpWge3aEWxTUGsdZOKYu9PqkNsLan+l/Y+DOhwCnwFUkc7YGtmm+zR38AGWJvZOqv/GWjOnl3HNg6vNpbUSFr1zLQHSXddkVGYod8k3ffUf5Q0V0hbg6XmPQ2WOlnFvz6ZUt3ZS0KTNzT8vyhnBkepRJtcqvPPx2mAe/BEmFgnFAa6Jxtlk8Ci2IrL6TwmT0BtZrvzHyuFdaZxEEq0uRSEMdY/Va/L3syWXQUVvtH6WSqoCOnCizytHTFJGtMk41MpX7qKmZmVyqpSgTcVsPfqXFJTKqvI08C4FFOg96e8KRVUhN2kF7UK5wJvMYC7PIFDECsuciMxAVa5XBUXuK2P05GaIHecDGnwF3PWiNTAvcKG9SjWmeGd+AJRLH7OX646JxYQd7BwPJg+OMkk9mY2hbMFNu4ivaPWpn8usrtz1P6cXx5fpKQYtR8jC0E4kLS9Tyicxkt3Xddi2P2spHpEqdctVZLaEaSeHXQTxa1tkgPmA95jz+W+rgY+vlBnCzRvuiOLcjNJu463PShcCE8L9RqV7/yXpUgleiOWddQCSWIHLIe8bRSfEXYRAIuuk3fOX4gyOCFrIboOAAAAAElFTkSuQmCC"
                  />
                </svg>
              </div>
              Download for Mac
            </Button>

            <Button
              variant="default"
              className="px-6 py-3 text-white transition-all rounded-xl shadow-sm hover:shadow-md"
              onClick={() => handleDownload("/electron/Brief-me_amd64.deb")}
            >
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  clipRule="evenodd"
                  fillRule="evenodd"
                  height="40"
                  strokeLinejoin="round"
                  strokeMiterlimit="2"
                  viewBox="0 0 43 51"
                  width="40"
                >
                  <image
                    height="51"
                    width="43"
                    href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAAzCAYAAAAO2PE2AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAEFUlEQVRogcVZv2/TQBT+rupOGFg6eWBCSGRjQjVirBBhgq1GQkiwNB0RSLWY2Fr+A3dhTRiYMRMSS9ORKenGlnRhQvoY7rk5X+8S+86ln2Tl/OPe+/z53bt7F6ADkNwlOSI55xJTubbbhY9okOyRPOF6TEmm1022CdEKc5L96yKatSBqKtwL9bkRwTcL6JME9otDgKoVylCfKoZssFOlgvwGhUHDgfJdjvPA/t1BPulY2vZgy0xijlBIr4NsQnIghCYVE7k/qEib9wR5iM+YbAAAPQCHAPoAFsaLJABGAPpCeOHq3Babkf23oNPRfQA/AfwAcAvAHehY3QPwItJHPEjOSOYkP1DPTgfyO5JPPSL5Tp7tLH2Fki1IfvYlUwNzku9JLoxr0/9NdrCG5ILkUNoTkqV58zrIDi3FKhTUITKnDpd9xzODtj5jZrASwBcA2wCmYiuR9kDanwDkAAoATywTpVLqYaj/NkR7ok4pCtvqzmgkfpKpJ1RSv5fuyB5Vn9sgn8mndxKQF7BxctVEzYGVtOjnUze/KqJ9LuusIqB/6SGcdk3UrreSABu5h+yUERWEy9HIMD4JtLEqN3cTvw4neYQt10CLtms6sKvYNMJW9eJzCQs77SUxRBMxshDjZbCxpc2xQTizCBcxhqv5vZo+0w7IJga5KS8PvMTVr8niOwVwBr3QPlVKlbFklVIz6PoM0NPyzHoka23UUOCoK1UN26aatrLOJeQ6ZTP5XQA470JVA3b6M0ufxBUKXrLy8B6AU+gaaxzPz0sO0GFm4lK5vkrZXAyMAdxD92TXoRlZUdXcV01w+bPFYma0G1W/PmUzo11lgU7Kacsu4Nix8cFXiqfyewat8NNwTl70oIkeAbiBZdjdRP2rXsBZ1lDXR1sA7gL4BU02k/zYCSQNZg5iE+hyqWyUfVjfn5qTfNZlnpXp9jnr/0GYKNoaqyVpkh+lfciItachREH3CmxC8i3Joc9ATvKbHL63zQ3jJ66k3ZCsWd7ss76IGRuiuFOlh5yNOclX1nnrfVaL7JTka5J71Asmc4E/jyFLauUL4/yELUOC/sLRhVooVHn2rKGvFMBv6CkY0LNM2oJoH8Dtps8DOCR5YBvxVZ0+vKSOtUlTZbksOIerDHswJZmEbia/A/BYKdVvMrOJot/gmO8bIgGwsyHKbAd0frROVVFzD3Wif1r6AvRC/esmAHc+W48DAFVGGMNaj0LH8gCXl35bLXwcA8gvZk66tyyb4m3L5yesZxMfaht7FTbk7Y+xHOFtsINlLdUEC2jVV+ELgL5rXbApFy9uyBtVKcneU7Xx1zp3ETfHwwyrU92xUipb49MNLrcy7bVChTdyP2lgK5HDlybDSK4hXlBXuw8i7BxJXC5EiEYp7R/kAzeN0u5YkgAAAABJRU5ErkJggg=="
                  />
                </svg>
              </div>
              Download for Linux
            </Button>
          </div>
        </div>
      </div>
      <div className="py-6">
        <h3 className="text-lg font-semibold text-text-primary">
          Your Login Info
        </h3>
        <div className="mt-4">
          <p>Email: {user?.email}</p>
        </div>
        <div className="mt-4">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Password
          </label>
          <div className="flex items-center gap-2">
            <div className="relative w-full">
              <span
                className={`absolute left-3 top-1/2 -translate-y-1/2 text-text-primary ${
                  !password && "opacity-50"
                }`}
              >
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                disabled={!password}
                className={`w-full pl-10 pr-10 p-1.5 rounded-lg bg-white/10 border border-white/20 text-text-primary focus:ring-2 focus:ring-accent-primary focus:border-transparent ${
                  !password && "opacity-50 cursor-not-allowed"
                }`}
                placeholder="Your password will show here"
              />
              {password && (
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-10 top-1/2 -translate-y-1/2 text-text-primary hover:text-accent-primary"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              )}

              {password && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5"
                  aria-label={copied ? "Copied" : "Copy to clipboard"}
                >
                  <span className="sr-only">{copied ? "Copied" : "Copy"}</span>

                  <Copy
                    className={`h-5 w-5 transition-all duration-300 text-text-primary ${
                      copied ? "scale-0" : "scale-100"
                    }`}
                  />
                  <Check
                    className={`absolute inset-0 m-auto h-5 w-5 transition-all duration-300 text-green-400 ${
                      copied ? "scale-100" : "scale-0"
                    }`}
                  />
                </button>
              )}
            </div>
            <Button
              variant="outline"
              className="py-1.5 px-4 flex items-center gap-2"
              onClick={handleGeneratePassword}
            >
              {loading ? (
                <Loader className="animate-spin text-white" />
              ) : password ? (
                <RefreshCcw className="h-5 w-5 text-accent-primary" />
              ) : (
                <KeyRound className="h-5 w-5 text-accent-primary" />
              )}
              {password ? "Re-generate" : "Generate"} Password
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadApp;
