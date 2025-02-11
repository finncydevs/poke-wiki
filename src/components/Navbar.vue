<template>
  <div class="navbar absolute py-4 bg-base-100 px-6">
    <div class="flex items-center justify-between w-full">
      <a href="/" class="text-2xl font-bold">PokeWiki</a>

      <div class="flex items-center bg-slate-500 py-1 px-2 rounded-md">
        <p class="text-lg font-semibold text-slate-900">1 Catch</p>
        <img class="poke ml-2" src="/icon.png" alt="Pokeball Icon" />
      </div>

      <img src="../assets/poke.png" class="w-[105px]" alt="pokemon" />
    </div>
  </div>
</template>

<script setup></script>

<style>
.poke {
  width: 30px;
}
</style>
