import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, FileText, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/20 to-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">Page Not Found</CardTitle>
          <CardDescription>
            The page you're looking for doesn't exist or has been moved.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Button onClick={() => navigate("/")} className="w-full" size="lg">
              <Home className="mr-2 h-4 w-4" />
              Go to Homepage
            </Button>
            <Button
              onClick={() => navigate("/viewer")}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <FileText className="mr-2 h-4 w-4" />
              Open PDF Viewer
            </Button>
            <Button
              onClick={() => navigate(-1)}
              variant="ghost"
              className="w-full"
              size="lg"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
