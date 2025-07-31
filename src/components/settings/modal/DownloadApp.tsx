import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const DownloadApp = () => {
  const handleDownload = (filePath: string) => {
    const link = document.createElement("a");
    link.href = filePath;

    const fileName = filePath.split("/").pop() || "download";
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 md:col-span-3">
      <h2 className="mb-6 text-xl font-semibold text-text-primary">
        Download Your App
      </h2>

      <div className="flex flex-col items-center gap-5 md:flex-row md:justify-between md:gap-0">
        <Button
          variant="skyBlue"
          className="px-6 py-3 text-white transition-all rounded-xl shadow-sm hover:shadow-md"
          onClick={() => handleDownload("/electron/brief-me_0.0.0_amd64.deb")}
        >
          <Download className="mr-2 h-4 w-4" />
          Download for Linux
        </Button>

        <Button
          variant="skyBlue"
          className="px-6 py-3 text-white transition-all rounded-xl shadow-sm hover:shadow-md"
          onClick={() => handleDownload("/electron/brief-me_0.0.0.dmg")} // Add your Mac file path here
        >
          <Download className="mr-2 h-4 w-4" />
          Download for Mac
        </Button>
      </div>
    </div>
  );
};

export default DownloadApp;
