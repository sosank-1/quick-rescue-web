import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Activity,
  Users,
  Calendar,
  FileText,
  TrendingUp,
  TrendingDown,
  Eye,
  Settings,
  LogOut,
  Ambulance,
} from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      }
      setLoading(false);
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  const stats = [
    { label: "Total Patients", value: "0", change: "+12%", icon: Users, up: true },
    { label: "Active Appointments", value: "0", change: "+5%", icon: Calendar, up: true },
    { label: "Prescriptions Today", value: "0", change: "+8%", icon: FileText, up: true },
    { label: "Bed Occupancy", value: "78%", change: "-2%", icon: Activity, up: false },
  ];

  const quickActions = [
    { label: "Register Patient", icon: Users },
    { label: "New Prescription", icon: FileText },
    { label: "Schedule Appointment", icon: Calendar },
    { label: "Book Ambulance", icon: Ambulance, onClick: () => navigate("/emergency") },
  ];

  const viewRecords = [
    { label: "View Patients", icon: Eye },
    { label: "View Prescriptions", icon: Eye },
    { label: "View Appointments", icon: Eye },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
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
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Dashboard Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your hospital.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex items-center gap-1 text-sm">
                  {stat.up ? (
                    <TrendingUp className="w-4 h-4 text-stat-up" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-stat-down" />
                  )}
                  <span className={stat.up ? "text-stat-up" : "text-stat-down"}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="outline"
                className={`h-24 flex flex-col items-center justify-center gap-3 ${
                  action.label === "Book Ambulance"
                    ? "border-emergency text-emergency hover:bg-emergency hover:text-emergency-foreground"
                    : ""
                }`}
                onClick={action.onClick}
              >
                <action.icon className="w-6 h-6" />
                <span>{action.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* View & Manage Records */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">View & Manage Records</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {viewRecords.map((record) => (
              <Button
                key={record.label}
                variant="outline"
                className="h-24 flex flex-col items-center justify-center gap-3 bg-muted/50"
              >
                <record.icon className="w-6 h-6" />
                <span>{record.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Recent Appointments
              </h3>
              <Button variant="link" size="sm">View All</Button>
            </div>
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="mb-2">No appointments scheduled yet</p>
              <Button variant="link" size="sm">Schedule your first appointment</Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Recently Registered
              </h3>
              <Button variant="link" size="sm">View All</Button>
            </div>
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="mb-2">No patients registered yet</p>
              <Button variant="link" size="sm">Register your first patient</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
