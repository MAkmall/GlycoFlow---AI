<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChatAiController extends Controller
{
    public function sendToGemini(Request $request)
    {
        $request->validate([
            'message' => 'required|string'
        ]);

        $userMessage = $request->input('message');

        // Ambil kunci utama dari .env
        $apiKey = env('VITE_GEMINI_API_KEY');

        if (!$apiKey) {
            return response()->json(['reply' => 'Error: API Key VITE_GEMINI_API_KEY tidak ditemukan di file .env.'], 500);
        }

        try {
            // Menggunakan endpoint model paling stabil
            $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" . $apiKey;
            
            // 💡 PERBAIKAN UTAMA: Tambahkan withoutVerifying() untuk menghancurkan cURL Error 60
            $response = Http::withoutVerifying()
                ->withHeaders([
                    'Content-Type' => 'application/json',
                ])
                ->timeout(15)
                ->post($url, [
                    'contents' => [
                        [
                            'parts' => [
                                [
                                    'text' => "Anda adalah Asisten Klinis cerdas untuk aplikasi kesehatan bernama GlycoFlow AI. Jawablah pertanyaan pengguna berikut dengan edukatif, ramah, dan berbasis sains metabolik/medis secara ringkas: " . $userMessage
                                ]
                            ]
                        ]
                    ]
                ]);

            if ($response->successful()) {
                $result = $response->json();
                $aiReply = $result['candidates'][0]['content']['parts'][0]['text'] ?? null;
                
                if ($aiReply) {
                    return response()->json(['reply' => $aiReply]);
                }
            }

            $errorBody = $response->body();
            Log::error("Google Gemini API Gagal. Status: " . $response->status() . " | Body: " . $errorBody);
            return response()->json(['reply' => 'Google API Error: ' . $errorBody], 500);

        } catch (\Exception $e) {
            Log::error("Gagal terhubung ke Google Server: " . $e->getMessage());
            return response()->json(['reply' => 'Gagal terkoneksi ke Google: ' . $e->getMessage()], 500);
        }
    }
}