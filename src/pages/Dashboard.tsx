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
import { RegisterPatientDialog } from "@/components/forms/RegisterPatientDialog";
import { NewPrescriptionDialog } from "@/components/forms/NewPrescriptionDialog";
import { ScheduleAppointmentDialog } from "@/components/forms/ScheduleAppointmentDialog";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [patientDialogOpen, setPatientDialogOpen] = useState(false);
  const [prescriptionDialogOpen, setPrescriptionDialogOpen] = useState(false);
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  const [stats, setStats] = useState({
    totalPatients: 0,
    activeAppointments: 0,
    prescriptionsToday: 0,
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      }
      await fetchStats();
      setLoading(false);
    };
    checkAuth();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const { count: patientsCount } = await supabase
        .from("patients")
        .select("*", { count: "exact", head: true });

      const { count: appointmentsCount } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("status", "scheduled");

      const today = new Date().toISOString().split("T")[0];
      const { count: prescriptionsCount } = await supabase
        .from("prescriptions")
        .select("*", { count: "exact", head: true })
        .gte("created_at", today);

      setStats({
        totalPatients: patientsCount || 0,
        activeAppointments: appointmentsCount || 0,
        prescriptionsToday: prescriptionsCount || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  const statsData = [
    { label: "Total Patients", value: stats.totalPatients.toString(), change: "+12%", icon: Users, up: true },
    { label: "Active Appointments", value: stats.activeAppointments.toString(), change: "+5%", icon: Calendar, up: true },
    { label: "Prescriptions Today", value: stats.prescriptionsToday.toString(), change: "+8%", icon: FileText, up: true },
    { label: "Bed Occupancy", value: "78%", change: "-2%", icon: Activity, up: false },
  ];

  const quickActions = [
    { label: "Register Patient", icon: Users, onClick: () => setPatientDialogOpen(true) },
    { label: "New Prescription", icon: FileText, onClick: () => setPrescriptionDialogOpen(true) },
    { label: "Schedule Appointment", icon: Calendar, onClick: () => setAppointmentDialogOpen(true) },
    { label: "Book Ambulance", icon: Ambulance, onClick: () => navigate("/emergency") },
  ];

  const viewRecords = [
    { label: "View Patients", icon: Eye, onClick: () => navigate("/view-patients") },
    { label: "View Prescriptions", icon: Eye, onClick: () => navigate("/view-prescriptions") },
    { label: "View Appointments", icon: Eye, onClick: () => navigate("/view-appointments") },
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
          {statsData.map((stat) => (
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
                onClick={record.onClick}
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

      {/* Dialogs */}
      <RegisterPatientDialog
        open={patientDialogOpen}
        onOpenChange={setPatientDialogOpen}
        onSuccess={fetchStats}
      />
      <NewPrescriptionDialog
        open={prescriptionDialogOpen}
        onOpenChange={setPrescriptionDialogOpen}
        onSuccess={fetchStats}
      />
      <ScheduleAppointmentDialog
        open={appointmentDialogOpen}
        onOpenChange={setAppointmentDialogOpen}
        onSuccess={fetchStats}
      />
    </div>
  );
};

export default Dashboard;
