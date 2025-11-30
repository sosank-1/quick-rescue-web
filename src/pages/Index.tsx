import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, FileText, Shield, Activity, CheckCircle2, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Activity className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">MediCare HMS</span>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate("/emergency")}
              className="border-emergency text-emergency hover:bg-emergency hover:text-emergency-foreground"
            >
              Emergency
            </Button>
            <Button 
              onClick={() => navigate("/auth")}
              className="bg-primary hover:bg-primary/90"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Modern Hospital
              <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Management System
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A comprehensive, multi-tenant healthcare platform for managing patients,
              prescriptions, and hospital operations with enterprise-grade security.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button 
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-primary hover:bg-primary/90 text-lg px-8"
            >
              Access Dashboard →
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate("/emergency")}
              className="text-lg px-8"
            >
              Book Ambulance
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
          <p className="text-lg text-muted-foreground">
            A complete suite of tools designed for modern healthcare facilities
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 hover:shadow-lg transition-shadow border-border bg-card">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Patient Management</h3>
            <p className="text-muted-foreground">
              Complete OPD & IPD patient registration, tracking, and medical records management.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow border-border bg-card">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Prescriptions</h3>
            <p className="text-muted-foreground">
              Digital prescription management with templates and medicine database integration.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow border-border bg-card">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Role-Based Access</h3>
            <p className="text-muted-foreground">
              Secure RBAC system with customizable roles and granular permissions.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow border-border bg-card">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time Analytics</h3>
            <p className="text-muted-foreground">
              Dashboard with live statistics, occupancy tracking, and operational insights.
            </p>
          </Card>
        </div>
      </section>

      {/* Excellence Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">Built for Healthcare Excellence</h2>
            <p className="text-lg text-muted-foreground">
              Our HMS is designed with healthcare professionals in mind, featuring intuitive
              interfaces and powerful capabilities that streamline daily operations.
            </p>

            <div className="space-y-4">
              {[
                "Multi-tenant architecture for multiple hospitals",
                "HIPAA-compliant security standards",
                "Automated patient ID generation",
                "Department-wise patient management",
                "Prescription templates and history",
                "Role-based menu rendering",
              ].map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <Card className="p-12 bg-secondary/50 border-border">
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="w-64 h-64 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Building2 className="w-32 h-32 text-primary" />
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-xl bg-accent flex items-center justify-center shadow-lg">
                  <Activity className="w-12 h-12 text-accent-foreground" />
                </div>
              </div>
            </div>
            <p className="text-center text-muted-foreground mt-8">
              Interactive Dashboard Preview
            </p>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50">
        <div className="container mx-auto px-6 py-8 text-center text-muted-foreground">
          <p>&copy; 2025 MediCare HMS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
