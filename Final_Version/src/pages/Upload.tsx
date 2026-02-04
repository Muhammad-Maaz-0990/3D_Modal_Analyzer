import { Navigation } from "@/components/Navigation";
import { UploadInterface } from "@/components/UploadInterface";
import { Footer } from "@/components/Footer";

const Upload = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <UploadInterface />
      <Footer />
    </div>
  );
};

export default Upload;
