import { useState, useEffect } from 'react';
import { IMarkerData } from '../types/IMarkerData';
import { loadMarkersFromFirebase, saveMarkerToFirebase, updateMarkerInFirebase, deleteMarkerFromFirebase } from '../services/firestore';

export const useMarkers = () => {
  const [markers, setMarkers] = useState<IMarkerData[]>([]);

  useEffect(() => {
    const fetchMarkers = async () => {
      const loadedMarkers = await loadMarkersFromFirebase();
      setMarkers(loadedMarkers);
    };

    fetchMarkers();
  }, []);

  const addMarker = async (marker: IMarkerData) => {
    await saveMarkerToFirebase(marker);
    setMarkers((current) => [...current, marker]);
  };

  const updateMarker = async (id: string, marker: IMarkerData) => {
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
