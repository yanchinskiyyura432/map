import React, { useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useMarkers } from '../hooks/useMarkers';
import { MarkerData } from '../types/IMarkerData';

const containerStyle = {
  width: '50vh',
  height: '50vh',
};

const center = {
  lat: 49.8397,
  lng: 24.0297,
};

const MapComponent: React.FC = () => {
  const { markers, addMarker, updateMarker, deleteMarker, setMarkers } = useMarkers();
  const mapRef = useRef<google.maps.Map | null>(null);

  const onMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newMarker: MarkerData = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
        label: (markers.length + 1).toString(),
      };
      addMarker(newMarker);
    }
  }, [markers, addMarker]);

  const onMarkerDragEnd = useCallback((event: google.maps.MapMouseEvent, index: number) => {
    if (event.latLng) {
      const updatedMarker = {
        ...markers[index],
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      updateMarker(updatedMarker.id!, updatedMarker);
    }
  }, [markers, updateMarker]);

  const deleteAllMarkers = () => {
    markers.forEach((marker) => {
      if (marker.id) deleteMarker(marker.id);
    });
    setMarkers([]);
  };

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  return (
    <LoadScript googleMapsApiKey="AIzaSyDwlu8IU9fNDe9KZ72x4xMVnPgcWqUulDk">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
          onClick={onMapClick}
          onLoad={onLoad}
        >
          {markers.map((marker, index) => (
            <Marker
              key={marker.id || index}
              position={{ lat: marker.lat, lng: marker.lng }}
              label={marker.label}
              draggable={true}
              onDragEnd={(event) => onMarkerDragEnd(event, index)}
            />
          ))}
        </GoogleMap>
        <div style={{ marginTop: '10px' }}>
          <button type="button" onClick={deleteAllMarkers}>Delete All Markers</button>
        </div>
        <div style={{ marginTop: '10px', width: '100%' }}>
          <label htmlFor="markerDropdown">Delete Marker:</label>
          <select
            id="markerDropdown"
            style={{ marginLeft: '10px' }}
            value={''}
            onChange={(e) => deleteMarker(e.target.value)}
          >
            <option value="">Select Marker</option>
            {markers.map((marker, index) => (
              <option key={marker.id || index} value={marker.id}>
                Marker {marker.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </LoadScript>
  );
};

export default MapComponent;
