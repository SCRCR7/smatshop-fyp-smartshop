import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { analyzeVoice, setStatus, setTranscript, resetAssistant } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';

export const useVoiceAssistant = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { status, assistantMessage, voiceResult } = useSelector(state => state.products);
    const [transcript, setLocalTranscript] = useState('');

    const recognitionRef = useRef(null);
    const silenceTimerRef = useRef(null);
    const transcriptRef = useRef(''); // always-current ref to avoid stale closure

    // TTS
    useEffect(() => {
        if (assistantMessage) {
            window.speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(assistantMessage);
            u.rate = 0.95;
            window.speechSynthesis.speak(u);
        }
    }, [assistantMessage]);

    // Handle result actions
    useEffect(() => {
        if (!voiceResult) return;
        if (voiceResult.intent === 'NAVIGATE' && voiceResult.redirect) {
            setTimeout(() => navigate(voiceResult.redirect), 600);
        }
        if (voiceResult.intent === 'CART_ACTION' && voiceResult.cartProduct) {
            dispatch(addToCart({ product: voiceResult.cartProduct, quantity: voiceResult.cartQty || 1 }));
        }
    }, [voiceResult]);

    const submitTranscript = (text) => {
        const final = (text || transcriptRef.current || '').trim();
        if (!final) return;
        recognitionRef.current?.stop();
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        dispatch(analyzeVoice(final));
    };

    const startListening = () => {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) {
            alert('Speech recognition not supported. Please use Google Chrome.');
            return;
        }

        setLocalTranscript('');
        transcriptRef.current = '';
        dispatch(resetAssistant());
        dispatch(setStatus('listening'));

        const recognition = new SR();
        recognition.continuous = false; // single utterance — more reliable
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
            let text = '';
            for (let i = 0; i < event.results.length; i++) {
                text += event.results[i][0].transcript;
            }
            transcriptRef.current = text;
            setLocalTranscript(text);
            dispatch(setTranscript(text));

            // If final result, submit immediately
            if (event.results[event.results.length - 1].isFinal) {
                if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
                silenceTimerRef.current = setTimeout(() => submitTranscript(text), 300);
            }
        };

        recognition.onend = () => {
            // If we have transcript but haven't submitted yet, submit now
            if (transcriptRef.current.trim() && status === 'listening') {
                submitTranscript(transcriptRef.current);
            }
        };

        recognition.onerror = (e) => {
            if (e.error === 'no-speech') {
                // restart if no speech detected
                recognition.start();
            } else {
                dispatch(setStatus('failed'));
            }
        };

        recognitionRef.current = recognition;
        recognition.start();
    };

    const stopListening = () => {
        recognitionRef.current?.stop();
        if (transcriptRef.current.trim()) {
            submitTranscript(transcriptRef.current);
        }
    };

    return { transcript, status, startListening, stopListening };
};
