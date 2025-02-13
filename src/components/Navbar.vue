<template>
  <div class="navbar bg-primary absolute py-4 px-6 w-full">
    <div class="flex items-center justify-between w-full">
      <router-link to="/" class="text-2xl font-bold tet-teks"
        >PokeWiki</router-link
      >

      <router-link to="/capture">
        <div
          class="flex items-center bg-secondary py-1 lg:py-1 px-3 rounded-md"
        >
          <span class="text-teks font-semibold"
            >{{ caughtCount }} Captured</span
          >
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
import { RouterLink } from "vue-router";
const caughtCount = ref(0);

const updateCount = () => {
  const storedPokemon = JSON.parse(localStorage.getItem("pokemonList")) || [];
  caughtCount.value = storedPokemon.length;
};

onMounted(() => {
  updateCount();
  window.addEventListener("storage", updateCount);
});

onUnmounted(() => {
  window.removeEventListener("storage", updateCount);
});
</script>

<style>
.poke {
  width: 30px;
}
</style>
