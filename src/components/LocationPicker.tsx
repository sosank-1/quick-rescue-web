import { useState, useEffect } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2 } from "lucide-react";

interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  initialLocation?: { lat: number; lng: number };
}

export const LocationPicker = ({ onLocationSelect, initialLocation }: LocationPickerProps) => {
  const [position, setPosition] = useState(initialLocation || { lat: 28.6139, lng: 77.2090 }); // Default: New Delhi
  const [gettingLocation, setGettingLocation] = useState(false);
  const [address, setAddress] = useState("");

  const API_KEY = ""; // User needs to add their Google Maps API key

  useEffect(() => {
    if (position) {
      fetchAddress(position.lat, position.lng);
    }
  }, [position]);

  const getCurrentLocation = () => {
    setGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setPosition(newPos);
          setGettingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setGettingLocation(false);
        }
      );
    }
  };

  const fetchAddress = async (lat: number, lng: number) => {
    if (!API_KEY) return;
    
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`
      );
      const data = await response.json();
      if (data.results && data.results[0]) {
        const addr = data.results[0].formatted_address;
        setAddress(addr);
        onLocationSelect({ lat, lng, address: addr });
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const handleMapClick = (e: any) => {
    const lat = e.detail.latLng.lat;
    const lng = e.detail.latLng.lng;
    setPosition({ lat, lng });
  };

  if (!API_KEY) {
    return (
      <div className="border rounded-lg p-8 text-center bg-muted/50">
        <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="font-semibold mb-2">Google Maps Integration</h3>
        <p className="text-sm text-muted-foreground mb-4">
          To enable map location selection, please add your Google Maps API key.
        </p>
        <Button onClick={getCurrentLocation} disabled={gettingLocation}>
          {gettingLocation ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Getting Location...
            </>
          ) : (
            <>
              <MapPin className="w-4 h-4 mr-2" />
              Use Current Location
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Click on the map to select pickup location
        </p>
        <Button variant="outline" size="sm" onClick={getCurrentLocation} disabled={gettingLocation}>
          {gettingLocation ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Getting...
            </>
          ) : (
            <>
              <MapPin className="w-4 h-4 mr-2" />
              My Location
            </>
          )}
        </Button>
      </div>
      <div className="h-[400px] rounded-lg overflow-hidden border">
        <APIProvider apiKey={API_KEY}>
          <Map
            defaultCenter={position}
            defaultZoom={15}
            gestureHandling="greedy"
            disableDefaultUI={false}
            onClick={handleMapClick}
          >
            <Marker position={position} />
          </Map>
        </APIProvider>
      </div>
      {address && (
        <div className="p-3 bg-muted rounded-lg text-sm">
          <strong>Selected Location:</strong> {address}
        </div>
      )}
    </div>
  );
};
