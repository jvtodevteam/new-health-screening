import React, { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Search, ChevronRight } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useTranslation } from "../../hooks/useTranslation";

// Fix for default Leaflet marker icon
const defaultIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

// Components for map interaction
const FlyToMarker = ({ coords }) => {
    const map = useMap();
    useEffect(() => {
        if (coords && coords[0] && coords[1]) {
            map.flyTo([coords[0] - 0.008, coords[1]], 14);
        }
    }, [coords, map]);
    return null;
};

// This component controls the map view based on the selected city
const MapViewController = ({ city, cities }) => {
  const map = useMap(); // Get the map instance
  
  useEffect(() => {
    if (city && cities && cities[city]) {
      const cityData = cities[city];
      if (cityData.latitude && cityData.longitude) {
        
        // Force immediate view change
        map.setView([cityData.latitude, cityData.longitude], 13, {
          animate: true,
          duration: 1 // 1 second animation
        });
        
        // Add a delay and then invalidate size and set view again to ensure it takes effect
        setTimeout(() => {
          map.invalidateSize(true);
          map.setView([cityData.latitude, cityData.longitude], 13);
        }, 100);
      }
    }
  }, [city, cities, map]); // Re-run when city changes
  
  return null; // This component doesn't render anything
};

// Default coordinates if none available
const DEFAULT_CENTER = [-7.91303, 113.820867]; // Bondowoso default

const LocationSelection = ({ data, setData, errors, cities, onNext }) => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [showDetail, setShowDetail] = useState(false);
    const [localSelectedLocation, setLocalSelectedLocation] = useState(null);
    const [localSelectedTimeSlot, setLocalSelectedTimeSlot] = useState(null);
    const [participantCount, setParticipantCount] = useState(1);
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
    const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false);
    
    // Set initial city if cities data is available
    useEffect(() => {
        if (cities && Object.keys(cities).length > 0) {
            setSelectedCity(Object.keys(cities)[0]);
        }
    }, [cities]);
    
    // Generate dates for the next 7 days
    const [dateOptions, setDateOptions] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    
    useEffect(() => {
        const opts = [];
        for (let i = 0; i <= 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() + i);
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, "0");
            const dd = String(d.getDate()).padStart(2, "0");
            const formattedDate = `${yyyy}-${mm}-${dd}`;
            opts.push({
                date: formattedDate,
                day: d.toLocaleDateString(undefined, { weekday: "short" }),
                dayNum: dd,
            });
        }
        setDateOptions(opts);
        
        // Set default date in form data
        if (opts.length > 0) {
            setData('date', opts[0].date);
        }
    }, []);
    
    // Get active locations for the selected city
    const activeLocations = selectedCity && cities && cities[selectedCity] && cities[selectedCity].locations 
        ? cities[selectedCity].locations 
        : [];
    
    // Filter locations based on search query
    const filteredLocations = activeLocations.filter((location) =>
        location.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    const handleMarkerClick = (location) => {
        setLocalSelectedLocation(location);
        setShowDetail(true);
        setSearchQuery(""); // Reset search after selecting location
        
        // Save both the ID and the name/description for display
        setData({
            ...data,
            location_id: location.id,
            location_name: location.name,
            location_description: location.description
        });
        
        // Load time slots from the location data
        setAvailableTimeSlots(location.time_slots || []);
        
        // Reset selected time slot
        setLocalSelectedTimeSlot(null);
        setData('time_slot_id', '');
        setData('time_slot_start', '');
        setData('time_slot_end', '');
        setData('time_slot_label', '');
    };
    
    const handleTimeSelection = (timeSlot) => {
        setLocalSelectedTimeSlot(timeSlot);
        
        // Save both the ID and the start/end times for display
        setData({
            ...data,
            time_slot_id: timeSlot.id,
            time_slot_start: timeSlot.start,
            time_slot_end: timeSlot.end,
            time_slot_label: timeSlot.label
        });
    };
    
    const handleDateSelection = (date) => {
        setSelectedDate(new Date(date));
        setData('date', date);
    };
    
    const handleCityChange = (cityName) => {
        setSelectedCity(cityName);
        
        // Reset location and time slot selections
        setLocalSelectedLocation(null);
        setLocalSelectedTimeSlot(null);
        
        // Clear all related data
        setData({
            ...data,
            location_id: '',
            location_name: '',
            location_description: '',
            time_slot_id: '',
            time_slot_start: '',
            time_slot_end: '',
            time_slot_label: ''
        });
        
        setShowDetail(false);
    };

    // Handle participant count
    const decreaseParticipantCount = () => {
        if (participantCount > 1) {
            const newCount = participantCount - 1;
            setParticipantCount(newCount);
            
            // Update participants array
            const newParticipants = [...data.participants].slice(0, newCount);
            setData('participants', newParticipants);
        }
    };

    const increaseParticipantCount = () => {
        if (participantCount < 10) {
            const newCount = participantCount + 1;
            setParticipantCount(newCount);
            
            // Update participants array
            const newParticipants = [...data.participants];
            while (newParticipants.length < newCount) {
                newParticipants.push({
                    title: "Mr",
                    name: "",
                    birth_year: "",
                    nationality_id: "",
                    id_number: "",
                    has_medical_history: false,
                });
            }
            setData('participants', newParticipants);
        }
    };
    
    const canProceed = () => {
        return data.location_id && data.date && data.time_slot_id;
    };
    
    // Get current city center coordinates
    const getCurrentCityCenter = () => {
        if (selectedCity && cities && cities[selectedCity]) {
            const city = cities[selectedCity];
            if (city.latitude && city.longitude) {
                return [city.latitude, city.longitude];
            }
        }
        return DEFAULT_CENTER;
    };
    
    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    
    return (
        <div className="min-h-screen bg-gray-50 relative">
            <div className="bg-white p-4 flex items-center shadow-sm">
                <a href={route('home')} className="mr-2">
                    <ArrowLeft size={24} className="text-gray-800" />
                </a>
                <h1 className="text-xl font-bold">{t.appName}</h1>
            </div>

            <div className="p-4">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">{t.scheduleAppointment}</h1>
                <p className="text-gray-600 mb-6">{t.selectDateTimeLocation}</p>
                
                {/* Date Selection */}
                <div className="bg-white rounded-xl p-4 border mb-4 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-800 mb-1">{t.selectDateStep}</h2>
                    <p className="text-gray-600 mb-4">{t.chooseDate}</p>

                    <div className="flex overflow-x-auto pb-2 mb-4 space-x-2">
                        {dateOptions.map((dateOption, index) => (
                            <div
                                key={index}
                                className={`flex-shrink-0 w-16 h-16 rounded-lg ${
                                    dateOption.date === data.date
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-100 text-gray-800"
                                } flex flex-col items-center justify-center cursor-pointer`}
                                onClick={() => handleDateSelection(dateOption.date)}
                            >
                                <span className="text-xs opacity-80">
                                    {dateOption.day}
                                </span>
                                <span className="text-lg font-bold">
                                    {dateOption.dayNum}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* City & Location Selection */}
                <div className="bg-white p-4 border shadow-sm rounded-xl">
                    <div className="flex space-x-2 shadow-sm">
                        {cities && Object.keys(cities).map((cityName) => (
                            <button
                                key={cityName}
                                className={`flex-1 py-2 px-4 rounded-full text-sm font-medium ${
                                    selectedCity === cityName
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-100 text-gray-800"
                                }`}
                                onClick={() => handleCityChange(cityName)}
                            >
                                {cityName}
                            </button>
                        ))}
                    </div>
                    
                    {!selectedCity ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <MapPin size={40} className="text-green-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-800 mb-2">
                                {t.selectCity}
                            </h3>
                            <p className="text-gray-600">{t.selectCityPrompt}</p>
                        </div>
                    ) : (
                        <div className="mt-4">
                            {/* Map Container */}
                            <div className="h-48 rounded-xl overflow-hidden shadow-md mb-4">
                                <MapContainer
                                    key={selectedCity} // Add this key prop to force re-render when city changes
                                    center={getCurrentCityCenter()}
                                    zoom={14}
                                    style={{ height: "100%", width: "100%" }}
                                    zoomControl={false}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        className="grayscale brightness-105 contrast-105"
                                    />

                                    {/* Add this controller for map view updates */}
                                    <MapViewController city={selectedCity} cities={cities} />

                                    {activeLocations.map((location) => (
                                        <Marker
                                            key={location.id}
                                            position={[location.lat, location.lng]}
                                            icon={defaultIcon}
                                            eventHandlers={{
                                                click: () => handleMarkerClick(location),
                                            }}
                                        >
                                            <Popup>{location.name}</Popup>
                                        </Marker>
                                    ))}

                                    {localSelectedLocation && localSelectedLocation.lat && localSelectedLocation.lng && (
                                        <FlyToMarker coords={[
                                            localSelectedLocation.lat, 
                                            localSelectedLocation.lng
                                        ]} />
                                    )}
                                </MapContainer>
                            </div>

                            {/* Search Input */}
                            <div className="relative mb-4">
                                <input
                                    type="text"
                                    placeholder={t.searchLocations}
                                    className="w-full bg-white rounded-lg py-3 px-4 pl-10 shadow-sm border border-gray-200"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <Search
                                    size={18}
                                    className="absolute left-3 top-3.5 text-gray-400"
                                />
                            </div>

                            {/* Location List */}
                            <div className="space-y-3 mb-16">
                                {filteredLocations.length > 0 ? (
                                    filteredLocations.map((location) => (
                                        <div
                                            key={location.id}
                                            className={`bg-white p-4 rounded-xl shadow-sm border ${
                                                localSelectedLocation &&
                                                localSelectedLocation.id === location.id
                                                    ? "border-green-500"
                                                    : "border-gray-100"
                                            }`}
                                            onClick={() => handleMarkerClick(location)}
                                        >
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-500 mr-3">
                                                    <MapPin size={18} />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-gray-800">
                                                        {location.name}
                                                    </h3>
                                                    <p className="text-xs text-gray-500">
                                                        {location.description}
                                                    </p>
                                                </div>
                                                <ChevronRight
                                                    size={20}
                                                    className="text-gray-400"
                                                />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 bg-white rounded-xl shadow-sm">
                                        <p className="text-gray-500">
                                            {t.noLocationsFound}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Fixed Detail Panel with Time & Participants */}
            {showDetail && localSelectedLocation && (
                <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl p-6 shadow-lg z-[1000] max-h-[70%] overflow-y-auto">
                    <div className="mb-4">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-500 mr-3">
                                <MapPin size={16} />
                            </div>
                            <div className="flex-grow">
                                <h3 className="font-medium text-gray-800">
                                    {localSelectedLocation.name}
                                </h3>
                                <p className="text-xs text-gray-500">
                                    {localSelectedLocation.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Participant Selection */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t.participants}
                        </label>
                        <div className="flex items-center justify-between bg-gray-100 rounded-lg p-2">
                            <button
                                onClick={decreaseParticipantCount}
                                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-green-500 shadow-sm"
                                disabled={participantCount <= 1}
                            >
                                <span className="text-xl font-bold">-</span>
                            </button>
                            <div className="text-center">
                                <span className="text-xl font-bold text-gray-800">
                                    {participantCount}
                                </span>
                                <p className="text-xs text-gray-500">
                                    {t.peopleLabel}
                                </p>
                            </div>
                            <button
                                onClick={increaseParticipantCount}
                                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-green-500 shadow-sm"
                                disabled={participantCount >= 10}
                            >
                                <span className="text-xl font-bold">+</span>
                            </button>
                        </div>
                    </div>

                    {/* Time Slots */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t.timeSlots || "Time Slots"}
                        </label>
                        
                        {availableTimeSlots.length > 0 ? (
                            <div className="grid grid-cols-2 gap-2">
                                {availableTimeSlots.map((slot) => (
                                    <div
                                        key={slot.id}
                                        className={`p-3 rounded-lg ${
                                            localSelectedTimeSlot &&
                                            localSelectedTimeSlot.id === slot.id
                                                ? "bg-green-500 text-white"
                                                : "bg-gray-100 text-gray-800"
                                        } flex flex-col items-center cursor-pointer`}
                                        onClick={() => handleTimeSelection(slot)}
                                    >
                                        <span className="text-xs opacity-80">
                                            {slot.label}
                                        </span>
                                        <span className="text-sm font-medium">
                                            {slot.start} - {slot.end}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4 bg-gray-50 rounded-lg">
                                <p className="text-gray-500">
                                    {t.noTimeSlotsAvailable || "No time slots available"}
                                </p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => {
                            window.scrollTo(0, 0);
                            onNext();
                        }}
                        className={`w-full py-3 rounded-xl font-medium ${
                            canProceed()
                                ? "bg-green-500 text-white"
                                : "bg-gray-200 text-gray-500"
                        }`}
                        disabled={!canProceed()}
                    >
                        {t.next}
                    </button>
                </div>
            )}
        </div>
    );
};

export default LocationSelection;