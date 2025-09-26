import { ContractFormData } from "./contract-form-schema";

// Basic template generator (fallback)
function generateBasicTemplate(values: ContractFormData): string {
  return `
    <p><strong>${values.contractTitle}</strong></p>
    <p>This Contract Agreement ("Agreement") is made and entered into on this ${new Date().toLocaleDateString()} by and between:</p>
    <p><strong>PARTY A (Client/Shipper):</strong> ${values.partyAName}<br/>
    Address: ${values.partyAAddress}<br/>
    Representative: ${values.partyARepresentative}</p>
    <p><strong>PARTY B (Provider/Carrier):</strong> ${values.partyBName}<br/>
    Address: ${values.partyBAddress}<br/>
    Representative: ${values.partyBRepresentative}</p>
    
    <p><strong>WHEREAS</strong>, Party A desires to engage Party B for the provision of ${
      values.serviceType
    } services, and Party B is willing to provide such services in accordance with the terms and conditions set forth herein.</p>
    
    <p><strong>NOW, THEREFORE</strong>, in consideration of the mutual covenants and agreements contained herein, the parties agree as follows:</p>
    
    <p><strong>1. SCOPE OF SERVICES:</strong></p>
    <p>Service Type: ${values.serviceType}</p>
    <p>Goods/Commodities Covered: ${values.goodsCommodities}</p>
    <p>Service Locations: ${values.serviceLocations}</p>
    
    <p><strong>2. COMMERCIAL TERMS:</strong></p>
    <p>Contract Value: ${values.contractValue} ${values.currency}</p>
    <p>Payment Terms: ${values.paymentTerms}</p>
    ${
      values.penaltyFees
        ? `<p>Penalty/Late Fees: ${values.penaltyFees}</p>`
        : ""
    }
    
    <p><strong>3. DURATION & TERMINATION:</strong></p>
    <p>Contract Duration: ${values.contractDuration}</p>
    <p>Start Date: ${values.startDate}</p>
    ${values.endDate ? `<p>End Date: ${values.endDate}</p>` : ""}
    <p>Termination: ${values.terminationClause}</p>
    
    <p><strong>4. OPERATIONAL TERMS:</strong></p>
    <p>Service Level/Performance Metrics: ${values.serviceLevel}</p>
    <p>Insurance Requirements: ${values.insuranceRequirements}</p>
    <p>Liability & Indemnity: ${
      values.liabilityIndemnity
    } <span class="text-error underline">Review liability terms carefully for fairness and enforceability.</span></p>
    ${
      values.forceMajeure
        ? `<p>Force Majeure: ${values.forceMajeure}</p>`
        : '<p>Force Majeure: Standard force majeure clause applies for unforeseeable circumstances. <span class="text-warning underline">Consider defining specific force majeure events.</span></p>'
    }
    
    <p><strong>5. LEGAL & COMPLIANCE:</strong></p>
    <p>Governing Law: ${values.governingLaw}</p>
    ${
      values.confidentiality
        ? `<p>Confidentiality: ${values.confidentiality}</p>`
        : ""
    }
    <p>Dispute Resolution: ${values.disputeResolution}</p>
    
    ${values.additionalRequirements ? `<p><strong>6. ADDITIONAL REQUIREMENTS:</strong></p><p>${values.additionalRequirements}</p>` : ''}
    
    <p><strong>IN WITNESS WHEREOF</strong>, the parties have executed this Agreement as of the date first written above.</p>
    
    <p><strong>PARTY A:</strong> _________________________<br/>
    ${values.partyARepresentative}, ${values.partyAName}</p>
    
    <p><strong>PARTY B:</strong> _________________________<br/>
    ${values.partyBRepresentative}, ${values.partyBName}</p>
  `;
}

// Enhanced AI-powered contract generator
export async function generateContractDraft(values: ContractFormData): Promise<string> {
  try {
    // Create a comprehensive prompt for the AI
    const contractDetails = {
      title: values.contractTitle,
      parties: {
        partyA: {
          name: values.partyAName,
          address: values.partyAAddress,
          representative: values.partyARepresentative
        },
        partyB: {
          name: values.partyBName,
          address: values.partyBAddress,
          representative: values.partyBRepresentative
        }
      },
      scope: {
        serviceType: values.serviceType,
        goods: values.goodsCommodities,
        locations: values.serviceLocations
      },
      commercial: {
        value: values.contractValue,
        currency: values.currency,
        paymentTerms: values.paymentTerms,
        penaltyFees: values.penaltyFees
      },
      duration: {
        contractDuration: values.contractDuration,
        startDate: values.startDate,
        endDate: values.endDate,
        terminationClause: values.terminationClause
      },
      operational: {
        serviceLevel: values.serviceLevel,
        insurance: values.insuranceRequirements,
        liability: values.liabilityIndemnity,
        forceMajeure: values.forceMajeure
      },
      legal: {
        governingLaw: values.governingLaw,
        confidentiality: values.confidentiality,
        disputeResolution: values.disputeResolution
      },
      additional: {
        requirements: values.additionalRequirements,
        instructions: values.specialInstructions,
        supportingDocuments: values.supportingDocuments
      }
    };

    const aiPrompt = `
Please generate a comprehensive, legally sound contract based on the following details and template structure. 

BASIC TEMPLATE STRUCTURE (use this as a foundation but enhance it):
${generateBasicTemplate(values)}

CONTRACT DETAILS:
${JSON.stringify(contractDetails, null, 2)}

INSTRUCTIONS:
1. Use the basic template structure as a foundation
2. Enhance and expand each section with more professional legal language
3. Add relevant clauses based on the service type and requirements
4. Incorporate the additional requirements and special instructions
5. Ensure the contract is comprehensive and legally sound
6. Format the output as HTML with proper paragraph tags
7. Add legal warnings or notes where appropriate
8. Make sure all party information, dates, and terms are accurately included

${values.specialInstructions ? `SPECIAL INSTRUCTIONS: ${values.specialInstructions}` : ''}

${values.supportingDocuments?.length ? `
SUPPORTING DOCUMENTS CONTENT:
${values.supportingDocuments.join('\n\n---\n\n')}
Please incorporate relevant information from these documents into the contract.
` : ''}

Please return only the enhanced HTML contract content without any additional text or explanations.
`;

    const response = await fetch('/api/contract', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: aiPrompt }),
    });

    if (!response.ok) {
      console.warn('AI API failed, falling back to basic template');
      return generateBasicTemplate(values);
    }

    const result = await response.json();
    
    // If the AI returns structured JSON, extract the content
    if (result.content) {
      return result.content;
    }
    
    // If it's just text, return it directly
    if (typeof result === 'string') {
      return result;
    }

    // Fallback to basic template if AI response is unexpected
    return generateBasicTemplate(values);

  } catch (error) {
    console.error('Error generating AI contract:', error);
    // Fallback to basic template on error
    return generateBasicTemplate(values);
  }
}