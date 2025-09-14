"use client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import OAuthLogin from "../components/OAuthLogin";

export default function Home() {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-200 via-pink-100 to-yellow-100 relative overflow-hidden">
        {/* Animated background shapes */}
        <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
          <div className="absolute animate-pulse bg-purple-300 opacity-30 rounded-full w-96 h-96 -top-32 -left-32 blur-3xl" />
          <div className="absolute animate-pulse bg-pink-200 opacity-30 rounded-full w-80 h-80 top-40 right-0 blur-2xl" />
          <div className="absolute animate-pulse bg-yellow-200 opacity-20 rounded-full w-72 h-72 bottom-0 left-1/2 blur-2xl" />
        </div>
        <section className="relative z-10 w-full flex flex-col items-center">
          <div className="max-w-2xl w-full px-8 py-16 bg-white/90 rounded-3xl shadow-2xl border border-purple-100 flex flex-col items-center">
            <div className="mb-8 text-center">
              <div className="flex justify-center mb-4">
                <img src="/logo.png" alt="Amit CRM Logo" className="w-20 h-20 rounded-full shadow-lg border-4 border-purple-200 bg-white" />
              </div>
              <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 bg-clip-text text-transparent mb-2 drop-shadow-lg tracking-tight">Amit CRM</h1>
              <p className="text-lg text-gray-700 mb-2">Reimagine your customer relationships.</p>
              <p className="text-xl font-semibold text-purple-700 mb-4">AI-powered campaigns, segmentation, and analytics.</p>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold"><span>🤖</span> AI Messaging</span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold"><span>🎯</span> Smart Segments</span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold"><span>📊</span> Real-time Analytics</span>
              </div>
              <p className="text-gray-500">Manage, engage, and grow your business with a modern, intelligent CRM platform.</p>
            </div>
            <div className="w-full flex flex-col items-center gap-4">
              <OAuthLogin />
              <span className="text-xs text-gray-400">Sign in with Google to get started</span>
            </div>
          </div>
          <div className="mt-12 w-full flex flex-col items-center">
            <img src="/logo.png" alt="Amit CRM Illustration" className="w-96 rounded-xl shadow-lg border border-purple-100" />
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
              <div className="bg-white/80 rounded-xl p-6 shadow flex flex-col items-center">
                <span className="text-4xl mb-2">🤖</span>
                <span className="font-bold text-lg mb-1">AI Campaigns</span>
                <span className="text-gray-500 text-sm text-center">Generate personalized messages and campaigns with a single click.</span>
              </div>
              <div className="bg-white/80 rounded-xl p-6 shadow flex flex-col items-center">
                <span className="text-4xl mb-2">🎯</span>
                <span className="font-bold text-lg mb-1">Smart Segmentation</span>
                <span className="text-gray-500 text-sm text-center">Target the right customers using advanced segment rules.</span>
              </div>
              <div className="bg-white/80 rounded-xl p-6 shadow flex flex-col items-center">
                <span className="text-4xl mb-2">📊</span>
                <span className="font-bold text-lg mb-1">Live Analytics</span>
                <span className="text-gray-500 text-sm text-center">Track campaign performance and customer engagement in real time.</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </GoogleOAuthProvider>
  );
}
