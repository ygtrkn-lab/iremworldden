export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alternativePhone?: string;
  
  customerType: 'lead' | 'prospect' | 'active_client' | 'past_client';
  leadSource: 'website' | 'referral' | 'social_media' | 'advertisement' | 'walk_in' | 'phone_call' | 'other';
  status: 'active' | 'inactive' | 'blacklisted';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  address: {
    street?: string;
    district?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  
  propertyPreferences: {
    type: 'sale' | 'rent' | 'both';
    categories: Array<{
      main: 'Konut' | 'İş Yeri' | 'Arsa' | 'Bina' | 'Turistik Tesis' | 'Devremülk';
      sub: string;
    }>;
    budgetMin?: number;
    budgetMax?: number;
    preferredLocations: Array<{
      city?: string;
      district?: string;
      neighborhood?: string;
    }>;
    roomRequirement?: 'Stüdyo' | '1+0' | '1+1' | '2+0' | '2+1' | '3+1' | '3+2' | '4+1' | '4+2' | '5+1' | '5+2' | '6+ Oda';
    sizeMin?: number;
    sizeMax?: number;
    features: string[];
  };
  
  assignedAgent?: {
    agentId: string;
    agentName: string;
    assignedDate: string;
  };
  
  communicationSummary: {
    lastContactDate?: string;
    totalInteractions: number;
    lastInteractionType?: 'phone' | 'email' | 'meeting' | 'whatsapp' | 'sms' | 'site_visit';
    nextFollowUpDate?: string;
  };
  
  interestedProperties: Array<{
    propertyId: string;
    propertyTitle: string;
    interestLevel: 'low' | 'medium' | 'high';
    addedDate: string;
    status: 'interested' | 'viewed' | 'offered' | 'rejected' | 'purchased';
    notes?: string;
  }>;
  
  notes?: string;
  tags: string[];
  
  createdBy: {
    userId: string;
    userName: string;
  };
  lastUpdatedBy?: {
    userId: string;
    userName: string;
  };
  
  createdAt: string;
  updatedAt: string;
}

export interface CustomerInteraction {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  
  interactionType: 
    | 'phone_call_incoming'
    | 'phone_call_outgoing'
    | 'email_sent'
    | 'email_received'
    | 'meeting_office'
    | 'meeting_property'
    | 'whatsapp_message'
    | 'sms_sent'
    | 'site_visit'
    | 'property_showing'
    | 'contract_signing'
    | 'follow_up_call'
    | 'complaint'
    | 'feedback'
    | 'other';
  
  subject: string;
  description: string;
  
  outcome?: 
    | 'successful'
    | 'no_answer'
    | 'busy'
    | 'callback_requested'
    | 'meeting_scheduled'
    | 'property_visit_scheduled'
    | 'offer_made'
    | 'offer_accepted'
    | 'offer_rejected'
    | 'contract_signed'
    | 'deal_closed'
    | 'lost_opportunity'
    | 'follow_up_needed';
  
  relatedProperty?: {
    propertyId: string;
    propertyTitle: string;
    propertyType: 'sale' | 'rent';
  };
  
  followUpRequired: boolean;
  followUpDate?: string;
  followUpNotes?: string;
  
  attachments: Array<{
    fileName: string;
    fileUrl: string;
    fileType: string;
    uploadDate: string;
  }>;
  
  duration?: number;
  
  agentId: string;
  agentName: string;
  
  customerSatisfaction?: {
    rating: number;
    feedback?: string;
  };
  
  ipAddress?: string;
  userAgent?: string;
  
  interactionDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerDocument {
  id: string;
  customerId: string;
  customerName: string;
  
  documentType: 
    | 'identity_document'
    | 'income_certificate'
    | 'bank_statement'
    | 'employment_letter'
    | 'tax_declaration'
    | 'property_deed'
    | 'mortgage_document'
    | 'insurance_policy'
    | 'contract_draft'
    | 'signed_contract'
    | 'payment_receipt'
    | 'property_valuation'
    | 'inspection_report'
    | 'authorization_letter'
    | 'power_of_attorney'
    | 'marriage_certificate'
    | 'divorce_decree'
    | 'inheritance_document'
    | 'court_decision'
    | 'notary_document'
    | 'other';
  
  title: string;
  description?: string;
  
  fileName: string;
  originalFileName: string;
  fileUrl: string;
  fileSize?: number;
  mimeType?: string;
  fileExtension?: string;
  
  status: 'pending_review' | 'approved' | 'rejected' | 'expired' | 'archived';
  
  reviewedBy?: {
    userId: string;
    userName: string;
    reviewDate: string;
    reviewNotes?: string;
  };
  
  relatedProperty?: {
    propertyId: string;
    propertyTitle: string;
    propertyType: 'sale' | 'rent';
  };
  
  relatedTransaction?: {
    transactionId: string;
    transactionType: 'sale' | 'rent' | 'valuation' | 'consultation';
  };
  
  validFrom?: string;
  validUntil?: string;
  isExpired: boolean;
  
  accessLevel: 'public' | 'internal' | 'confidential' | 'restricted';
  
  version: number;
  parentDocumentId?: string;
  
  tags: string[];
  category?: string;
  
  uploadedBy: {
    userId: string;
    userName: string;
    userRole?: string;
  };
  
  lastModifiedBy?: {
    userId: string;
    userName: string;
  };
  
  notes?: string;
  
  ipAddress?: string;
  userAgent?: string;
  
  uploadDate: string;
  createdAt: string;
  updatedAt: string;
}

// Form interfaces for creating/updating
export interface CreateCustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alternativePhone?: string;
  customerType?: Customer['customerType'];
  leadSource?: Customer['leadSource'];
  priority?: Customer['priority'];
  address?: Customer['address'];
  propertyPreferences?: Partial<Customer['propertyPreferences']>;
  assignedAgent?: Customer['assignedAgent'];
  notes?: string;
  tags?: string[];
}

export interface UpdateCustomerData extends Partial<CreateCustomerData> {
  status?: Customer['status'];
  communicationSummary?: Partial<Customer['communicationSummary']>;
  interestedProperties?: Customer['interestedProperties'];
}

export interface CreateInteractionData {
  customerId: string;
  interactionType: CustomerInteraction['interactionType'];
  subject: string;
  description: string;
  outcome?: CustomerInteraction['outcome'];
  relatedProperty?: CustomerInteraction['relatedProperty'];
  followUpRequired?: boolean;
  followUpDate?: string;
  followUpNotes?: string;
  duration?: number;
  customerSatisfaction?: CustomerInteraction['customerSatisfaction'];
}

export interface CreateDocumentData {
  customerId: string;
  documentType: CustomerDocument['documentType'];
  title: string;
  description?: string;
  relatedProperty?: CustomerDocument['relatedProperty'];
  relatedTransaction?: CustomerDocument['relatedTransaction'];
  validFrom?: string;
  validUntil?: string;
  accessLevel?: CustomerDocument['accessLevel'];
  tags?: string[];
  category?: string;
  notes?: string;
}

// Filter interfaces
export interface CustomerFilters {
  customerType?: Customer['customerType'];
  status?: Customer['status'];
  priority?: Customer['priority'];
  leadSource?: Customer['leadSource'];
  assignedAgent?: string;
  city?: string;
  district?: string;
  budgetMin?: number;
  budgetMax?: number;
  propertyType?: 'sale' | 'rent' | 'both';
  tags?: string[];
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface InteractionFilters {
  customerId?: string;
  agentId?: string;
  interactionType?: CustomerInteraction['interactionType'];
  outcome?: CustomerInteraction['outcome'];
  followUpRequired?: boolean;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface DocumentFilters {
  customerId?: string;
  documentType?: CustomerDocument['documentType'];
  status?: CustomerDocument['status'];
  accessLevel?: CustomerDocument['accessLevel'];
  uploadedBy?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

// Statistics interfaces
export interface CustomerStats {
  totalCustomers: number;
  newLeads: number;
  activeClients: number;
  conversionRate: number;
  byType: Record<Customer['customerType'], number>;
  bySource: Record<Customer['leadSource'], number>;
  byPriority: Record<Customer['priority'], number>;
  byAgent: Array<{
    agentId: string;
    agentName: string;
    customerCount: number;
  }>;
}

export interface InteractionStats {
  totalInteractions: number;
  todayInteractions: number;
  weekInteractions: number;
  monthInteractions: number;
  byType: Record<CustomerInteraction['interactionType'], number>;
  byOutcome: Record<string, number>;
  averageDuration: number;
  followUpsPending: number;
}
