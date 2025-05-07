
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DocumentUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      toast({
        title: "File selected",
        description: `${e.target.files[0].name} is ready to upload`,
      });
    }
  };
  
  const handleUpload = () => {
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please select a file first",
      });
      return;
    }
    
    setUploading(true);
    
    // Simulating upload
    setTimeout(() => {
      setUploading(false);
      toast({
        title: "Success!",
        description: "Document uploaded successfully",
      });
      setSelectedFile(null);
    }, 2000);
  };
  
  return (
    <section className="mb-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 -z-10" />
      <div className="container mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto backdrop-blur-sm border border-primary/10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Upload Your Documents
            </h2>
            <p className="text-neutral-600">
              Securely upload your property documents for verification. We accept PDF, JPG, and PNG files.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="border-2 border-dashed border-primary/20 rounded-xl p-8 transition-colors hover:border-primary/40 bg-gradient-to-b from-white to-primary/5">
              <div className="mb-4 flex justify-center">
                <div className="p-4 rounded-full bg-primary/10">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
              </div>
              
              <div className="text-center space-y-4">
                <p className="text-sm text-neutral-600">
                  Drag and drop your files here, or click to browse
                </p>
                
                <Input 
                  type="file" 
                  id="document-upload"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                
                <Button 
                  variant="outline"
                  className="bg-white hover:bg-primary/5"
                  onClick={() => document.getElementById('document-upload')?.click()}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Browse Files
                </Button>
              </div>
              
              {selectedFile && (
                <div className="mt-4 p-3 bg-primary/5 rounded-lg flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-neutral-700">
                      {selectedFile.name}
                    </span>
                  </div>
                  <span className="text-xs text-neutral-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              )}
            </div>
            
            <Button 
              onClick={handleUpload} 
              disabled={!selectedFile || uploading}
              className="w-full bg-primary hover:bg-primary/90 text-white"
            >
              {uploading ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Uploading...
                </>
              ) : (
                <>Verify Document</>
              )}
            </Button>
            
            <div className="text-center text-sm text-neutral-500">
              <p>Maximum file size: 10MB</p>
              <p>Supported formats: PDF, JPG, PNG</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DocumentUpload;
