import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Activity, Ambulance, Phone, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LocationPicker } from "@/components/LocationPicker";

const Emergency = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    location: "",
    notes: "",
  });
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEmergencyCall = () => {
    // Validate form
    if (!formData.name || !formData.contact) {
      toast.error("Please fill in all required fields");
      return;
    }

    const locationText = selectedLocation?.address || formData.location || "Location not specified";

    // Prepare WhatsApp message
    const message = `🚨 EMERGENCY AMBULANCE REQUEST 🚨%0A%0APatient Name: ${encodeURIComponent(formData.name)}%0AContact Number: ${encodeURIComponent(formData.contact)}%0APick-up Location: ${encodeURIComponent(locationText)}%0A${formData.notes ? `Additional Notes: ${encodeURIComponent(formData.notes)}` : ""}%0A%0APlease dispatch ambulance immediately!`;

    const whatsappNumber = "919395072164";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

    window.open(whatsappUrl, "_blank");
    toast.success("Opening WhatsApp to send emergency request");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-emergency/5 to-background">
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
            <Button variant="outline" onClick={() => navigate("/")}>
              Back to Home
            </Button>
            <Button onClick={() => navigate("/auth")}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Emergency Banner */}
        <div className="mb-8 p-6 bg-emergency/10 border-2 border-emergency rounded-2xl flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-emergency flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-xl font-bold text-emergency mb-2">Emergency Ambulance Service</h2>
            <p className="text-muted-foreground">
              Fill in the details below and click "Book Ambulance" to send an emergency request via WhatsApp.
              Our team will respond immediately.
            </p>
          </div>
        </div>

        <Card className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-emergency/10 flex items-center justify-center">
              <Ambulance className="w-7 h-7 text-emergency" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Book Ambulance</h1>
              <p className="text-muted-foreground">Quick and secure ambulance booking</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Patient Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Patient Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter patient's full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Contact Number *</Label>
                <Input
                  id="contact"
                  name="contact"
                  type="tel"
                  placeholder="Enter contact number"
                  value={formData.contact}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Pick-up Location</h3>
              
              <div className="space-y-2">
                <Label htmlFor="location">Address *</Label>
                <Textarea
                  id="location"
                  name="location"
                  placeholder="Enter complete pick-up address with landmarks"
                  value={formData.location}
                  onChange={handleInputChange}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Select Location on Map</Label>
                <LocationPicker
                  onLocationSelect={(loc) => {
                    setSelectedLocation(loc);
                    setFormData({ ...formData, location: loc.address });
                  }}
                />
              </div>
            </div>

            {/* Additional Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Any additional information (medical condition, urgency level, etc.)"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                size="lg"
                className="flex-1 bg-emergency hover:bg-emergency/90 text-emergency-foreground"
                onClick={handleEmergencyCall}
              >
                <Phone className="w-5 h-5 mr-2" />
                Book Ambulance via WhatsApp
              </Button>
            </div>

            {/* Emergency Contact Info */}
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                <strong>Emergency Hotline:</strong> +91 9395072164
                <br />
                Available 24/7 for immediate assistance
              </p>
            </div>
          </div>
        </Card>

        {/* Features */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <Ambulance className="w-8 h-8 text-primary mx-auto mb-2" />
            <h4 className="font-semibold mb-1">Fast Response</h4>
            <p className="text-sm text-muted-foreground">Quick dispatch within minutes</p>
          </Card>
          <Card className="p-4 text-center">
            <Activity className="w-8 h-8 text-primary mx-auto mb-2" />
            <h4 className="font-semibold mb-1">Equipped Ambulances</h4>
            <p className="text-sm text-muted-foreground">Advanced life support systems</p>
          </Card>
          <Card className="p-4 text-center">
            <Phone className="w-8 h-8 text-primary mx-auto mb-2" />
            <h4 className="font-semibold mb-1">24/7 Support</h4>
            <p className="text-sm text-muted-foreground">Round-the-clock availability</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Emergency;
