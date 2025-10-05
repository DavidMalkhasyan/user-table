<template>
  <div
    class="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-md p-4 rounded-xl flex flex-wrap items-center justify-between gap-4"
  >
    <div class="flex gap-3 flex-wrap">
      <select
        v-model="emailFilter"
        class="border border-gray-300 rounded-lg p-2"
      >
        <option value="">All Emails</option>
        <option v-for="user in users" :key="user.id" :value="user.email">
          {{ user.email }}
        </option>
      </select>

      <input
        v-model="searchTerm"
        type="text"
        placeholder="Search username..."
        class="border border-gray-300 rounded-lg p-2"
      />
    </div>

    <button
      @click="$emit('export')"
      class="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition transform"
    >
      Export CSV
    </button>
  </div>
</template>

<script lang="ts">
import { ref, watch, defineComponent } from 'vue';
import { User } from '../store';

export default defineComponent({
  props: {
    users: { type: Array as () => User[], required: true },
    emailFilter: { type: String, required: true },
  },
  emits: ['update:emailFilter', 'update:usernameFilter', 'export'],
  setup(props, { emit }) {
    const searchTerm = ref('');
    let debounceTimer: number | null = null;

    watch(searchTerm, (val) => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(() => {
        emit('update:usernameFilter', val);
      }, 500);
    });

    watch(
      () => props.emailFilter,
      (val) => emit('update:emailFilter', val)
    );

    return { searchTerm };
  },
});
</script>
