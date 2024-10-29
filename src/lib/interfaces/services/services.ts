import { Member } from "../member/member"
import { ProviderServicePaymentMethod, ProviderUser } from "../providers/providers"

export interface PaymentMethod {
    id: number
    method: string
    isGlobal: boolean
    createdAt: string | null
    updatedAt: string | null
  }
  
 export interface ServiceType {
    id: number
    name: string
    description: string
  }

 export interface ServiceHandler {
    id: number;
    isAvailable: boolean;
    providerUser: ProviderUser;
    serviceName: string | null;
  }
  
 export interface ServiceCategory {
    id: number;
    name: string;
    description: string;
    serviceType: string;
  }

 export interface ServiceAvailability {
    id: number;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
   
    serviceName: string | null;
  }
  

  export interface Service {
    id: number;
    name: string | null;
    description: string;
    maximumCapacity: number;
    price: number;
    durationMins: number;
    availability: string;
    startDate: string;
    endDate: string;
    insuranceAccepted: boolean;
    isActive: boolean;
    tags: string[];
    location: string;
    createdAt: string | null;
    updatedAt: string | null;
    serviceCategory: ServiceCategory;
    providerUser: ProviderUser | null;
    providerServicePaymentMethods: ProviderServicePaymentMethod[];
    serviceInsurers: any[];
    serviceHandlers: ServiceHandler[];
    serviceAvailability: ServiceAvailability[];
  }
 