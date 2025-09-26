'use client'

import { useState } from 'react';
import { uploadFileAndSaveContract } from '@/lib/fileService';

export default function ContractUploadForm() {
  const [formData, setFormData] = useState({
    title: '',
    parties: '',
    category: '',
    value: 0,
    startDate: '',
    endDate: '',
    file: null as File | null
  });
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.file) {
      alert('Please select a file');
      return;
    }

    setUploading(true);
    
    try {
      const result = await uploadFileAndSaveContract(formData.file, {
        title: formData.title,
        parties: formData.parties,
        category: formData.category,
        value: formData.value,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        userId: 1 
      });

      if (result) {
        setUploadResult(result);
        alert('Contract uploaded and saved successfully!');
        console.log('File URL:', result.fileResult.publicUrl);
        console.log('Contract ID:', result.contract.id);
        
        setFormData({
          title: '',
          parties: '',
          category: '',
          value: 0,
          startDate: '',
          endDate: '',
          file: null
        });
      } else {
        alert('Failed to upload contract');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading contract');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Upload Contract</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Parties</label>
          <input
            type="text"
            value={formData.parties}
            onChange={(e) => setFormData({ ...formData, parties: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Company A, Company B"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            required
          >
            <option value="">Select Category</option>
            <option value="Service Agreement">Service Agreement</option>
            <option value="Purchase Order">Purchase Order</option>
            <option value="Employment">Employment</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Value</label>
          <div className="flex items-center">
            <span className="mr-2 text-gray-600">Rp</span>
            <input
              type="number"
              value={formData.value === 0 ? '' : formData.value}
              onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border rounded-md"
              min="0"
              step="0.01"
              placeholder="0"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Contract File</label>
          <input
            type="file"
            onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
            accept=".pdf,.doc,.docx"
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 disabled:opacity-50 cursor-pointer"
        >
          {uploading ? 'Uploading...' : 'Upload Contract'}
        </button>
      </form>

      {uploadResult && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="text-green-800 font-medium">Upload Successful!</h3>
          <p className="text-green-600 text-sm">Contract ID: {uploadResult.contract.id}</p>
          <a 
            href={uploadResult.fileResult.publicUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            View File
          </a>
        </div>
      )}
    </div>
  );
}