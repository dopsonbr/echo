import axios from 'axios';

describe('Echo API', () => {
  const API_URL = process.env.API_URL || 'http://localhost:3000';

  describe('POST /api/echo', () => {
    it('should echo back the text with a timestamp', async () => {
      const testText = 'Hello, Echo!';
      const response = await axios.post(`${API_URL}/api/echo`, {
        text: testText,
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('echo', testText);
      expect(response.data).toHaveProperty('timestamp');
      
      // Verify timestamp is a valid ISO date string
      expect(() => new Date(response.data.timestamp)).not.toThrow();
    });

    it('should return 400 when text is missing', async () => {
      try {
        await axios.post(`${API_URL}/api/echo`, {});
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.response.status).toBe(400);
        expect(error.response.data).toHaveProperty('error');
      }
    });
  });
});
