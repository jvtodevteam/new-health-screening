import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default Leaflet marker icon
const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Types
export interface Location {
  id: number;
  name: string;
  description?: string;
  lat: number;
  lng: number;
  city: string;
}

interface LocationMapProps {
  locations: Location[];
  selectedLocation?: Location | null;
  onSelectLocation: (location: Location) => void;
  city: string;
}

// Components for map interaction
const FlyToMarker: React.FC<{ coords: [number, number] }> = ({ coords }) => {
  const map = useMap();
  
  React.useEffect(() => {
    if (coords) {
      map.flyTo([coords[0] - 0.008, coords[1]], 14);
    }
  }, [coords, map]);
  
  return null;
};

const SetMapCenter: React.FC<{ city: string }> = ({ city }) => {
  const map = useMap();
  
  React.useEffect(() => {
    if (city) {
      const center = getCityCenter(city);
      map.setView(center, 14);
    }
  }, [city, map]);
  
  return null;
};

// Get center coordinates for map based on selected city
const getCityCenter = (city: string): [number, number] => {
  if (city === "Bondowoso") return [-7.91303, 113.820867];
  if (city === "Banyuwangi") return [-8.215083, 114.367759];
  return [-7.91303, 113.820867]; // Default to Bondowoso
};

const LocationMap: React.FC<LocationMapProps> = ({
  locations,
  selectedLocation,
  onSelectLocation,
  city
}) => {
  return (
    <div className="h-48 rounded-xl overflow-hidden shadow-md">
      <MapContainer
        center={getCityCenter(city)}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          className="grayscale brightness-105 contrast-105"
        />

        <SetMapCenter city={city} />

        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.lat, location.lng]}
            icon={defaultIcon}
            eventHandlers={{
              click: () => onSelectLocation(location),
            }}
          >
            <Popup>{location.name}</Popup>
          </Marker>
        ))}

        {selectedLocation && (
          <FlyToMarker coords={[selectedLocation.lat, selectedLocation.lng]} />
        )}
      </MapContainer>
    </div>
  );
};

export default LocationMap;