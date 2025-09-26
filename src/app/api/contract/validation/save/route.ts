import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      contractId,
      fileName,
      fileType,
      validationResults,
      riskPercentage,
      mandatoryElements,
      risks,
      recommendations
    } = body;

    // Debug: Log received data
    console.log('Received validation save request:', {
      contractId,
      fileName,
      fileType,
      hasValidationResults: !!validationResults,
      riskPercentage,
      hasMandatoryElements: !!mandatoryElements,
      mandatoryElementsKeys: mandatoryElements ? Object.keys(mandatoryElements) : [],
      hasRisks: !!risks,
      risksCount: risks ? risks.length : 0,
      hasRecommendations: !!recommendations,
      recommendationsCount: recommendations ? recommendations.length : 0
    });

    let finalContractId = contractId;
    
    if (!contractId) {
        return NextResponse.json(
          { success: false, error: 'contractId is required' },
          { status: 400 }
        );
    }

    // Helper functions for new schema fields
    const extractMissingElements = (elements: any): string[] => {
      if (!elements) return [];
      return Object.entries(elements)
        .filter(([_, status]) => status === 'missing')
        .map(([name, _]) => name);
    };

    const extractPresentElements = (elements: any): string[] => {
      if (!elements) return [];
      return Object.entries(elements)
        .filter(([_, status]) => status === 'present')
        .map(([name, _]) => name);
    };

    const countRisksBySeverity = (risks: any[], severity: string): number => {
      if (!risks) return 0;
      return risks.filter((risk: any) => risk.severity?.toLowerCase() === severity).length;
    };

    const getValidationStatus = (riskPercentage: number): 'VALID' | 'WARNING' | 'HIGH_RISK' => {
      if (riskPercentage >= 70) return 'HIGH_RISK';
      if (riskPercentage >= 30) return 'WARNING';
      return 'VALID';
    };

    // Debug: Log processed data before saving
    const processedData = {
      riskPercentage: riskPercentage || 0,
      overallStatus: getValidationStatus(riskPercentage || 0),
      mandatoryElems: mandatoryElements || {},
      missingElements: extractMissingElements(mandatoryElements),
      presentElements: extractPresentElements(mandatoryElements),
      riskDetected: risks || [],
      highRisks: countRisksBySeverity(risks, 'high'),
      mediumRisks: countRisksBySeverity(risks, 'medium'),
      lowRisks: countRisksBySeverity(risks, 'low'),
      recommendations: recommendations || []
    };

    console.log('Processed data for database save:', processedData);

    // Save the validation results using the enhanced schema
    const contractValidation = await prisma.contractValidation.create({
      data: {
        contractId: finalContractId,
        
        // Use processed data
        riskPercentage: processedData.riskPercentage,
        overallStatus: processedData.overallStatus,
        mandatoryElems: processedData.mandatoryElems,
        riskDetected: processedData.riskDetected,
        highRisks: processedData.highRisks,
        mediumRisks: processedData.mediumRisks,
        lowRisks: processedData.lowRisks,
        recommendations: processedData.recommendations,
        
        // Metadata & Audit
        analysisDate: new Date(),
        validationData: validationResults
      },
      include: {
        contract: {
          select: {
            id: true,
            title: true,
            status: true,
            uploadedAt: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Validation results saved successfully',
      data: {
        validationId: contractValidation.id,
        contractId: finalContractId,
        contract: contractValidation.contract,
        riskAssessment: {
          overallStatus: contractValidation.overallStatus,
          riskPercentage: contractValidation.riskPercentage,
          riskBreakdown: {
            high: contractValidation.highRisks,
            medium: contractValidation.mediumRisks,
            low: contractValidation.lowRisks
          }
        },
        savedAt: contractValidation.analysisDate
      }
    });

  } catch (error) {
    console.error('Error saving validation results:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to save validation results',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contractId = searchParams.get('contractId');
    const status = searchParams.get('status'); // VALID, WARNING, HIGH_RISK
    
    let whereClause: any = {};
    
    if (contractId) {
      whereClause.contractId = parseInt(contractId);
    }
    
    if (status) {
      whereClause.overallStatus = status;
    }
    
    const validations = await prisma.contractValidation.findMany({
      where: whereClause,
      include: {
        contract: {
          select: {
            id: true,
            title: true,
            status: true,
            uploadedAt: true,
            parties: true,
            category: true
          }
        }
      },
      orderBy: {
        analysisDate: 'desc'
      },
      take: 20 // Limit to last 20 validations
    });

    // Add summary statistics
    const summary = await prisma.contractValidation.aggregate({
      _avg: {
        riskPercentage: true
      },
      _sum: {
        highRisks: true,
        mediumRisks: true,
        lowRisks: true
      },
      _count: {
        id: true
      },
      where: whereClause
    });

    return NextResponse.json({
      success: true,
      data: {
        validations,
        summary: {
          totalValidations: summary._count.id,
          averageRiskPercentage: Math.round(summary._avg.riskPercentage || 0),
          totalRisks: {
            high: summary._sum.highRisks || 0,
            medium: summary._sum.mediumRisks || 0,
            low: summary._sum.lowRisks || 0
          }
        }
      }
    });

  } catch (error) {
    console.error('Error fetching validation history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch validation history' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}