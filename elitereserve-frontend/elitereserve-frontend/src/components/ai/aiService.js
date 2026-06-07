const AI_BASE_URL = 'http://localhost:8082/api/ai';

export const sendChatMessage = async (message, sessionId, token) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${AI_BASE_URL}/chat`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ message, sessionId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to connect to Elite Assistant Service');
    }

    return await response.json();
  } catch (error) {
    console.error('AI Service Error:', error);
    throw new Error('Connection error. Please ensure the Elite AI Subsystem is running.');
  }
};
