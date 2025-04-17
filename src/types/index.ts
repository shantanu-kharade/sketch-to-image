export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

export interface Sketch {
  id: string;
  name: string;
  sketchURL: string;
  generatedImageURL?: string;
  createdAt: number;
  updatedAt: number;
  userId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
} 