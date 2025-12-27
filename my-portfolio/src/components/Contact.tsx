import React from 'react';

export default function Contact() {
  return (
    <section id="contact" className="text-center py-10 border-t border-gray-800 mt-16">
      <h3 className="text-xl font-bold mb-4 text-white">Contact</h3>
      
      <p className="text-gray-400 mb-8 text-sm">
        連絡やソースコードの確認は GitHub にお願いします。
      </p>

      {/* アイコンリンクを横並びに配置 */}
      <div className="flex justify-center items-center gap-8">
        
        {/* 1. GitHub */}
        <a 
          href="https://github.com/onigiri860" 
          target="_blank" 
          rel="noreferrer"
          className="group flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <div className="p-3 bg-gray-800 rounded-full group-hover:bg-gray-700 transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-xs font-mono">GitHub</span>
        </a>

        {/* 2. X (Twitter) */}
        <a 
          href="https://x.com/onigiri860" // ★あなたのXのURLに変更してください
          target="_blank" 
          rel="noreferrer"
          className="group flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <div className="p-3 bg-gray-800 rounded-full group-hover:bg-gray-700 transition-colors">
            {/* X Logo SVG */}
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>
          <span className="text-xs font-mono">X / Twitter</span>
        </a>

        {/* 3. Email */}
        <a 
          href="mailto:yutanukiti@icloud.com" // ★あなたのメールアドレスに変更してください
          className="group flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <div className="p-3 bg-gray-800 rounded-full group-hover:bg-gray-700 transition-colors">
            {/* Mail Icon SVG */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-xs font-mono">Email</span>
        </a>

      </div>

      <p className="text-gray-600 text-xs mt-12">© 2025 onigiri860</p>
    </section>
  );
}