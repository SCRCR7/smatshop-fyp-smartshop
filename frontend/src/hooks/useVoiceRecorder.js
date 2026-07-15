import { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const useVoiceRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [aiResponse, setAiResponse] = useState(null);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const navigate = useNavigate();

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorderRef.current.onstop = async () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                chunksRef.current = []; // Reset chunks
                await processAudio(blob);
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setAiResponse(null); // Clear previous
        } catch (err) {
            console.error('Error accessing microphone:', err);
            alert('Could not access microphone. Please ensure permissions are granted.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setIsProcessing(true);

            // Stop all tracks to release mic
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    };

    const processAudio = async (audioBlob) => {
        try {
            const formData = new FormData();
            formData.append('audio', audioBlob, 'command.webm');

            // Send to Backend
            const { data } = await axios.post('/api/v1/voice/command', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            console.log('Gemini Response:', data);
            setAiResponse(data);

            // Auto-Navigate based on Intent
            if (data.redirect) {
                setTimeout(() => {
                    navigate(data.redirect);
                    setAiResponse(null); // Clear after nav
                    setIsProcessing(false);
                }, 1500); // Slight delay to read feedback
            } else if (data.intent === 'SEARCH' && data.products) {
                setTimeout(() => {
                    // Navigate to results page (Passing state via location or just URL params)
                    // For simplicity, we might just store results in Redux or navigate to a special results page
                    // But here, let's assume we navigate to search page with the query if available
                    if (data.products.length > 0) {
                        navigate(`/search/voice-results`, { state: { products: data.products, query: data.intent } });
                    } else {
                        // Fallback if no products but intent was search
                        navigate(`/search/generic`);
                    }
                    setIsProcessing(false);
                }, 1500);
            } else {
                setIsProcessing(false);
            }

        } catch (error) {
            console.error('Voice Processing Failed:', error);
            setAiResponse({ error: 'Sorry, I missed that. Please try again.' });
            setIsProcessing(false);
        }
    };

    return {
        isRecording,
        isProcessing,
        aiResponse,
        startRecording,
        stopRecording
    };
};

export default useVoiceRecorder;
