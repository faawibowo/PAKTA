import { supabase } from './supabase';

type UploadResponse = {
  path: string;
  publicUrl: string;
  contractId?: number; 
};

export const uploadFile = async (file: File): Promise<UploadResponse | null> => {
  try {
    const fileName = `${Date.now()}_${file.name}`;

    const { data, error } = await supabase
      .storage
      .from('contract')
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading file:', error);
      return null;
    }

    const { data: urlData } = supabase
      .storage
      .from('contract')
      .getPublicUrl(fileName);

    return { 
      path: fileName, 
      publicUrl: urlData.publicUrl 
    };
  } catch (error) {
    console.error('Error in uploadFile:', error);
    return null;
  }
};

const getOrCreateTestUser = async (): Promise<number> => {
  try {
    const userResponse = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (userResponse.ok) {
      const result = await userResponse.json();
      return result.user.id;
    }
    
    const getUsersResponse = await fetch('/api/users');
    if (getUsersResponse.ok) {
      const users = await getUsersResponse.json();
      if (users.length > 0) {
        return users[0].id;
      }
    }
    
    // Default fallback
    return 1;
  } catch (error) {
    console.warn('Could not get/create user, using default ID 1');
    return 1;
  }
};

export const uploadFileAndSaveContract = async (
  file: File,
  contractData: {
    title: string;
    parties: string;
    category: string;
    value: number;
    startDate: Date;
    endDate: Date;
    userId?: number; 
  }
): Promise<{ fileResult: UploadResponse; contract: any } | null> => {
  try {
    const fileResult = await uploadFile(file);
    if (!fileResult) {
      throw new Error('Failed to upload file');
    }

    const userId = contractData.userId || await getOrCreateTestUser();

    const contractPayload = {
      title: contractData.title,
      parties: contractData.parties,
      category: contractData.category,
      status: 'PENDING',
      value: contractData.value,
      startDate: contractData.startDate.toISOString(),
      endDate: contractData.endDate.toISOString(),
      fileUrl: fileResult.publicUrl,
      contractData: {
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        uploadPath: fileResult.path,
        uploadedAt: new Date().toISOString()
      },
      userId: userId
    };

    const response = await fetch('/api/contracts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contractPayload)
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    return {
      fileResult: {
        ...fileResult,
        contractId: result.contract.id
      },
      contract: result.contract
    };

  } catch (error) {
    console.error('Error in uploadFileAndSaveContract:', error);
    return null;
  }
};

export const deleteFile = async (fileName: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .storage
      .from('contract')
      .remove([fileName]);

    if (error) {
      console.error('Error deleting file:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteFile:', error);
    return false;
  }
};

export const getFileUrl = (fileName: string): string => {
  const { data } = supabase
    .storage
    .from('contract')
    .getPublicUrl(fileName);
    
  return data.publicUrl;
};

export const deleteContractAndFile = async (contractId: number): Promise<boolean> => {
  try {
    const response = await fetch(`/api/contracts/${contractId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error deleting contract and file:', error);
    return false;
  }
};
