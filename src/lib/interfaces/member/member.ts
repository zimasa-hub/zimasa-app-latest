export interface Member {
  id: string;
  email: string;
  emailConstraint: string;
  emailVerified: number;
  enabled: number;
  federationLink: string | null;
  firstName: string | null;
  lastName: string;
  realmId: string;
  username: string;
  createdTimestamp: number;
  serviceAccountClientLink: string | null;
  notBefore: number;
  phone: string | null;
  address: string | null;
  dateOfBirth: string | null;
  createdAt: string;
  updatedAt: string;
}