<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h2>{{ user.name }}</h2>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Username:</strong> {{ user.username }}</p>
      <p><strong>City:</strong> {{ user.address.city }}</p>
      <p><strong>Phone:</strong> {{ user.phone }}</p>
      <p><strong>Website:</strong> {{ user.website }}</p>
      <button class="close-btn" @click="$emit('close')">Close</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { User } from '../store';

export default defineComponent({
  props: {
    user: { type: Object as PropType<User>, required: true }
  },
  emits: ['close']
});
</script>

<style>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.3);
  animation: scaleUp 0.2s ease-out forwards;
}

@keyframes scaleUp {
  0% { transform: scale(0.9); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.close-btn {
  margin-top: 15px;
  width: 100%;
  padding: 8px;
  border: none;
  background: #e53e3e;
  color: white;
  font-weight: bold;
  border-radius: 6px;
  cursor: pointer;
}

.close-btn:hover {
  background: #c53030;
}
</style>
