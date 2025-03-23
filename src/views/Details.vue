<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import Navbar from "@/components/Navbar.vue";
import { useToast } from "vue-toastification";

const toast = useToast();
const route = useRoute();
const pokemon = ref(null);
const isLoading = ref(true);
const errorMessage = ref("");
const activeTab = ref("about");
const isCatching = ref(false);
const caughtMessage = ref(null);

const capitalize = (text) =>
  text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

// Fungsi untuk fetch data Pokémon dari backend
const fetchPokemonDetail = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    console.log(route.params.id);
    const res = await fetch(
      `https://nest-pokemon-mongo.up.railway.app/pokemons/${route.params.id}`
    );
    if (!res.ok) throw new Error("Gagal fetching data");
    const data = await res.json();
    const totalStats = data.stats.reduce(
      (sum, stat) => sum + stat.base_stat,
      0
    );
    const averageStats = (totalStats / data.stats.length).toFixed(2);

    // Siapkan objek Pokémon sesuai response backend
    pokemon.value = {
      id: data.pokeId, // pastikan di backend field-nya bernama 'pokeId'
      name: capitalize(data.name),
      image: data.image || "/default.png",
      types: data.types, // misalnya array string: ["grass", "poison"]
      height: data.height, // misalnya "0.7m"
      weight: data.weight, // misalnya "6.9kg"
      abilities: data.abilities, // misalnya array string
      experience: data.experience,
      moves: data.moves, // misalnya array objek { move: { name: "razor-wind" } }
      stats: data.stats, // misalnya array objek dengan base_stat dan stat.name
      averageStats,
      caught: data.caught,
      caughtAt: data.caughtAt,
    };

    // Simpan data response di localStorage
    localStorage.setItem("pokemonDetail", JSON.stringify(pokemon.value));
  } catch (error) {
    errorMessage.value = "Error fetching Pokémon data.";
  } finally {
    isLoading.value = false;
  }
};

// Catch Pokemon logic
const catchPokemon = async () => {
  if (!pokemon.value || isCatching.value || pokemon.value.caught) return;

  isCatching.value = true;
  caughtMessage.value = null;

  setTimeout(async () => {
    const success = Math.random() > 0.5;

    if (success) {
      try {
        const res = await fetch(
          `https://nest-pokemon-mongo.up.railway.app/pokemons/${route.params.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              caught: true,
              caughtAt: new Date().toISOString(),
            }),
          }
        );

        if (!res.ok) throw new Error("Failed updating Pokémon status");

        pokemon.value.caught = true;
        caughtMessage.value = { success: true, pokemon: pokemon.value };
        toast.success(`You caught ${pokemon.value.name}!`);
      } catch (error) {
        toast.error("Failed to update Pokémon status.");
      }
    } else {
      caughtMessage.value = { success: false };
      toast.error("It escaped!");
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
  <div id="backgr" class="min-h-screen flex items-center justify-center p-4">
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
      class="bg-primary rounded-2xl shadow-lg p-6 max-w-3xl w-full flex flex-col md:flex-row"
    >
      <!-- Bagian Detail Pokémon -->
      <div class="flex flex-col items-center text-center md:w-1/2">
        <img
          :src="pokemon.image"
          :alt="pokemon.name"
          class="w-64 h-64 hover:scale-125 transition ease-in-out"
        />
        <h1 class="text-3xl font-bold text-teks mt-4">
          #{{ pokemon.id }} {{ pokemon.name }}
        </h1>
        <button
          :disabled="isCatching"
          @click="catchPokemon"
          class="btn mt-4 font-bold text-teks py-2 px-5 rounded-lg shadow-md transition flex items-center gap-2"
          :class="{
            'bg-green-700 hover:bg-green-800': pokemon.caught,
            'bg-blue-600 hover:bg-blue-700': !pokemon.caught,
            'cursor-not-allowed ': isCatching,
          }"
        >
          {{
            isCatching
              ? "Catching..."
              : pokemon.caught
              ? `You already caught ${pokemon.name}`
              : `Catch ${pokemon.name}`
          }}
        </button>
      </div>

      <!-- Bagian Info Pokémon -->
      <div class="md:w-1/2 p-4">
        <div class="flex gap-2">
          <button
            @click="activeTab = 'about'"
            :class="activeTab === 'about' ? 'bg-blue-600' : 'bg-secondary'"
            class="px-3 rounded-md text-teks font-semibold"
          >
            About
          </button>
          <button
            @click="activeTab = 'stats'"
            :class="activeTab === 'stats' ? 'bg-blue-600' : 'bg-secondary'"
            class="px-3 rounded-md text-teks font-semibold"
          >
            Stats
          </button>
          <button
            @click="activeTab = 'moves'"
            :class="activeTab === 'moves' ? 'bg-blue-600' : 'bg-secondary'"
            class="px-3 py-1 rounded-md text-teks font-semibold"
          >
            Moves
          </button>
        </div>

        <!-- Tab About -->
        <div v-if="activeTab === 'about'" class="mt-8 space-y-4">
          <p class="text-teks">
            <strong>Types:</strong>
            <span
              v-for="type in pokemon.types"
              :key="type"
              class="px-2 py-1 bg-blue-600 text-teks rounded-full mx-1 text-sm capitalize"
              >{{ type }}</span
            >
          </p>
          <p class="text-teks"><strong>Height:</strong> {{ pokemon.height }}</p>
          <p class="text-teks"><strong>Weight:</strong> {{ pokemon.weight }}</p>
          <p class="text-teks">
            <strong>Abilities:</strong> {{ pokemon.abilities.join(", ") }}
          </p>
          <p class="text-teks">
            <strong>Experience:</strong> {{ pokemon.experience }} Exp
          </p>
        </div>

        <!-- Tab Moves -->
        <div v-if="activeTab === 'moves'" class="mt-4 space-y-4">
          <div
            class="grid grid-cols-2 max-h-[300px] overflow-y-auto p-2 md:grid-cols-3 gap-4"
          >
            <span
              v-for="move in pokemon.moves"
              :key="move.move.name"
              class="bg-secondary rounded-md text-center text-teks font-medium text-sm"
            >
              {{ move.move.name }}
            </span>
          </div>
        </div>

        <!-- Tab Stats -->
        <div v-if="activeTab === 'stats'" class="mt-4 space-y-2">
          <div v-for="stat in pokemon.stats" :key="stat.stat.name">
            <p class="text-teks font-semibold">
              {{ stat.stat.name.toUpperCase() }}: {{ stat.base_stat }}
            </p>
            <div class="w-full bg-secondary rounded-full h-3">
              <div
                class="bg-blue-600 h-3 rounded-full transition-all duration-300"
                :style="{ width: `clamp(0%, ${stat.base_stat}%, 100%)` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
#backgr {
  background-image: linear-gradient(
    151deg,
    #1a1e29 11.11%,
    #020713 11.11%,
    #020713 50%,
    #1a1e29 50%,
    #1a1e29 61.11%,
    #020713 61.11%,
    #020713 100%
  );
  background-size: 18.56px 10.29px;
}
</style>
