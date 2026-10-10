import React from 'react';

export default function Contact() {
  return (
    <section id="contact" className="text-center py-10 border-t border-white/30 mt-16">
      {/* 背景の写真に埋もれないよう、文字の後ろに半透明の帯を敷く */}
      <div className="inline-block bg-white/75 backdrop-blur-md px-6 py-3 rounded-2xl shadow-sm mb-8">
        <h3 className="text-xl font-bold mb-1 text-gray-900">Contact</h3>
        <p className="text-gray-700 text-sm font-medium">
          連絡やソースコードの確認は GitHub にお願いします。
        </p>
      </div>

      {/* アイコンリンクを横並びに配置 */}
      <div className="flex justify-center items-center gap-8">
        
        {/* 1. GitHub */}
        <a 
          href="https://github.com/onigiri860" 
          target="_blank" 
          rel="noreferrer"
          className="group flex flex-col items-center gap-2 text-gray-600 hover:text-sky-600 transition-colors"
        >
          <div className="p-3 bg-white rounded-full shadow-md border border-gray-200 group-hover:bg-sky-50 group-hover:border-sky-200 transition-all">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-xs font-mono font-bold">GitHub</span>
        </a>

        {/* 2. Email */}
        <a 
          href="mailto:yutanukiti@icloud.com"
          className="group flex flex-col items-center gap-2 text-gray-600 hover:text-sky-600 transition-colors"
        >
          <div className="p-3 bg-white rounded-full shadow-md border border-gray-200 group-hover:bg-sky-50 group-hover:border-sky-200 transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-xs font-mono font-bold">Email</span>
        </a>

      </div>

      <p className="inline-block text-gray-600 text-xs mt-12 bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full">© 2025 onigiri860</p>
    </section>
  );
}