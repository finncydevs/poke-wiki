<script setup>
import { ref, onMounted } from "vue";
import Navbar from "@/components/Navbar.vue";

const capturedPokemon = ref([]);
const showConfirmDialog = ref(false);
const selectedPokemon = ref(null);
const dialogRef = ref(null); // Reference for the modal

onMounted(() => {
  capturedPokemon.value = JSON.parse(localStorage.getItem("pokemonList")) || [];
});

const deletePokemon = () => {
  if (!selectedPokemon.value) return;
  capturedPokemon.value = capturedPokemon.value.filter(
    (pokemon) => pokemon.uniqueId !== selectedPokemon.value.uniqueId
  );
  localStorage.setItem("pokemonList", JSON.stringify(capturedPokemon.value));
  dialogRef.value.close();
};

const confirmDelete = (pokemon) => {
  selectedPokemon.value = pokemon;
  dialogRef.value.showModal();
};
</script>

<template>
  <Navbar />
  <div class="p-6">
    <h1 class="text-3xl font-bold text-center text-white">Captured Pokémon</h1>

    <div
      v-if="capturedPokemon.length === 0"
      class="mt-4 text-gray-500 text-center"
    >
      kamu belum menangkap pokemon
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6 ">
      <div
        v-for="pokemon in capturedPokemon"
        :key="pokemon.uniqueId"
        class="bg-gray-800 p-4 rounded-lg shadow-md text-center relative  hover:ring-4 transition ease-in-out hover:-translate-y-2"
      >
        <img
          :src="pokemon.image"
          :alt="pokemon.name"
          class="w-32 h-32 mx-auto"
        />
        <h2 class="text-xl font-semibold mt-2 capitalize text-white">
          {{ pokemon.name }}
        </h2>
        <p class="text-gray-400">Type: {{ pokemon.types.join(", ") }}</p>

        <button
          @click="confirmDelete(pokemon)"
          class="absolute top-2 right-2 text-white px-2 py-1 rounded"
        >
          ❌
        </button>
      </div>
    </div>
  </div>

  <!-- DaisyUI Modal -->
  <dialog ref="dialogRef" class="modal">
    <div class="modal-box">
      <h2 class="text-xl font-semibold text-red-500 mb-4">Lepaskan Pokémon</h2>
      <p class="text-gray-500">
        Lepaskan <strong>{{ selectedPokemon?.name }}</strong
        >?
      </p>
      <div class="modal-action">
        <button @click="deletePokemon" class="btn btn-error">Lepaskan</button>
        <button @click="dialogRef.close()" class="btn">Tidak</button>
      </div>
    </div>
  </dialog>
</template>
