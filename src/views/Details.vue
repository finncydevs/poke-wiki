<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import Navbar from "@/components/Navbar.vue";

const route = useRoute();
const pokemon = ref(null);
const isLoading = ref(true);
const errorMessage = ref("");
const activeTab = ref("about");
const isCatching = ref(false);
const caughtMessage = ref(null);
let capturedPokemon = JSON.parse(localStorage.getItem("pokemonList")) || [];

const fetchPokemonDetail = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${route.params.id}`
    );
    if (!res.ok) throw new Error("Gagal fetching data");
    const data = await res.json();
    const totalStats = data.stats.reduce(
      (sum, stat) => sum + stat.base_stat,
      0
    );
    const averageStats = totalStats / data.stats.length;

    pokemon.value = {
      id: data.id,
      name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
      image:
        data.sprites.other["official-artwork"].front_default || "/default.png",
      types: data.types.map((t) => t.type.name),
      height: `${data.height / 10} m`,
      weight: `${data.weight / 10} kg`,
      abilities: data.abilities.map((a) => a.ability.name),
      experience: data.base_experience,
      moves: data.moves,
      stats: data.stats,
      averageStats: averageStats.toFixed(2),
    };
  } catch (error) {
    errorMessage.value = "Error fetching Pokémon data.";
  } finally {
    isLoading.value = false;
  }
};

// Catch Pokemon logic
const catchPokemon = () => {
  if (!pokemon.value || isCatching.value) return;

  isCatching.value = true;
  caughtMessage.value = null;

  setTimeout(() => {
    const success = Math.random() > 0.5;
    if (success) {
      if (!capturedPokemon.some((p) => p.id === pokemon.value.id)) {
        const newPokemon = {
          id: pokemon.value.id,
          name: pokemon.value.name,
          types: pokemon.value.types,
          image: pokemon.value.image,
          uniqueId: Date.now(),
        };

        capturedPokemon.push(newPokemon);
        localStorage.setItem("pokemonList", JSON.stringify(capturedPokemon));
        window.dispatchEvent(new Event("storage")); // Notify Navbar of changes

        caughtMessage.value = { success: true, pokemon: newPokemon };
      } else {
        caughtMessage.value = { success: true, pokemon: pokemon.value };
      }
    } else {
      caughtMessage.value = { success: false };
    }
    isCatching.value = false;
  }, 2000);
};

const closeMessage = () => {
  caughtMessage.value = null;
};

watch(() => route.params.id, fetchPokemonDetail, { immediate: true });
</script>

<template>
  <Navbar />
  <div class="bg-black min-h-screen flex items-center justify-center p-4">
    <div
      v-if="isLoading"
      class="text-center text-lg font-semibold text-gray-300"
    >
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
        <img
          :src="pokemon.image"
          :alt="pokemon.name"
          class="w-64 h-64 hover:scale-125 transition ease-in-out"
        />
        <h1 class="text-3xl font-bold text-gray-500 mt-4">
          #{{ pokemon.id }} {{ pokemon.name }}
        </h1>
        <button
          :disabled="isCatching"
          @click="catchPokemon"
          class="btn mt-4 bg-red-500 font-semibold text-white py-2 px-5 rounded-lg shadow-md hover:bg-red-600 transition flex items-center gap-2"
          :class="{
            'bg-slate-400 animate-spin cursor-not-allowed': isCatching,
          }"
        >
          <img src="/icon.png" class="animate-bounce w-8 h-8" alt="" />
          Catch {{ pokemon.name }}
        </button>
      </div>

      <!-- Catch Result Modal -->
      <div
        v-if="caughtMessage"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn"
      >
        <div
          class="bg-slate-800 p-6 rounded-lg shadow-lg text-center w-96 relative"
        >
          <button
            @click="closeMessage"
            class="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
          >
            ✖
          </button>
          <div v-if="caughtMessage.success" class="animate-fadeIn">
            <h2 class="text-xl font-semibold text-green-600">
              Horeee dapet {{ caughtMessage.pokemon.name }}!
            </h2>
            <img
              :src="caughtMessage.pokemon.image"
              alt="Pokemon"
              class="w-32 mx-auto my-2"
            />
            <p class="text-gray-400">
              Type: {{ caughtMessage.pokemon.types.join(", ") }}
            </p>
            <h2 class="text-lg font-semibold text-slate-400">
              Avarage stats {{ pokemon.averageStats }}
            </h2>
          </div>
          <div v-else class="animate-fadeIn">
            <h2 class="text-xl font-semibold text-red-600">
              Pokémon mu kabur...
            </h2>
          </div>
          <button
            @click="closeMessage"
            class="mt-4 px-4 py-2 bg-red-400 rounded hover:bg-red-600 text-slate-800 font-semibold"
          >
            Close
          </button>
        </div>
      </div>

      <!-- Pokemon Info Tabs -->
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

        <!-- About -->
        <div v-if="activeTab === 'about'" class="mt-8 space-y-4">
          <p class="text-gray-400">
            <strong>Types:</strong>
            <span
              v-for="type in pokemon.types"
              :key="type"
              class="px-2 py-1 bg-sky-400 text-slate-800 rounded-full mx-1 text-sm capitalize"
              >{{ type }}</span
            >
          </p>
          <p class="text-gray-400">
            <strong>Height:</strong> {{ pokemon.height }}
          </p>
          <p class="text-gray-400">
            <strong>Weight:</strong> {{ pokemon.weight }}
          </p>
          <p class="text-gray-400">
            <strong>Abilities:</strong>
            <span
              v-for="ability in pokemon.abilities"
              :key="ability"
              class="px-2 py-1 text-slate-800 bg-yellow-400 rounded-full mx-1 text-sm capitalize"
              >{{ ability }}</span
            >
          </p>
          <p class="text-gray-400">
            <strong>Experience:</strong> {{ pokemon.experience }} Exp
          </p>
        </div>
        <div v-if="activeTab === 'moves'" class="mt-4">
          <div
            class="grid grid-cols-2 max-h-[300px] overflow-y-auto p-2 md:grid-cols-3 gap-4"
          >
            <span
              v-for="move in pokemon.moves"
              :key="move.move.name"
              class="bg-slate-900 rounded-md text-center text-gray-400 font-medium text-sm"
            >
              {{ move.move.name }}
            </span>
          </div>
        </div>
        <div v-if="activeTab === 'stats'" class="mt-4 space-y-2">
          <div v-for="stat in pokemon.stats" :key="stat.stat.name">
            <p class="text-gray-400 font-semibold">
              {{ stat.stat.name.toUpperCase() }}: {{ stat.base_stat }}
            </p>
            <div class="w-full bg-gray-700 rounded-full h-3">
              <div
                class="bg-yellow-400 h-3 rounded-full transition-all duration-300"
                :style="{ width: stat.base_stat + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
