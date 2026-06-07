import AiChatWidget from '../components/ai/AiChatWidget';

const AIAssistant = () => {
  const token = localStorage.getItem('accessToken');
  return <AiChatWidget token={token} />;
};

export default AIAssistant;