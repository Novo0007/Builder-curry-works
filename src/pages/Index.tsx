import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Upload, Search, BookOpen, Palette, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: "Universal PDF Support",
      description:
        "View any PDF document with high-fidelity rendering and smooth navigation.",
    },
    {
      icon: <Search className="h-8 w-8 text-primary" />,
      title: "Advanced Search",
      description:
        "Full-text search with highlighting and navigation between results.",
    },
    {
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      title: "Smart Navigation",
      description:
        "Thumbnail sidebar, document outline, and keyboard shortcuts for efficiency.",
    },
    {
      icon: <Palette className="h-8 w-8 text-primary" />,
      title: "Annotation Tools",
      description:
        "Highlight text, add notes, and create visual annotations with collaboration-ready features.",
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Performance Optimized",
      description:
        "Virtual scrolling and lazy loading for smooth handling of large documents.",
    },
    {
      icon: <Upload className="h-8 w-8 text-primary" />,
      title: "Cloud Integration Ready",
      description:
        "Built for Supabase integration with user authentication and cloud storage.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Enterprise-Grade PDF Viewer
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Professional PDF Viewer
            <span className="block text-primary">
              Built for Modern Workflows
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Experience the next generation of PDF viewing with advanced
            annotation tools, intelligent search, and seamless performance.
            Perfect for enterprise applications and collaborative document
            workflows.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg px-8 py-6"
              onClick={() => navigate("/viewer")}
            >
              <Upload className="mr-2 h-5 w-5" />
              Start Viewing PDFs
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6"
              onClick={() => navigate("/viewer")}
            >
              Try Sample Document
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-border/50 hover:shadow-lg transition-all duration-300"
            >
              <CardHeader>
                <div className="mb-4">{feature.icon}</div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Technical Highlights */}
        <div className="bg-card border rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Built with Modern Technology
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-2">
                React 18
              </div>
              <p className="text-sm text-muted-foreground">
                Modern React with hooks and concurrent features
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-2">
                TypeScript
              </div>
              <p className="text-sm text-muted-foreground">
                Type-safe development for reliability
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-2">
                React-PDF
              </div>
              <p className="text-sm text-muted-foreground">
                Robust PDF rendering and manipulation
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-2">
                Tailwind CSS
              </div>
              <p className="text-sm text-muted-foreground">
                Beautiful, responsive design system
              </p>
            </div>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-primary">
                500+
              </CardTitle>
              <CardDescription>Pages Supported</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-primary">
                50MB
              </CardTitle>
              <CardDescription>Maximum File Size</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-primary">
                60fps
              </CardTitle>
              <CardDescription>Smooth Scrolling</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your PDF Experience?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start using our professional PDF viewer today and experience the
            difference that modern technology makes for document workflows.
          </p>
          <Button
            size="lg"
            className="text-lg px-12 py-6"
            onClick={() => navigate("/viewer")}
          >
            <FileText className="mr-2 h-5 w-5" />
            Launch PDF Viewer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
