import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackToReportButton = () => {
  return (
    <Link to="/">
      <div className="fixed bottom-16 right-4 md:bottom-20 bg-blue-700 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg flex items-center justify-center">
        <ArrowLeft className="h-5 w-5" />
      </div>
    </Link>
  );
};

export default BackToReportButton;
