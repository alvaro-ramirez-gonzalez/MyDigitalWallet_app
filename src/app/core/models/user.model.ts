export interface UserModel {
  uid: string;
  nombre: string;
  apellido: string;
  tipoDocumento: 'CC' | 'CE' | 'PASAPORTE';
  numeroDocumento: string;
  pais: string;
  email: string;
  biometricEnabled: boolean;
  fcmToken?: string;
  createdAt: Date;
}