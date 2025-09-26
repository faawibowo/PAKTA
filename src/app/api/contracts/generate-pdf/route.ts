import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generatePdfFromHtml } from '@/lib/server-pdf-generator';

export async function POST(request: NextRequest) {
  try {
    const { contractId, htmlContent, filename, title } = await request.json();

    console.log('PDF Generation Request:', { contractId, filename, title, contentLength: htmlContent?.length });

    if (!contractId || !htmlContent || !filename) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate PDF buffer from HTML content
    console.log('Starting PDF generation...');
    const pdfBuffer = await generatePdfFromHtml(htmlContent, title || 'Contract Document');
    console.log('PDF generated successfully, buffer size:', pdfBuffer.length);
    
    // Create filename for Supabase storage (keeping PDF extension)
    const storageFilename = `contracts/${contractId}/${filename}`;
    console.log('Uploading to Supabase storage:', storageFilename);
    
    // Upload PDF to Supabase storage
    const { data, error } = await supabase.storage
      .from('contract')
      .upload(storageFilename, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true // Allow overwriting if file exists
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to upload PDF to storage', details: error.message },
        { status: 500 }
      );
    }

    console.log('Upload successful:', data);

    // Get the public URL for the uploaded PDF
    const { data: urlData } = supabase.storage
      .from('contract')
      .getPublicUrl(storageFilename);

    if (!urlData?.publicUrl) {
      console.error('Failed to get public URL');
      return NextResponse.json(
        { success: false, error: 'Failed to get PDF URL' },
        { status: 500 }
      );
    }

    console.log('Public URL generated:', urlData.publicUrl);

    return NextResponse.json({
      success: true,
      fileUrl: urlData.publicUrl,
      storagePath: storageFilename,
      message: 'PDF contract document uploaded to storage successfully'
    });

  } catch (error) {
    console.error('Error generating and uploading PDF:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: 'Failed to generate PDF contract document', details: errorMessage },
      { status: 500 }
    );
  }
}