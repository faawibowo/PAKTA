import * as z from "zod";

export const contractFormSchema = z.object({
  // Parties & Identification
  contractTitle: z
    .string()
    .min(2, { message: "Contract title must be at least 2 characters." }),
  partyAName: z
    .string()
    .min(2, { message: "Party A name must be at least 2 characters." }),
  partyAAddress: z
    .string()
    .min(5, { message: "Party A address must be at least 5 characters." }),
  partyBName: z
    .string()
    .min(2, { message: "Party B name must be at least 2 characters." }),
  partyBAddress: z
    .string()
    .min(5, { message: "Party B address must be at least 5 characters." }),
  partyARepresentative: z
    .string()
    .min(2, { message: "Representative name is required." }),
  partyBRepresentative: z
    .string()
    .min(2, { message: "Representative name is required." }),

  // Scope of Work
  serviceType: z.string().min(1, { message: "Service type is required." }),
  goodsCommodities: z
    .string()
    .min(2, { message: "Goods/commodities description is required." }),
  serviceLocations: z
    .string()
    .min(5, { message: "Service locations must be specified." }),

  // Commercial Terms
  contractValue: z.string().min(1, { message: "Contract value is required." }),
  currency: z.string().min(1, { message: "Currency is required." }),
  paymentTerms: z.string().min(1, { message: "Payment terms are required." }),
  penaltyFees: z.string().optional(),

  // Duration & Termination
  contractDuration: z.string().min(1, { message: "Duration is required." }),
  startDate: z.string().min(1, { message: "Start date is required." }),
  endDate: z.string().optional(),
  terminationClause: z
    .string()
    .min(5, { message: "Termination clause must be specified." }),

  // Operational Terms
  serviceLevel: z
    .string()
    .min(5, { message: "Service level requirements must be specified." }),
  insuranceRequirements: z
    .string()
    .min(5, { message: "Insurance requirements must be specified." }),
  liabilityIndemnity: z
    .string()
    .min(5, { message: "Liability and indemnity terms must be specified." }),
  forceMajeure: z.string().optional(),

  // Legal & Compliance
  governingLaw: z.string().min(1, { message: "Governing law is required." }),
  confidentiality: z.string().optional(),
  disputeResolution: z
    .string()
    .min(1, { message: "Dispute resolution method is required." }),
});

export type ContractFormData = z.infer<typeof contractFormSchema>;