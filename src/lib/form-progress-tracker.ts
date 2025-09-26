import { ContractFormData } from './contract-form-schema';

export interface SectionProgress {
  id: string;
  name: string;
  icon: string;
  isComplete: boolean;
  completionPercentage: number;
  requiredFields: (keyof ContractFormData)[];
}

export function calculateSectionProgress(
  values: Partial<ContractFormData>
): SectionProgress[] {
  const sections: SectionProgress[] = [
    {
      id: 'parties',
      name: 'Parties',
      icon: 'Users',
      isComplete: false,
      completionPercentage: 0,
      requiredFields: [
        'contractTitle',
        'partyAName',
        'partyAAddress',
        'partyARepresentative',
        'partyBName',
        'partyBAddress',
        'partyBRepresentative'
      ]
    },
    {
      id: 'scope',
      name: 'Scope',
      icon: 'FileText',
      isComplete: false,
      completionPercentage: 0,
      requiredFields: [
        'serviceType',
        'goodsCommodities',
        'serviceLocations'
      ]
    },
    {
      id: 'commercial',
      name: 'Commercial',
      icon: 'Bot',
      isComplete: false,
      completionPercentage: 0,
      requiredFields: [
        'contractValue',
        'currency',
        'paymentTerms'
      ]
    },
    {
      id: 'duration',
      name: 'Duration',
      icon: 'AlertCircle',
      isComplete: false,
      completionPercentage: 0,
      requiredFields: [
        'contractDuration',
        'startDate',
        'terminationClause'
      ]
    },
    {
      id: 'operational',
      name: 'Operational',
      icon: 'Settings',
      isComplete: false,
      completionPercentage: 0,
      requiredFields: [
        'serviceLevel',
        'insuranceRequirements',
        'liabilityIndemnity'
      ]
    },
    {
      id: 'legal',
      name: 'Legal',
      icon: 'Save',
      isComplete: false,
      completionPercentage: 0,
      requiredFields: [
        'governingLaw',
        'disputeResolution'
      ]
    },
    {
      id: 'ai-enhancement',
      name: 'AI+',
      icon: 'Bot',
      isComplete: false,
      completionPercentage: 0,
      requiredFields: []
    }
  ];

  sections.forEach(section => {
    const filledFields = section.requiredFields.filter(field => {
      const value = values[field];
      return value !== undefined && value !== null && value !== '';
    });
    
    if (section.requiredFields.length === 0) {
      // For optional sections like AI enhancement
      section.completionPercentage = 100;
      section.isComplete = true;
    } else {
      section.completionPercentage = Math.round(
        (filledFields.length / section.requiredFields.length) * 100
      );
      section.isComplete = section.completionPercentage === 100;
    }
  });

  return sections;
}

export function getOverallProgress(sections: SectionProgress[]): number {
  const totalPercentage = sections.reduce((acc, section) => acc + section.completionPercentage, 0);
  return Math.round(totalPercentage / sections.length);
}