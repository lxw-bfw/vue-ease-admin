<script setup lang="ts">
import { useUserStoreHook } from "@/store/modules/user";
import AnimatedImageSlider from "./components/AnimatedImageSlider.vue";

const wImgs = [
  "/images/welcome/w1.png",
  "/images/welcome/w2.png",
  "/images/welcome/w3.png"
];

defineOptions({
  name: "Welcome"
});

const useStore = useUserStoreHook();
</script>

<template>
  <div class="flex justify-center items-center h-[500px]">
    <AnimatedImageSlider :img-src-list="wImgs" />
    <div class="ml-12">
      <p
        v-motion
        class="font-medium text-4xl mb-4 dark:text-white"
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 80
          }
        }"
      >
        {{ useStore.nickname ? useStore.nickname : useStore.username }}
      </p>
      <p
        v-motion
        class="mb-4 text-gray-500"
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 160
          }
        }"
      >
        欢迎你，尊敬的管理员
      </p>
      <p
        v-motion
        class="mb-4 text-gray-500"
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 240
          }
        }"
      >
        今天也是元气满满的一天！
      </p>
    </div>
  </div>
</template>
