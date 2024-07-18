import { db } from '../firebaseConfig';
import { collection, addDoc, deleteDoc, doc, updateDoc, getDocs } from 'firebase/firestore';
import { IMarkerData } from '../types/IMarkerData';

export const loadMarkersFromFirebase = async (): Promise<IMarkerData[]> => {
  const querySnapshot = await getDocs(collection(db, 'quests'));
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      lat: data.location.lat,
      lng: data.location.lng,
      label: data.next.toString(),
    } as IMarkerData;
  });
};

export const saveMarkerToFirebase = async (marker: IMarkerData) => {
  const docRef = await addDoc(collection(db, 'quests'), {
    location: { lat: marker.lat, lng: marker.lng },
    timestamp: new Date(),
    next: marker.label,
  });
  marker.id = docRef.id;
};

export const updateMarkerInFirebase = async (id: string, marker: IMarkerData) => {
  const markerRef = doc(db, 'quests', id);
  await updateDoc(markerRef, {
    location: { lat: marker.lat, lng: marker.lng },
  });
};

export const deleteMarkerFromFirebase = async (id: string) => {
  await deleteDoc(doc(db, 'quests', id));
};
