<template>
  <div class="navbar bg-primary absolute py-4 px-6 w-full">
    <div class="flex items-center justify-between w-full">
      <router-link to="/" class="font-sans text-2xl font-bold tet-teks">
        PokeWiki
      </router-link>

      <router-link to="/capture">
        <div class="flex items-center bg-secondary py-1 lg:py-1 px-3 rounded-md">
          <span class="text-teks font-semibold">{{ caughtCount }} Captured</span>
          <img class="poke ml-2" src="/poke.png" alt="Pokeball Icon" />
        </div>
      </router-link>

      <a href="https://pokemon.com" target="_blank">
        <img src="../assets/poke.png" class="w-[105px]" alt="pokemon" />
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const caughtCount = ref(0);

async function fetchCaughtCount() {
  try {
    const res = await fetch("https://nest-pokemon-production-2036.up.railway.app/pokemons/caught/count");
    if (!res.ok) throw new Error("Failed to fetch caught count");
    const data = await res.json();
    caughtCount.value = data.caughtCount;
  } catch (error) {
    console.error("Error fetching caught count:", error);
  }
}

let intervalId;
onMounted(() => {
  fetchCaughtCount();
  intervalId = setInterval(fetchCaughtCount, 10000);
});
onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<style>
.poke {
  width: 30px;
}
</style>
