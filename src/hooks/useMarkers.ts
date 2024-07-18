import { useState, useEffect } from 'react';
import { MarkerData } from '../types/IMarkerData';
import { loadMarkersFromFirebase, saveMarkerToFirebase, updateMarkerInFirebase, deleteMarkerFromFirebase } from '../services/firestore';

export const useMarkers = () => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  useEffect(() => {
    const fetchMarkers = async () => {
      const loadedMarkers = await loadMarkersFromFirebase();
      setMarkers(loadedMarkers);
    };

    fetchMarkers();
  }, []);

  const addMarker = async (marker: MarkerData) => {
    await saveMarkerToFirebase(marker);
    setMarkers((current) => [...current, marker]);
  };

  const updateMarker = async (id: string, marker: MarkerData) => {
    await updateMarkerInFirebase(id, marker);
    setMarkers((current) => current.map((m) => (m.id === id ? marker : m)));
  };

  const deleteMarker = async (id: string) => {
    await deleteMarkerFromFirebase(id);
    setMarkers((current) => current.filter((marker) => marker.id !== id));
  };

  return {
    markers,
    addMarker,
    updateMarker,
    deleteMarker,
    setMarkers
  };
};
