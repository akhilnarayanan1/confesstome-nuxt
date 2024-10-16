<template>
  <div>
      <div class="font-bold pointer-events-none text-center text-3xl md:text-4xl lg:text-5xl">
        Get anonymous messages and honest feedback about yourself.
      </div>
      <NuxtLink to="/login" class="btn btn-active mb-4" role="button" aria-pressed="true">Login</NuxtLink>
    <NuxtLink to="/signup" class="btn btn-primary btn-active" role="button" aria-pressed="true">Signup</NuxtLink>
      <div class="card bg-base-300 bg-opacity-30 shadow-xl m-4">
        <div class="card-body">
          <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <h2 class="card-title font-extrabold">🔗 Personal Link</h2>
              <p class="font-light">Create your personal feedback link where your friends write anonymous and honest feedback to you 🎭.</p>
            </div>
            <div>
              <h2 class="card-title font-extrabold">📣 Share Link</h2>
              <p class="font-light">Share your personalized link among your friends 👨‍👨.</p>
            </div>
            <div>
              <h2 class="card-title font-extrabold">👀 Read Feedback</h2>
              <p class="font-light">Read what people think about you. Its private 🤫 . </p>
            </div>
            <div>
              <h2 class="card-title font-extrabold">📰 Publish Feedback</h2>
              <p class="font-light">Publish your favorite feedbacks over any social media 📱</p>
            </div>
          </div>
        </div>
      </div>
      <div class="card m-4">
        <div class="card-body">
          <p>© ConfessTo.Me All rights reserved. 2024 Disclaimer : We are not resposible for any kind of loss, harassment, vulgar messages you receive while using ConfessTo.Me use this app at your own responsibility. Also, we request you to report those messages. This helps, us to learn more and stop futher</p>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">

</script>