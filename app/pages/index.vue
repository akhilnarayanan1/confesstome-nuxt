<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white relative overflow-hidden">
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style="animation-delay: 2s;"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style="animation-delay: 4s;"></div>
    </div>

    <!-- Hero Section -->
    <section class="relative z-10">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div class="text-center max-w-5xl mx-auto">
          <h1 class="text-5xl sm:text-6xl lg:text-8xl font-black tracking-tight mb-8">
            🎭 Get Anonymous 
            <br>
            <span class="bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 bg-clip-text text-transparent animate-pulse">
              Confessions! 
            </span>
            🤫
          </h1>
          <p class="text-xl sm:text-2xl max-w-4xl mx-auto mb-12 leading-relaxed font-medium">
            🔥 The hottest way to get brutally honest feedback from your friends! 
            No lies, no filters, just pure truth bombs! 💣✨
          </p>
          <div class="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-lg mx-auto">
            <NuxtLink 
              to="/signup" 
              class="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-black py-4 px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-110 shadow-2xl hover:shadow-pink-500/50 animate-pulse"
            >
              🚀 Start the Drama!
            </NuxtLink>
            <NuxtLink 
              to="/login" 
              class="w-full sm:w-auto bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-bold py-4 px-10 rounded-full text-lg border-2 border-white/50 hover:border-white transition-all duration-300 transform hover:scale-105"
            >
              👋 I'm Back!
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 relative z-10">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-20">
          <h2 class="text-4xl sm:text-6xl font-black mb-6">
            🔥 How The Magic ✨ <span class="text-yellow-300">Works!</span>
          </h2>
          <p class="text-xl text-white/90 max-w-3xl mx-auto font-medium">
            It's stupid simple! Get ready for some spicy truth! 🌶️🔥
          </p>
        </div>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:rotate-1">
            <div class="text-6xl mb-6">🔗</div>
            <h3 class="text-2xl font-black mb-4 text-yellow-300">Create & Share! 📱</h3>
            <p class="text-white/90 leading-relaxed font-medium">Generate your spicy link and blast it everywhere! Instagram, TikTok, Snapchat - go wild! 🎉</p>
          </div>

          <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:-rotate-1">
            <div class="text-6xl mb-6">👀</div>
            <h3 class="text-2xl font-black mb-4 text-pink-300">Read The Tea! ☕</h3>
            <p class="text-white/90 leading-relaxed font-medium">Dive into your secret dashboard and read all the juicy confessions! Prepare for shock! 😱</p>
          </div>

          <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:rotate-1">
            <div class="text-6xl mb-6">💬</div>
            <h3 class="text-2xl font-black mb-4 text-purple-300">Reply Secretly! 🤐</h3>
            <p class="text-white/90 leading-relaxed font-medium">Start anonymous chats and keep the mystery alive! Who said what? Nobody knows! 🕵️</p>
          </div>

          <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:-rotate-1">
            <div class="text-6xl mb-6">📸</div>
            <h3 class="text-2xl font-black mb-4 text-orange-300">Share The Flex! 💪</h3>
            <p class="text-white/90 leading-relaxed font-medium">Post your favorite compliments on your story and make everyone jealous! 😎✨</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Fun Stats Section -->
    <section class="py-16 relative z-10">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div class="text-4xl font-black text-yellow-300 mb-2">😱</div>
              <div class="text-white/80 font-medium">Mind Blown</div>
            </div>
            <div>
              <div class="text-4xl font-black text-pink-300 mb-2">🔒</div>
              <div class="text-white/80 font-medium">Super Secret</div>
            </div>
            <div>
              <div class="text-4xl font-black text-purple-300 mb-2">⚡</div>
              <div class="text-white/80 font-medium">Lightning Fast</div>
            </div>
            <div>
              <div class="text-4xl font-black text-orange-300 mb-2">🎉</div>
              <div class="text-white/80 font-medium">Pure Fun</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-black/20 backdrop-blur-lg border-t border-white/20 py-12 relative z-10">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <div class="text-3xl font-black bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-6">
            ✨ ConfessTo.Me ✨
          </div>
          <div class="text-sm text-white/70 max-w-4xl mx-auto leading-relaxed space-y-3 font-medium">
            <p>© 2024 ConfessTo.Me. All rights reserved. 🔥💯</p>
            <p class="text-xs">
              <strong>⚠️ Real Talk:</strong> This platform is for fun but be responsible! 
              Report any mean stuff so we can keep the vibes positive! 🌟💖
            </p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">

</script>