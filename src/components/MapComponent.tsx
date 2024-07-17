import React, { useCallback, useRef, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { db } from '../firebaseConfig';
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';

const containerStyle = {
  width: '50vh',
  height: '50vh',
};

const center = {
  lat: 49.8397,
  lng: 24.0297,
};

const MapComponent: React.FC = () => {
  const [markers, setMarkers] = useState<any[]>([]);
  const mapRef = useRef<any>(null);

  const onMapClick = useCallback((event: any) => {
    const newMarker = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
      label: (markers.length + 1).toString(),
    };
    setMarkers((current) => [...current, newMarker]);
    saveMarkerToFirebase(newMarker);
  }, [markers]);

  const onMarkerDragEnd = useCallback((event: any, index: number) => {
    const updatedMarkers = [...markers];
    updatedMarkers[index] = {
      ...updatedMarkers[index],
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setMarkers(updatedMarkers);
    updateMarkerInFirebase(updatedMarkers[index].id, updatedMarkers[index]);
  }, [markers]);

  const saveMarkerToFirebase = async (marker: any) => {
    try {
      const docRef = await addDoc(collection(db, 'quests'), {
        location: { lat: marker.lat, lng: marker.lng },
        timestamp: new Date(),
        next: markers.length + 1,
      });
      marker.id = docRef.id;
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  const updateMarkerInFirebase = async (id: string, marker: any) => {
    try {
      const markerRef = doc(db, 'quests', id);
      await updateDoc(markerRef, {
        location: { lat: marker.lat, lng: marker.lng },
      });
    } catch (e) {
      console.error('Error updating document: ', e);
    }
  };

  const deleteMarkerFromFirebase = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'quests', id));
    } catch (e) {
      console.error('Error deleting document: ', e);
    }
  };

  const deleteMarker = async (id: string) => {
    await deleteMarkerFromFirebase(id);
    setMarkers((current) => current.filter((marker) => marker.id !== id));
  };

  const deleteAllMarkers = () => {
    markers.forEach((marker) => deleteMarker(marker.id));
    setMarkers([]);
  };

  const onLoad = useCallback((map: any) => (mapRef.current = map), []);

  return (
    <LoadScript googleMapsApiKey="AIzaSyDwlu8IU9fNDe9KZ72x4xMVnPgcWqUulDk"> {/* there are some issues with googleMapsApiKey related to google cloud error*/}
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
            value={''} // Set selected value logic here
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
