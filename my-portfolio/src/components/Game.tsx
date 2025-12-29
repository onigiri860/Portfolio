import React from 'react';
import Image from 'next/image';

export default function Game() {
  return (
    <section className="bg-white/80 p-8 rounded-3xl border border-white/60 backdrop-blur-md shadow-lg">
      
      <h3 className="text-2xl font-bold mb-6 text-orange-500 flex items-center gap-2">
        Game
      </h3>
      
      <div className="space-y-12">
        
        {/* --- 文章部分 --- */}
        <div>
          <h4 className="text-xl font-bold text-gray-900 mb-4"></h4>
          <p className="text-gray-700 leading-relaxed mb-6 font-medium">
            最近イナイレ熱がやべぇ<br />
            あと、FPSもやってた<br /><br />
            
          </p>

        </div>

      </div>
    </section>
  );
}