<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";

const pokemonList = ref([]);
const showCount = ref(15);
const router = useRouter();
const query = ref("");

const fetchPokemon = async () => {
  try {
    const res = await fetch("http://localhost:5000/pokemons");
    if (!res.ok) throw new Error("Failed fetching data");

    const data = await res.json();
    pokemonList.value = data.map((pokemon) => ({
      id: pokemon.pokeId,
      name: pokemon.name,
      image: pokemon.image || "/default.png",
    }));
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

onMounted(fetchPokemon);

const showMore = () => {
  showCount.value += 5;
};

const filteredPokemon = computed(() => {
  return pokemonList.value
    .filter((pokemon) =>
      pokemon.name.toLowerCase().includes(query.value.toLowerCase())
    )
    .slice(0, showCount.value);
});
</script>

<template>
  <div class="flex flex-col md:flex-row items-center justify-center px-4 py-2">
    <input
      type="search"
      v-model="query"
      class="p-2 border-gray-800 text-gray-500 bg-primary border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 w-full md:w-1/3"
      placeholder="Search Pokémon..."
    />
  </div>

  <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
    <div
      @click="router.push(`/pokemon/${pokemon.id}`)"
      v-for="pokemon in filteredPokemon"
      :key="pokemon.id"
      class="relative bg-primary hover:ring-4 transition ease-in-out hover:-translate-y-2 shadow-lg rounded-xl p-4 flex flex-col items-center"
    >
      <div class="text-teks text-sm font-semibold">
        #{{ pokemon.id.toString().padStart(4, "0") }}
      </div>

      <img
        src="/backPoke.png"
        alt="Background"
        class="absolute inset-0 w-full h-full object-contain opacity-50 pointer-events-none"
      />

      <img
        :src="pokemon.image"
        :alt="pokemon.name"
        class="relative w-64 h-64 object-contain z-10"
      />

      <h1 class="text-xl font-bold z-40 text-teks mt-2 capitalize">
        {{ pokemon.name }}
      </h1>
    </div>
  </section>

  <footer class="flex flex-col items-center justify-center py-4">
    <button
      @click="showMore"
      :disabled="showCount >= pokemonList.length"
      class="bg-secondary rounded-lg py-2 px-4 text-xl font-semibold text-teks hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Show more..
    </button>
    <p class="mt-2 text-gray-600">
      Made by Jindan AKA Finn with
      <a class="text-green-600" target="_blank" href="https://vuejs.org/"
        >VueJS</a
      >
      and
      <a class="text-blue-600" target="_blank" href="https://tailwindcss.com"
        >Tailwindcss</a
      >
    </p>
  </footer>
</template>
