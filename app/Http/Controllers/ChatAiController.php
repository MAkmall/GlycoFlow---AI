<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log; // 💡 PENAMBAHAN BIAR ERROR LOG HILANG

class ChatAiController extends Controller
{
    public function sendToGemini(Request $request)
    {
        // 1. Validasi input
        $request->validate([
            'message' => 'required|string'
        ]);

        $userMessage = $request->input('message');

        // 2. Kumpulkan semua API Key dari file .env ke dalam Array
        $geminiKeys = [
            env('VITE_GEMINI_API_KEY'),
            env('GEMINI_KEY_BACKUP1'),
            env('GEMINI_KEY_BACKUP2'),
            env('GEMINI_KEY_BACKUP3'),
        ];

        // Saring jika ada key yang kosong di .env
        $geminiKeys = array_filter($geminiKeys);

        if (empty($geminiKeys)) {
            return response()->json(['reply' => 'Konfigurasi Error: Tidak ada API Key Gemini yang terdeteksi di .env.'], 500);
        }

        // 3. Lakukan perulangan (Looping) mencoba satu per satu key jika terjadi error
        foreach ($geminiKeys as $index => $apiKey) {
            try {
                $response = Http::post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}", [
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

                // Jika request sukses menggunakan key ini, langsung kembalikan jawaban ke React
                if ($response->successful()) {
                    $result = $response->json();
                    $aiReply = $result['candidates'][0]['content']['parts'][0]['text'] ?? 'Maaf, saya tidak dapat merumuskan jawaban.';
                    
                    return response()->json(['reply' => $aiReply]);
                }

                // Jika response tidak sukses (misal: 429 Too Many Requests / Kuota Habis),
                // abaikan dan biarkan loop berlanjut ke key cadangan berikutnya
                Log::warning("Gemini Key indeks ke-{$index} gagal merespons. Mencoba key berikutnya...");

            } catch (\Exception $e) {
                // Jika terjadi crash koneksi pada key ini, lanjut ke key berikutnya
                Log::error("Koneksi gagal pada Gemini Key indeks ke-{$index}: " . $e->getMessage());
            }
        }

        // 4. Jika seluruh key (Utama + 3 Cadangan) sudah dicoba dan semuanya gagal/habis kuota
        return response()->json(['reply' => 'Seluruh API Key Gemini (Utama & Cadangan) sedang sibuk atau kehabisan batas kuota harian.'], 500);
    }
}