export interface IMarkerData {
    id?: string;
    lat: number;
    lng: number;
    label: string;
    location?: { lat: number; lng: number }; 
    next?: number; 
  }
  