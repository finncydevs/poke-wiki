<script setup>
import { ref, onMounted } from "vue";
import Navbar from "@/components/Navbar.vue";
import { useToast } from "vue-toastification";

const toast = useToast();
const caughtPokemon = ref([]);
const isLoading = ref(true);
const errorMessage = ref("");
const dialogRef = ref(null);
const selectedPokemon = ref(null);

// Fungsi untuk mengambil daftar Pokémon yang caught dari backend
const fetchCaughtPokemon = async () => {
  isLoading.value = true;
  errorMessage.value = "";
  try {
    const res = await fetch("https://nest-pokemon-production-c1f9.up.railway.app/pokemons/caught");
    if (!res.ok) throw new Error("Failed fetching caught Pokémon data");
    const data = await res.json();
    caughtPokemon.value = data;
  } catch (error) {
    errorMessage.value = error.message || "Error fetching caught Pokémon data.";
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchCaughtPokemon();
});

// Fungsi untuk memunculkan modal release
const confirmDelete = (pokemon) => {
  selectedPokemon.value = pokemon;
  dialogRef.value.showModal();
};

// Fungsi untuk me-release Pokémon (menghapus data di backend)
const deletePokemon = async () => {
  if (!selectedPokemon.value) return;
  try {
    const res = await fetch(
      `https://nest-pokemon-production-c1f9.up.railway.app/${selectedPokemon.value.pokeId}`,
      {
        method: "DELETE",
      }
    );
    if (!res.ok) throw new Error("Failed to release Pokémon");
    toast.success(`Released ${selectedPokemon.value.name}`);
    fetchCaughtPokemon();
    dialogRef.value.close();
  } catch (error) {
    toast.error(error.message || "Error releasing Pokémon");
  }
};
</script>

<template>
  <Navbar />
  <div id="backgr" class="p-6 min-h-screen">
    <h1 class="text-3xl font-bold text-center text-white">Captured Pokémon</h1>

    <div v-if="isLoading" class="mt-4 text-center text-white text-xl">
      Loading...
    </div>
    <div v-else-if="errorMessage" class="mt-4 text-center text-red-500 text-xl">
      {{ errorMessage }}
    </div>
    <div
      v-else-if="caughtPokemon.length === 0"
      class="mt-4 text-center text-white text-xl"
    >
      Sorry, you haven't caught any Pokémon yet.
    </div>
    <div
      v-else
      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6"
    >
      <div
        v-for="pokemon in caughtPokemon"
        :key="pokemon._id"
        class="bg-primary p-4 rounded-lg shadow-md text-center relative hover:ring-4 transition ease-in-out hover:-translate-y-2"
      >
        <img
          :src="pokemon.image"
          :alt="pokemon.name"
          class="w-32 h-32 mx-auto"
        />
        <h2 class="text-xl font-semibold mt-2 capitalize text-teks">
          {{ pokemon.name }}
        </h2>
        <p class="text-gray-400">Type: {{ pokemon.types.join(", ") }}</p>
        <p class="text-gray-400 text-xs mt-1">
          Caught at: {{ new Date(pokemon.caughtAt).toLocaleString() }}
        </p>
        <button
          @click="confirmDelete(pokemon)"
          class="absolute top-2 right-2 text-teks px-2 py-1 rounded"
        >
          ❌
        </button>
      </div>
    </div>
  </div>

  <dialog ref="dialogRef" class="modal">
    <div class="modal-box bg-slate-800">
      <h2 class="text-xl font-semibold text-red-500 mb-4">Release Pokemon</h2>
      <p class="text-teks">
        Release <strong>{{ selectedPokemon?.name }}</strong
        >?
      </p>
      <div class="modal-action">
        <button @click="deletePokemon" class="btn btn-error">Release</button>
        <button @click="dialogRef.close()" class="btn">No</button>
      </div>
    </div>
  </dialog>
</template>

<style>

</style>
