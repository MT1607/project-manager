// lib/ping-be.ts
import axios from "axios";

export const pingBe = async () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const endpoint = `${API_URL}/health`;
    
    console.log('🔍 Pinging backend at:', endpoint);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // Tăng lên 30s

    try {
        const response = await axios.get(endpoint, {
            signal: controller.signal,
            timeout: 60000, // Thêm timeout của axios
        });
        
        clearTimeout(timeoutId);
        console.log('✅ Backend response:', response.status, response.data);
        return response.status === 200;
    } catch (error) {
        clearTimeout(timeoutId);
        
        // Log chi tiết lỗi
        if (axios.isAxiosError(error)) {
            console.error('❌ Axios Error:', {
                message: error.message,
                code: error.code,
                response: error.response?.data,
                status: error.response?.status,
            });
        } else if (error instanceof Error && error.name === 'CanceledError') {
            console.error("⏱️ Request timed out after 30s");
        } else {
            console.error("❌ Unknown error:", error);
        }
        
        return false;
    }
}