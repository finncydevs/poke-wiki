<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import Navbar from "@/components/Navbar.vue";

const route = useRoute(); 
const pokemon = ref(null);
const isLoading = ref(true);
const errorMessage = ref("");
const activeTab = ref("about");

const fetchPokemonDetail = async () => {
  try {
    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${route.params.id}`
    );
    if (!res.ok) throw new Error("Gagal fetching data");
    const data = await res.json();

    pokemon.value = {
      id: data.id,
      name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
      image: data.sprites.other["official-artwork"].front_default,
      types: data.types.map((t) => t.type.name), 
      height: `${data.height / 10} m`,
      weight: `${data.weight / 10} kg`,
      abilities: data.abilities.map((a) => a.ability.name), 
      experience: data.base_experience,
    };
  } catch (error) {
    errorMessage.value = "Error fetching Pokémon data.";
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchPokemonDetail);
</script>

<template>
  <Navbar />
  <div class="bg-black min-h-screen flex items-center justify-center p-4">
    <div v-if="isLoading" class="text-center text-lg font-semibold">
      Loading...
    </div>
    <div
      v-else-if="errorMessage"
      class="text-center text-red-500 font-semibold"
    >
      {{ errorMessage }}
    </div>

    <div
      v-else
      class="bg-gray-800 rounded-2xl shadow-lg p-6 max-w-3xl w-full flex flex-col md:flex-row"
    >
      <div class="flex flex-col items-center text-center md:w-1/2">
        <img :src="pokemon.image" :alt="pokemon.name" class="w-64 h-64" />
        <h1 class="text-3xl font-bold text-gray-500 mt-4">
          #{{ pokemon.id }} {{ pokemon.name }}
        </h1>
        <button
          class="mt-4 bg-red-500 font-semibold text-white py-2 px-5 rounded-lg shadow-md hover:bg-red-600 transition flex items-center gap-2"
        >
          <img src="/icon.png" class="animate-bounce w-8 h-8" alt="" />
          Catch {{ pokemon.name }}
        </button>
      </div>

      <!-- Pokémon Stats -->
      <div class="md:w-1/2 p-4">
        <div class="flex gap-2">
          <button
            @click="activeTab = 'about'"
            :class="activeTab === 'about' ? 'bg-yellow-400' : 'bg-gray-200'"
            class="px-3 rounded-md text-gray-900 font-semibold"
          >
            About
          </button>
          <button
            @click="activeTab = 'stats'"
            :class="activeTab === 'stats' ? 'bg-yellow-400' : 'bg-gray-200'"
            class="px-3 rounded-md text-gray-800"
          >
            Stats
          </button>
          <button
            @click="activeTab = 'moves'"
            :class="activeTab === 'moves' ? 'bg-yellow-400' : 'bg-gray-200'"
            class="px-3 py-1 rounded-md text-gray-800"
          >
            Moves
          </button>
        </div>

        <div v-if="activeTab === 'about'" class="mt-8 space-y-4">
          <p class="text-gray-400">
            <strong>Types:</strong>
            <span
              v-for="type in pokemon.types"
              :key="type"
              class="px-2 py-1 bg-sky-400 text-slate-800 rounded-full mx-1 text-sm capitalize"
            >
              {{ type }}
            </span>
          </p>
          <p class="text-gray-400">
            <strong>Height:</strong> {{ pokemon.height }}
          </p>
          <p class="text-gray-400">
            <strong>Weight:</strong> {{ pokemon.weight }}
          </p>
          <p class="text-slate-400">
            <strong>Abilities:</strong>
            <span
              v-for="ability in pokemon.abilities"
              :key="ability"
              class="px-2 py-1 text-slate-800 bg-yellow-400 rounded-full mx-1 text-sm capitalize"
            >
              {{ ability }}
            </span>
          </p>
          <p class="text-gray-400">
            <strong>Experience:</strong> {{ pokemon.experience }} Exp
          </p>
        </div>

        <div v-if="activeTab === 'stats'" class="mt-4">
          <p class="text-gray-700">Stats will be shown here...</p>
        </div>

        <div v-if="activeTab === 'moves'" class="mt-4">
          <p class="text-gray-700">Moves will be shown here...</p>
        </div>
      </div>
    </div>
  </div>
</template>
