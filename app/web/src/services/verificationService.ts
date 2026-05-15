import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4005";

export const verificationService = {
  /**
   * Send OTP to a Telegram ID
   */
  sendVerification: async (telegramId: string): Promise<{ message: string }> => {
    const response = await axios.post(`${API_BASE_URL}/send-verification`, { telegramId });
    return response.data;
  },

  /**
   * Verify the code received via Telegram
   */
  verifyCode: async (telegramId: string, code: string): Promise<{ success: boolean; message?: string }> => {
    const response = await axios.post(`${API_BASE_URL}/verify`, { telegramId, code });
    return response.data;
  }
};
