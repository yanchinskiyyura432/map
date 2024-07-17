import React, { useCallback, useRef, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { db } from '../firebaseConfig';
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: -3.745,
  lng: -38.523,
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

  const deleteMarker = (index: number) => {
    const markerToDelete = markers[index];
    setMarkers((current) => current.filter((_, i) => i !== index));
    deleteMarkerFromFirebase(markerToDelete.id);
  };

  const deleteAllMarkers = () => {
    markers.forEach(marker => deleteMarkerFromFirebase(marker.id));
    setMarkers([]);
  };

  const onLoad = useCallback((map: any) => (mapRef.current = map), []);

  return (
    <LoadScript googleMapsApiKey="AIzaSyDwlu8IU9fNDe9KZ72x4xMVnPgcWqUulDk">
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
      <button onClick={deleteAllMarkers}>Delete All Markers</button>
    </LoadScript>
  );
};

export default MapComponent;
