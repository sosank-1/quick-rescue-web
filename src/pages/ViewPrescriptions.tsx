import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

const ViewPrescriptions = () => {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const { data, error } = await supabase
        .from("prescriptions")
        .select(`
          *,
          patients (name, contact_number)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPrescriptions(data || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch prescriptions");
    } finally {
      setLoading(false);
    }
  };

  const filteredPrescriptions = prescriptions.filter(
    (rx) =>
      rx.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.doctor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.patients?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">Prescription Records</h1>
          <div className="w-32" />
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="mb-6 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search by medication, doctor, or patient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredPrescriptions.length} prescription{filteredPrescriptions.length !== 1 ? "s" : ""} found
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredPrescriptions.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No prescriptions found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "Try a different search term" : "Create your first prescription to get started"}
            </p>
            <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredPrescriptions.map((rx) => (
              <Card key={rx.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">{rx.medication}</h3>
                        <p className="text-sm text-muted-foreground">
                          Patient: {rx.patients?.name} | Dr. {rx.doctor_name}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(rx.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-muted-foreground">Dosage:</span>
                        <p className="font-medium">{rx.dosage}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Frequency:</span>
                        <p className="font-medium">{rx.frequency}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Duration:</span>
                        <p className="font-medium">{rx.duration}</p>
                      </div>
                    </div>
                    {rx.notes && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Notes:</span>
                        <p className="font-medium">{rx.notes}</p>
                      </div>
                    )}
                  </div>
                  {rx.image_url && (
                    <img
                      src={rx.image_url}
                      alt="Medicine"
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewPrescriptions;
