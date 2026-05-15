import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4005";

import { CompareItem, CreateCompareDTO } from "@comparesystem/shared";

export const compareService = {
    /**
     * Fetch all comparison items
     */
    getAll: async (): Promise<CompareItem[]> => {
        const response = await axios.get(`${API_BASE_URL}/compares`);
        return response.data;
    },

    /**
     * Get a single comparison item by ID
     */
    getById: async (id: string): Promise<CompareItem> => {
        const response = await axios.get(`${API_BASE_URL}/compares/${id}`);
        return response.data;
    },

    /**
     * Add a new comparison item
     */
    create: async (data: CreateCompareDTO): Promise<CompareItem> => {
        const response = await axios.post(`${API_BASE_URL}/add-comparison`, data);
        return response.data;
    },

    /**
     * Update an existing comparison item
     */
    update: async (id: string, data: Partial<CreateCompareDTO>): Promise<CompareItem> => {
        const response = await axios.put(`${API_BASE_URL}/compares/${id}`, data);
        return response.data;
    },

    /**
     * Delete a comparison item
     */
    delete: async (id: string): Promise<void> => {
        await axios.delete(`${API_BASE_URL}/compares/${id}`);
    },

    /**
     * Clear all comparison items
     */
    clearAll: async (): Promise<void> => {
        await axios.delete(`${API_BASE_URL}/compares`);
    }
};
