import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileType, CheckCircle2, AlertCircle, Box, Clock, DollarSign, Layers, Cpu, Cog, Download, Zap, Shield, TrendingUp, File, X, CreditCard, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ModelPreview } from "@/components/ModelPreview";
import { PaymentForm } from "@/components/PaymentForm";
import { useStripe } from '@stripe/react-stripe-js';
import { machines, materials, calculatePrice, getDeliveryTime, type Machine, type Material } from "@/data/manufacturingData";

const supportedFormats = [
  { ext: "STEP", color: "bg-primary/10 text-primary" },
  { ext: "IGES", color: "bg-primary/10 text-primary" },
  { ext: "STL", color: "bg-secondary/10 text-secondary" },
  { ext: "OBJ", color: "bg-secondary/10 text-secondary" },
  { ext: "3MF", color: "bg-accent/10 text-accent" },
];

interface FileAnalysis {
  dimensions: { length: number; width: number; height: number };
  volume: number;
  surfaceArea: number;
  triangleCount: number;
  material: string;
  complexity: "Low" | "Medium" | "High";
  feasibleProcesses: string[];
  qualityRating: string;
  // Legacy fields for backward compatibility
  boundingBox?: { x: number; y: number; z: number };
  faces?: number;
  density?: number;
}

const analyzeFileWithAPI = async (file: File): Promise<FileAnalysis> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/analyze-file', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Analysis failed: ${response.statusText}`);
  }

  const result = await response.json();
  
  // Transform API response to match interface (add backward compatibility)
  return {
    dimensions: result.dimensions,
    volume: result.volume,
    surfaceArea: result.surfaceArea,
    triangleCount: result.triangleCount,
    material: result.material,
    complexity: result.complexity,
    feasibleProcesses: result.feasibleProcesses,
    qualityRating: result.qualityRating,
    // Legacy compatibility
    boundingBox: {
      x: result.dimensions.length,
      y: result.dimensions.width,
      z: result.dimensions.height
    },
    faces: result.triangleCount,
    density: 7.9 // Default density for compatibility
  };
};

export const UploadInterface = () => {
  const stripe = useStripe();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<FileAnalysis | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(false);
  
  // Selection state
  const [selectedCategory, setSelectedCategory] = useState<"FDM" | "SLS" | "SLM" | "CNC" | null>(null);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [estimatedDelivery, setEstimatedDelivery] = useState<string | null>(null);
  
  // Order state
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [customerData, setCustomerData] = useState<{name: string; email: string} | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [isEmailSending, setIsEmailSending] = useState(false);
  
  const { toast } = useToast();
  const fileExt = uploadedFile?.name.split('.')?.pop()?.toLowerCase() as
    | "obj"
    | "stl"
    | "3mf"
    | "step"
    | "stp"
    | "iges"
    | "igs"
    | undefined;

  // Get available machines for selected category
  const availableMachines = selectedCategory ? machines.filter(m => m.category === selectedCategory) : [];
  
  // Get available materials for selected machine
  const availableMaterials = selectedMachine ? 
    materials.filter(mat => mat.category === selectedMachine.category && selectedMachine.materials.includes(mat.name)) : [];

  // Calculate price when all selections are made
  const handleCalculatePrice = () => {
    if (!analysisResult || !selectedMachine || !selectedMaterial) return;
    
    const price = calculatePrice(analysisResult.volume, selectedMachine, selectedMaterial, analysisResult.complexity);
    const delivery = getDeliveryTime(selectedMachine.category, analysisResult.complexity);
    
    setCalculatedPrice(price);
    setEstimatedDelivery(delivery);
    
    toast({
      title: "Price calculated!",
      description: `Total cost: $${price} - Delivery: ${delivery}`,
    });
  };

  // Reset selections when category changes
  const handleCategoryChange = (category: "FDM" | "SLS" | "SLM" | "CNC") => {
    setSelectedCategory(category);
    setSelectedMachine(null);
    setSelectedMaterial(null);
    setCalculatedPrice(null);
    setEstimatedDelivery(null);
  };

  // Reset machine and material when machine changes
  const handleMachineChange = (machineName: string) => {
    const machine = machines.find(m => m.name === machineName);
    setSelectedMachine(machine || null);
    setSelectedMaterial(null);
    setCalculatedPrice(null);
    setEstimatedDelivery(null);
  };

  // Reset price when material changes
  const handleMaterialChange = (materialName: string) => {
    const material = materials.find(m => m.name === materialName);
    setSelectedMaterial(material || null);
    setCalculatedPrice(null);
    setEstimatedDelivery(null);
  };

  // Cleanup effect for file URLs
  useEffect(() => {
    return () => {
      if (filePreviewUrl) {
        URL.revokeObjectURL(filePreviewUrl);
      }
    };
  }, [filePreviewUrl]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleUploadClick = () => {
    // Reset file input before opening dialog
    resetFileInput();
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleFile = async (file: File) => {
    // Check if file extension is supported
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const supportedExtensions = ['step', 'stp', 'iges', 'igs', 'stl', 'obj', '3mf'];
    
    if (!fileExtension || !supportedExtensions.includes(fileExtension)) {
      toast({
        title: "Unsupported file format",
        description: "Please upload a file with supported format (.STEP, .IGES, .STL, .OBJ, .3MF)",
        variant: "destructive"
      });
      return;
    }

    // Show loading state immediately
    setIsModelLoading(true);

    // Clean up previous file URL if it exists
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
    }

    setUploadedFile(file);
    setAnalysisResult(null);
    setIsAnalyzing(false);
    setAnalysisProgress(0);
    
    // Create a preview URL for the file
    const url = URL.createObjectURL(file);
    setFilePreviewUrl(url);
    
    // Simulate async processing time for better UX
    setTimeout(() => {
      setIsModelLoading(false);
      toast({
        title: "File uploaded successfully",
        description: `${file.name} is ready for analysis`,
      });
    }, 500);
  };

  const resetFileInput = () => {
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (!uploadedFile) return;
    
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    try {
      // Real-time progress updates during API call
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 500);

      toast({
        title: "Analysis starting",
        description: "Uploading and analyzing your 3D model...",
      });

      // Call real API for file analysis
      const analysis = await analyzeFileWithAPI(uploadedFile);
      
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      
      setAnalysisResult(analysis);
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis complete!",
        description: `Your ${analysis.material} part is ready for manufacturing. Select machine and material for pricing.`,
      });

    } catch (error) {
      setIsAnalyzing(false);
      setAnalysisProgress(0);
      
      console.error('Analysis error:', error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Please try again or contact support",
        variant: "destructive"
      });
    }
  };

  const handlePayment = () => {
    if (!analysisResult || !uploadedFile) return;
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = (paymentIntent: any, customerData: {name: string; email: string}) => {
    if (!analysisResult || !uploadedFile || !selectedMachine || !selectedMaterial || !calculatedPrice) return;
    
    // Store customer data for email sending
    setCustomerData(customerData);
    
    // Create order details from successful payment
    const orderDetails = {
      orderId: `OP-${Date.now()}`,
      fileName: uploadedFile.name,
      material: selectedMaterial.name,
      machine: selectedMachine.name,
      process: selectedMachine.category,
      price: calculatedPrice,
      paymentMethod: `${paymentIntent.payment_method?.card?.brand?.toUpperCase()} •••• ${paymentIntent.payment_method?.card?.last4}`,
      timestamp: new Date().toLocaleString(),
      paymentId: paymentIntent.id,
      customerName: customerData.name,
      customerEmail: customerData.email,
      estimatedDelivery: estimatedDelivery
    };
    
    setOrderDetails(orderDetails);
    setShowPaymentForm(false);
    setShowOrderConfirmation(true);
    
    // Send order confirmation email asynchronously with real customer data
    sendOrderConfirmationEmail(orderDetails, customerData);
  };

  const handleCloseModal = () => {
    // Clean up file URL
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
      setFilePreviewUrl(null);
    }
    
    // Reset all states
    setUploadedFile(null);
    setIsAnalyzing(false);
    setAnalysisProgress(0);
    setAnalysisResult(null);
    setShowPaymentForm(false);
    setShowOrderConfirmation(false);
    setOrderDetails(null);
    setEmailSent(false);
    setIsEmailSending(false);
    
    // Reset selection states
    setSelectedCategory(null);
    setSelectedMachine(null);
    setSelectedMaterial(null);
    setCalculatedPrice(null);
    setEstimatedDelivery(null);
    
    // Reset file input
    resetFileInput();
    
    toast({
      title: "File removed",
      description: "You can now upload a new file",
    });
  };

  const sendOrderConfirmationEmail = async (orderDetails: any, customerData: {name: string; email: string}) => {
    setIsEmailSending(true);
    setEmailSent(false);

    try {
      // Real email sending for both development and production
      const emailResponse = await fetch('/api/send-order-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderDetails: {
            orderId: orderDetails.orderId,
            fileName: orderDetails.fileName,
            material: orderDetails.material,
            price: orderDetails.price,
            paymentMethod: orderDetails.paymentMethod,
            timestamp: orderDetails.timestamp,
            paymentId: orderDetails.paymentId
          },
          customerEmail: customerData.email,
          customerName: customerData.name
        })
      });

      if (!emailResponse.ok) {
        const errorText = await emailResponse.text();
        throw new Error(`Email service error: ${emailResponse.status} - ${errorText}`);
      }

      const result = await emailResponse.json();
      
      if (result.success) {
        setEmailSent(true);
        toast({
          title: "Email sent successfully",
          description: "Order confirmation has been sent to your email",
        });
      } else {
        throw new Error(result.error || 'Unknown email sending error');
      }
    } catch (error) {
      setEmailSent(false);
      toast({
        title: "Email sending failed",
        description: "Please contact support if you don't receive confirmation",
        variant: "destructive"
      });
    } finally {
      setIsEmailSending(false);
    }
  };

  const getProcessIcon = (process: string) => {
    switch (process) {
      case 'FDM': return <Layers className="w-5 h-5" />;
      case 'SLS': return <Box className="w-5 h-5" />;
      case 'SLM': return <Cpu className="w-5 h-5" />;
      case 'CNC': return <Cog className="w-5 h-5" />;
      default: return <Box className="w-5 h-5" />;
    }
  };

  return (
    <section className="min-h-screen pt-24 pb-16 flex items-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-secondary/10"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center glass px-4 py-2 rounded-full mb-6 animate-scale-in">
              <Zap className="w-4 h-4 text-primary mr-2" />
              <span className="text-sm font-medium text-foreground/80">Instant Manufacturing Analysis</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold mb-4">
              <span className="gradient-text">Get Your Quote</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Upload your 3D file and receive a detailed manufacturing quote with advanced analysis in under 60 seconds
            </p>
          </div>

          {/* Upload + Preview Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Upload Card */}
          <Card className="glass border-border/50 mb-8 lg:mb-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <Upload className="w-6 h-6 text-primary" />
                Upload Your 3D Model
              </CardTitle>
              <CardDescription className="text-lg">
                Drag and drop your file or click to browse • Supports all major 3D formats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-2xl p-16 text-center transition-all duration-300 ${
                  isDragging
                    ? "border-primary bg-primary/10 scale-[1.02] shadow-lg shadow-primary/20"
                    : "border-border/50 hover:border-primary/50 hover:bg-primary/5"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileInput}
                  accept=".step,.stp,.iges,.igs,.stl,.obj,.3mf"
                />
                <div onClick={handleUploadClick} className="cursor-pointer">
                  <div className="relative">
                    <Upload className={`w-20 h-20 mx-auto mb-6 transition-all duration-300 ${
                      isDragging ? "text-primary scale-110" : "text-primary/70 hover:text-primary hover:scale-105"
                    }`} />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center animate-bounce">
                      <Zap className="w-3 h-3 text-primary-foreground" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">
                    {uploadedFile ? "Click to upload new file" : "Drop your file here"}
                  </h3>
                  <p className="text-muted-foreground mb-6 text-lg">
                    or click to browse from your computer
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {supportedFormats.map((format, index) => (
                      <Badge 
                        key={format.ext} 
                        variant="outline" 
                        className={`${format.color} text-sm py-1 px-3 animate-fade-in`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        .{format.ext}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {uploadedFile && (
                <div className="mt-8 p-8 glass rounded-2xl animate-slide-in border border-primary/20 overflow-hidden">
                  {/* File Details Row */}
                  <div className="flex items-center space-x-6 mb-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 border border-primary/20">
                      {isModelLoading ? (
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-8 h-8 text-primary animate-scale-in" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-2xl text-foreground mb-2 truncate">{uploadedFile.name}</h3>
                      <div className="flex items-center gap-4 text-muted-foreground mb-3">
                        <span className="text-lg font-medium">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                        <span className="text-lg">•</span>
                        <span className="text-lg font-medium">
                          {uploadedFile.name.split('.').pop()?.toUpperCase()} Format
                        </span>
                      </div>
                      <div className="flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-lg border border-primary/20 w-fit">
                        <Shield className="w-5 h-5 text-primary" />
                        <span className="text-primary font-medium">
                          {isModelLoading ? 'Loading Model...' : 'Ready for Analysis'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Buttons Row */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-3 pt-4 border-t border-border/30">
                    <Button 
                      variant="outline" 
                      onClick={handleUploadClick} 
                      size="lg"
                      className="hover:bg-background hover:border-primary/50 hover:text-primary px-6 w-full md:w-auto"
                    >
                      Upload New
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleCloseModal} 
                      size="lg"
                      className="hover:bg-background hover:border-destructive/50 hover:text-destructive px-6 w-full md:w-auto"
                    >
                      Remove
                    </Button>
                    {!isAnalyzing && !analysisResult && (
                      <Button 
                        onClick={handleAnalyze} 
                        size="lg"
                        disabled={isModelLoading}
                        className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg px-8 w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <TrendingUp className="w-5 h-5 mr-2" />
                        {isModelLoading ? 'Loading Model...' : 'Start Analysis'}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 3D Preview Card */}
          <Card className="glass border-border/50 overflow-hidden animate-fade-in" style={{ animationDelay: "0.15s" }}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>3D Model Preview</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="px-2 py-0.5 text-xs">{(fileExt || "-")?.toUpperCase?.()}</Badge>
                <span className="text-xs text-muted-foreground">Orbit to inspect</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border bg-white/80 overflow-hidden relative" style={{ height: 420 }}>
                <ModelPreview file={uploadedFile || null} ext={(fileExt as any) || null} className="w-full h-full" />
                {isModelLoading && (
                  <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-20">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                      <div className="text-center">
                        <p className="text-lg font-medium text-gray-700">Loading 3D Model</p>
                        <p className="text-sm text-gray-500">Preparing preview...</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          </div>

          {/* Analysis Flow */}
          {uploadedFile && (
            <div className="space-y-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              {/* Analysis Progress */}
              {isAnalyzing && (
                <Card className="glass border-border/50 overflow-hidden animate-slide-in border-primary/30 mt-8">
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 animate-spin text-primary" />
                      </div>
                      Analysis in Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <Progress value={analysisProgress} className="h-3 animate-pulse" />
                      <div className="text-center">
                        <p className="text-lg font-medium mb-2">Processing your 3D model...</p>
                        <p className="text-muted-foreground">
                          Advanced algorithms are analyzing geometry, optimizing manufacturing processes, and calculating precise costs
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 glass rounded-xl">
                          <Box className="w-6 h-6 mx-auto mb-2 text-primary animate-bounce" />
                          <p className="text-sm">Geometry Analysis</p>
                        </div>
                        <div className="text-center p-4 glass rounded-xl">
                          <Cpu className="w-6 h-6 mx-auto mb-2 text-secondary animate-bounce" style={{ animationDelay: "0.2s" }} />
                          <p className="text-sm">Process Optimization</p>
                        </div>
                        <div className="text-center p-4 glass rounded-xl">
                          <DollarSign className="w-6 h-6 mx-auto mb-2 text-accent animate-bounce" style={{ animationDelay: "0.4s" }} />
                          <p className="text-sm">Cost Calculation</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Analysis Results */}
              {analysisResult && !isAnalyzing && (
                <div className="space-y-8 animate-fade-in mt-8">
                  {/* Analysis Results Card */}
                  <Card className="glass border-border/50 overflow-hidden">
                    <CardHeader className="pb-6">
                      <CardTitle className="text-2xl font-bold mb-2">Analysis Results</CardTitle>
                      <CardDescription className="text-base">
                        Complete analysis of your 3D model with detailed metrics.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                      {/* Metrics Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-background/50 border border-border/30 rounded-xl p-6">
                          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">VOLUME (CM³)</p>
                          <p className="text-3xl font-bold">{analysisResult.volume}</p>
                        </div>
                        <div className="bg-background/50 border border-border/30 rounded-xl p-6">
                          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">SURFACE (CM²)</p>
                          <p className="text-3xl font-bold">{analysisResult.surfaceArea}</p>
                        </div>
                        <div className="bg-background/50 border border-border/30 rounded-xl p-6">
                          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">TRIANGLES</p>
                          <p className="text-3xl font-bold">{analysisResult.triangleCount?.toLocaleString()}</p>
                        </div>
                        <div className="bg-background/50 border border-border/30 rounded-xl p-6">
                          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">MATERIAL</p>
                          <p className="text-2xl font-bold">{analysisResult.material}</p>
                        </div>
                        <div className="bg-background/50 border border-border/30 rounded-xl p-6">
                          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">COMPLEXITY</p>
                          <p className="text-3xl font-bold">{analysisResult.complexity}</p>
                        </div>
                        <div className="bg-background/50 border border-border/30 rounded-xl p-6">
                          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">DIMENSIONS (MM)</p>
                          <p className="text-lg font-bold">{analysisResult.dimensions.length.toFixed(1)}×{analysisResult.dimensions.width.toFixed(1)}×{analysisResult.dimensions.height.toFixed(1)}</p>
                        </div>
                      </div>
                      
                      {/* Manufacturing Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                          <p className="text-sm text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">FEASIBLE PROCESSES</p>
                          <div className="flex flex-wrap gap-2">
                            {analysisResult.feasibleProcesses.map((process) => (
                              <span key={process} className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                                {process}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
                          <p className="text-sm text-green-600 dark:text-green-400 uppercase tracking-wider mb-2">QUALITY RATING</p>
                          <p className="text-2xl font-bold text-green-700 dark:text-green-300">{analysisResult.qualityRating}</p>
                          <p className="text-sm text-green-600 dark:text-green-400 mt-1">Select machine & material below for pricing</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Manufacturing Selection */}
                  <Card className="glass border-border/50">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <Cog className="w-6 h-6 text-primary" />
                        Manufacturing Configuration
                      </CardTitle>
                      <CardDescription>
                        Select your preferred manufacturing process, machine, and material.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Step 1: Process Selection */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</div>
                          <h3 className="text-lg font-semibold">Select Manufacturing Process</h3>
                        </div>
                        <Select value={selectedCategory || ""} onValueChange={handleCategoryChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Choose a manufacturing process..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="FDM">FDM/FFF - Fused Deposition Modeling</SelectItem>
                            <SelectItem value="SLS">SLS - Selective Laser Sintering</SelectItem>
                            <SelectItem value="SLM">SLM - Selective Laser Melting</SelectItem>
                            <SelectItem value="CNC">CNC - Computer Numerical Control</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Step 2: Machine Selection */}
                      {selectedCategory && (
                        <div className="space-y-3 animate-fade-in">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</div>
                            <h3 className="text-lg font-semibold">Select Machine</h3>
                          </div>
                          <Select value={selectedMachine?.name || ""} onValueChange={handleMachineChange}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Choose a machine from our fleet..." />
                            </SelectTrigger>
                            <SelectContent>
                              {availableMachines.map((machine) => (
                                <SelectItem key={machine.name} value={machine.name}>
                                  {machine.name} - Base: ${machine.basePrice}/cm³
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {selectedMachine && (
                            <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                              <strong>Available Materials:</strong> {selectedMachine.materials.join(", ")}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Step 3: Material Selection */}
                      {selectedMachine && (
                        <div className="space-y-3 animate-fade-in">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">3</div>
                            <h3 className="text-lg font-semibold">Select Material</h3>
                          </div>
                          <Select value={selectedMaterial?.name || ""} onValueChange={handleMaterialChange}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Choose material..." />
                            </SelectTrigger>
                            <SelectContent>
                              {availableMaterials.map((material) => (
                                <SelectItem key={material.name} value={material.name}>
                                  <div className="flex items-center gap-2">
                                    <Badge className={material.color}>{material.name}</Badge>
                                    <span className="text-muted-foreground">×{material.priceMultiplier}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {/* Step 4: Calculate Price */}
                      {selectedMaterial && !calculatedPrice && (
                        <div className="space-y-3 animate-fade-in">
                          <Button 
                            onClick={handleCalculatePrice}
                            className="w-full glass-hover bg-primary text-primary-foreground"
                            size="lg"
                          >
                            <Calculator className="w-5 h-5 mr-2" />
                            Calculate Price
                          </Button>
                        </div>
                      )}

                      {/* Price Results */}
                      {calculatedPrice && estimatedDelivery && (
                        <div className="space-y-4 animate-fade-in">
                          <Separator />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl p-6">
                              <div className="flex items-center gap-2 mb-2">
                                <DollarSign className="w-5 h-5 text-green-600" />
                                <h4 className="font-semibold text-green-900 dark:text-green-100">Total Cost</h4>
                              </div>
                              <p className="text-3xl font-bold text-green-600">${calculatedPrice}</p>
                              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                                {selectedMachine?.name} + {selectedMaterial?.name}
                              </p>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                              <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-5 h-5 text-blue-600" />
                                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Delivery Time</h4>
                              </div>
                              <p className="text-2xl font-bold text-blue-600">{estimatedDelivery}</p>
                              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                                {analysisResult.complexity} complexity
                              </p>
                            </div>
                          </div>
                          
                          <Button 
                            onClick={() => setShowPaymentForm(true)}
                            className="w-full glass-hover bg-secondary text-secondary-foreground hover:text-white"
                            size="lg"
                          >
                            <CreditCard className="w-5 h-5 mr-2" />
                            Confirm Order - ${calculatedPrice}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* Feature Grid - Always visible */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 animate-fade-in" style={{ animationDelay: "0.7s" }}>
            <Card className="glass border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FileType className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-3">Automated DFM Analysis</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Advanced algorithms instantly analyze your design for manufacturing optimization and provide actionable recommendations
                </p>
              </CardContent>
            </Card>

            <Card className="glass border-border/50 hover:border-secondary/30 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/10">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="font-bold text-xl mb-3">Smart Process Selection</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Intelligent matching to optimal manufacturing processes based on geometry, tolerances, and material requirements
                </p>
              </CardContent>
            </Card>

            <Card className="glass border-border/50 hover:border-accent/30 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-bold text-xl mb-3">Quality Assurance</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Comprehensive quality checks including wall thickness analysis, tolerance validation, and support structure optimization
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Payment Form */}
      {calculatedPrice && selectedMachine && selectedMaterial && uploadedFile && (
        <PaymentForm
          isOpen={showPaymentForm}
          onClose={() => setShowPaymentForm(false)}
          onPaymentSuccess={handlePaymentSuccess}
          orderDetails={{
            fileName: uploadedFile.name,
            material: selectedMaterial.name,
            price: calculatedPrice,
            process: selectedMachine.category
          }}
        />
      )}
      
      {/* Order Confirmation Popup */}
      {showOrderConfirmation && orderDetails && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-scale-up">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-6 text-white relative">
              <button
                onClick={() => setShowOrderConfirmation(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Order Confirmed</h2>
                  <p className="text-green-100">Thank you for your purchase</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
              {/* Order Summary Card */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Order ID</span>
                    <span className="font-mono text-sm bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded">{orderDetails.orderId}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Customer</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{orderDetails.customerName}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Email</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{orderDetails.customerEmail}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">File</span>
                    <span className="font-semibold text-gray-900 dark:text-white max-w-48 truncate">{orderDetails.fileName}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Material</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{orderDetails.material}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Payment Method</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{orderDetails.paymentMethod}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Date</span>
                    <span className="text-gray-900 dark:text-white">{orderDetails.timestamp}</span>
                  </div>
                  
                  {/* Total - Highlighted */}
                  <div className="flex justify-between items-center py-3 bg-green-50 dark:bg-green-900/20 rounded-lg px-4 mt-4">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">${orderDetails.price}</span>
                  </div>
                </div>
              </div>

              {/* Email Status Message */}
              <div className="text-center">
                {isEmailSending ? (
                  <div className="inline-flex items-center space-x-2 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 px-4 py-2 rounded-lg">
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="text-sm font-medium">Sending confirmation email...</span>
                  </div>
                ) : emailSent ? (
                  <div className="inline-flex items-center space-x-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-4 py-2 rounded-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm font-medium">Email sent to {orderDetails?.customerEmail} successfully</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium">Preparing confirmation email...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
