<script setup lang="ts">
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  watch,
  watchEffect
} from "vue";

defineOptions({
  name: "AnimatedImageSlider"
});

type AniClass = {
  enter: string;
  leave: string;
};

interface IProps {
  label?: string;
  imgSrcList: string[];
  aniClass?: AniClass;
}

const props = withDefaults(defineProps<IProps>(), {
  label: "animate",
  imgSrcList: () => [],
  aniClass: () => ({
    enter: "animate__backInLeft",
    leave: "animate__fadeOut"
  })
});

let imgTimer: NodeJS.Timeout;

const currentImg = ref(0); // 当前播放到的图片
const remPreSrc = ref("");

const getAniActiveClass = computed(() => (ind: number) => {
  return currentImg.value === ind ? props.aniClass.enter : props.aniClass.leave;
});

const toggleNextPage = () => {
  remPreSrc.value = props.imgSrcList[currentImg.value];
  currentImg.value = (currentImg.value + 1) % props.imgSrcList.length;
};

watch(remPreSrc, async (newValue, oldValue) => {
  if (remPreSrc.value) {
    setTimeout(() => {
      remPreSrc.value = "";
    }, 500);
  }
});

onMounted(() => {
  imgTimer = setInterval(() => {
    toggleNextPage();
  }, 4000);
});

onUnmounted(() => {
  imgTimer && clearInterval(imgTimer);
});
</script>

<template>
  <div class="relative left-0 top-0 flex w-[260px] items-center md:w-[303px]">
    <img
      class="animate__animated absolute w-[260px] md:w-[303px]"
      :class="getAniActiveClass(ind)"
      v-for="(item, ind) in imgSrcList"
      v-show="currentImg === ind || remPreSrc === item"
      :src="item"
      :key="item"
      alt="welcome"
    />
  </div>
</template>

<style lang="scss" scoped></style>
