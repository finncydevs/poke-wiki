<template>
  <div class="navbar absolute py-4 bg-base-100 px-6 w-full">
    <div class="flex items-center justify-between w-full">
      <router-link to="/" class="text-2xl font-bold">PokeWiki</router-link>

      <router-link to="/capture">
        <div class="flex items-center bg-slate-500 py-1 px-3 rounded-md">
          <span class="text-slate-900 font-semibold"
            >{{ caughtCount }} Captured</span
          >
          <img class="poke ml-2" src="/icon.png" alt="Pokeball Icon" />
        </div>
      </router-link>

      <img src="../assets/poke.png" class="w-[105px]" alt="pokemon" />
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
