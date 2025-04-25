export interface Doctor {
  id: string;
  name: string;
  speciality: string[];
  experience: number;
  fees: number;
  consultationMode: 'Video Consult' | 'In Clinic';
}

export type ConsultationMode = 'Video Consult' | 'In Clinic';

export type SortOption = 'fees' | 'experience';

export interface FilterState {
  searchQuery: string;
  consultationMode: ConsultationMode | null;
  specialities: string[];
  sortBy: SortOption | null;
} 