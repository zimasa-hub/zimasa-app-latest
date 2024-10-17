export interface Member {
    id: number
    principalId: number
    relationshipTypeId: number | null
    username: string
    email: string
    role: string | null
    corporateId: number | null
    firstName: string | null
    lastName: string | null
    phone: string | null
    address: string | null
    dateOfBirth: string | null
    medicalHistory: string | null
    createdAt: string
    updatedAt: string | null
  }