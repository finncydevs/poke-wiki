<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const pokemonList = ref([]);
const showCount = ref(15);
const totalPokemon = ref(50); // Set dynamically if needed
const router = useRouter();

const fetchPokemon = async () => {
  try {
    const promises = Array.from({ length: totalPokemon.value }, (_, i) =>
      fetch(`https://pokeapi.co/api/v2/pokemon/${i + 1}`).then((res) =>
        res.json()
      )
    );

    const results = await Promise.allSettled(promises);
    pokemonList.value = results
      .filter((result) => result.status === "fulfilled")
      .map((result) => ({
        id: result.value.id,
        name: result.value.name,
        image: result.value.sprites.other["official-artwork"].front_default,
      }));
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

onMounted(fetchPokemon);

const showMore = () => {
  if (showCount.value < totalPokemon.value) {
    showCount.value += 5;
  }
};
</script>

<template>
  <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
    <div
      @click="router.push(`/pokemon/${pokemon.id}`)"
      v-for="pokemon in pokemonList.slice(0, showCount)"
      :key="pokemon.id"
      class="bg-gray-800 hover:ring-4 transition ease-in-out hover:-translate-y-2 shadow-lg rounded-xl p-4 flex flex-col items-center"
    >
      <div class="text-gray-500 text-sm font-semibold">#000{{ pokemon.id }}</div>
      <img
        :src="pokemon.image"
        alt="Pokemon"
        class="w-64 h-64 object-contain"
      />
      <h1 class="text-xl font-bold text-slate-300 mt-2 capitalize">
        {{ pokemon.name }}
      </h1>
    </div>
  </section>

  <footer class="flex flex-col items-center justify-center py-4">
    <button
      @click="showMore"
      :disabled="showCount >= totalPokemon"
      class="bg-gray-400 rounded-lg py-2 px-4 text-xl font-semibold text-slate-900 hover:bg-gray-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Show more..
    </button>
    <p class="mt-2 text-gray-600">All right is alright</p>
  </footer>
</template>
