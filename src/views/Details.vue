<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute(); // Mengambil parameter ID dari URL
const pokemon = ref(null);

const fetchPokemonDetail = async () => {
  try {
    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${route.params.id}`
    );
    const data = await res.json();
    pokemon.value = {
      id: data.id,
      name: data.name,
      image: data.sprites.other["official-artwork"].front_default,
      types: data.types.map((t) => t.type.name).join(", "),
    };
  } catch (error) {
    console.error("Error fetching Pokémon detail:", error);
  }
};

onMounted(fetchPokemonDetail);
</script>

<template>
  <div v-if="pokemon" class="flex flex-col items-center p-6">
    <h1 class="text-3xl font-bold capitalize">{{ pokemon.name }}</h1>
    <img :src="pokemon.image" alt="Pokemon" class="w-64 h-64 object-contain" />
    <p class="text-lg text-gray-500">Type: {{ pokemon.types }}</p>
    <router-link to="/" class="mt-4 text-blue-500">Back to Home</router-link>
  </div>
</template>
