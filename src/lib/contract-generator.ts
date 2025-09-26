import { ContractFormData } from "./contract-form-schema";

export function generateContractDraft(values: ContractFormData): string {
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
    
    <p><strong>IN WITNESS WHEREOF</strong>, the parties have executed this Agreement as of the date first written above.</p>
    
    <p><strong>PARTY A:</strong> _________________________<br/>
    ${values.partyARepresentative}, ${values.partyAName}</p>
    
    <p><strong>PARTY B:</strong> _________________________<br/>
    ${values.partyBRepresentative}, ${values.partyBName}</p>
  `;
}