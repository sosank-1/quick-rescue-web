import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Users, Loader2 } from "lucide-react";
import { toast } from "sonner";

const ViewPatients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPatients(data || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch patients");
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.contact_number.includes(searchTerm) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">Patient Records</h1>
          <div className="w-32" />
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="mb-6 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search by name, contact, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredPatients.length} patient{filteredPatients.length !== 1 ? "s" : ""} found
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredPatients.length === 0 ? (
          <Card className="p-12 text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No patients found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "Try a different search term" : "Register your first patient to get started"}
            </p>
            <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredPatients.map((patient) => (
              <Card key={patient.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-3">{patient.name}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Contact:</span>
                        <p className="font-medium">{patient.contact_number}</p>
                      </div>
                      {patient.email && (
                        <div>
                          <span className="text-muted-foreground">Email:</span>
                          <p className="font-medium">{patient.email}</p>
                        </div>
                      )}
                      {patient.blood_group && (
                        <div>
                          <span className="text-muted-foreground">Blood Group:</span>
                          <p className="font-medium">{patient.blood_group}</p>
                        </div>
                      )}
                      {patient.date_of_birth && (
                        <div>
                          <span className="text-muted-foreground">Date of Birth:</span>
                          <p className="font-medium">{new Date(patient.date_of_birth).toLocaleDateString()}</p>
                        </div>
                      )}
                      {patient.emergency_contact && (
                        <div>
                          <span className="text-muted-foreground">Emergency Contact:</span>
                          <p className="font-medium">{patient.emergency_contact}</p>
                        </div>
                      )}
                      {patient.address && (
                        <div className="col-span-2 md:col-span-3">
                          <span className="text-muted-foreground">Address:</span>
                          <p className="font-medium">{patient.address}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewPatients;
