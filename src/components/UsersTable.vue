<template>
    <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-4xl">
        <h1 class="text-2xl font-bold text-gray-800 mb-6 text-center">
            Users Table
        </h1>

        <div class="flex gap-4 mb-6 justify-center flex-wrap items-center">
            <select
                v-model="emailFilter"
                class="border border-gray-300 rounded p-2"
                @change="updateQuery"
            >
                <option value="">All Emails</option>
                <option
                    v-for="user in users"
                    :key="user.id"
                    :value="user.email"
                >
                    {{ user.email }}
                </option>
            </select>

            <input
                v-model="usernameFilter"
                type="text"
                placeholder="Filter by username"
                class="border border-gray-300 rounded p-2"
                @keypress="handleEnterKey"
            />

            <button
                @click="resetFilters"
                class="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-4 py-2 rounded shadow hover:scale-105 transition"
            >
                Show All
            </button>
        </div>

        <div class="overflow-x-auto">
            <table class="min-w-full border-collapse text-gray-700 rounded">
                <thead class="bg-gray-200">
                    <tr>
                        <th class="border p-3 text-left">Email</th>
                        <th class="border p-3 text-left">Name</th>
                        <th class="border p-3 text-left">Username</th>
                        <th class="border p-3 text-left">City</th>
                        <th class="border p-3 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="user in filteredUsers"
                        :key="user.id"
                        class="hover:bg-gray-100"
                    >
                        <td class="border p-3">{{ user.email }}</td>
                        <td class="border p-3">{{ user.name }}</td>
                        <td class="border p-3">{{ user.username }}</td>
                        <td class="border p-3">{{ user.address.city }}</td>
                        <td class="border p-3">
                            <button
                                @click="showUser(user)"
                                class="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition transform"
                            >
                                Show
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <UserModal
            v-if="selectedUser"
            :user="selectedUser"
            @close="selectedUser = null"
        />
    </div>
</template>

<script lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { User, State } from "../store";
import UserModal from "./UserModal.vue";

function useDebounce(fn: Function, delay = 400) {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
}

export default {
    components: { UserModal },
    setup() {
        const store = useStore<State>();
        const route = useRoute();
        const router = useRouter();

        const emailFilter = ref("");
        const usernameFilter = ref("");
        const selectedUser = ref<User | null>(null);

        onMounted(async () => {
            await store.dispatch("fetchUsers");
            emailFilter.value = (route.query.email as string) || "";
            usernameFilter.value = (route.query.username as string) || "";
        });

        const users = computed(() => store.state.users);

        const updateQuery = () => {
            const query: Record<string, string> = {};
            if (emailFilter.value) query.email = emailFilter.value;
            if (usernameFilter.value) query.username = usernameFilter.value;
            router.replace({ query });
        };

        const debouncedUpdateQuery = useDebounce(updateQuery, 400);
        watch(usernameFilter, debouncedUpdateQuery);

        watch(emailFilter, updateQuery);

        const handleEnterKey = (e: KeyboardEvent) => {
            if (
                e.key === "Enter" &&
                !emailFilter.value &&
                !usernameFilter.value
            ) {
                router.replace({ query: {} });
            }
        };

        const filteredUsers = computed(() =>
            users.value.filter(
                (user) =>
                    (!emailFilter.value || user.email === emailFilter.value) &&
                    (!usernameFilter.value ||
                        user.username
                            .toLowerCase()
                            .includes(usernameFilter.value.toLowerCase()))
            )
        );

        const showUser = (user: User) => {
            selectedUser.value = user;
        };

        const resetFilters = () => {
            emailFilter.value = "";
            usernameFilter.value = "";
            router.replace({ query: {} });
        };

        watch(
            () => route.query,
            (query) => {
                emailFilter.value = (query.email as string) || "";
                usernameFilter.value = (query.username as string) || "";
            }
        );

        return {
            emailFilter,
            usernameFilter,
            filteredUsers,
            showUser,
            selectedUser,
            users,
            handleEnterKey,
            resetFilters,
            updateQuery, 
        };
    },
};
</script>
