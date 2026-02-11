import { useState } from "react";
import { BusinessRoadmap } from "@/components/BusinessRoadmap";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";

const BusinessPage = () => {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  const handleGenerateImage = async (businessId: string) => {
    setIsGeneratingImage(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("generate-business-image", {
        body: { businessId },
      });

      if (error) {
        throw error;
      }

      if (data?.imageUrl) {
        setGeneratedImage(data.imageUrl);
        setImageDialogOpen(true);
        toast.success("Business visualization generated!");
      } else {
        throw new Error("No image received");
      }
    } catch (error: any) {
      console.error("Image generation error:", error);
      toast.error(error.message || "Failed to generate image. Please try again.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = "business-visualization.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Image downloaded!");
  };

  return (
    <>
      <BusinessRoadmap 
        onGenerateImage={handleGenerateImage}
        isGeneratingImage={isGeneratingImage}
      />
      
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Your Future Business Visualization</span>
            </DialogTitle>
          </DialogHeader>
          {generatedImage && (
            <div className="space-y-4">
              <div className="rounded-xl overflow-hidden border border-border">
                <img 
                  src={generatedImage} 
                  alt="Generated business visualization" 
                  className="w-full h-auto"
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setImageDialogOpen(false)}>
                  <X className="w-4 h-4 mr-2" />
                  Close
                </Button>
                <Button variant="eco" onClick={downloadImage}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Image
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BusinessPage;
