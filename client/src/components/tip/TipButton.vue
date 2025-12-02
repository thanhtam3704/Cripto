<template>
  <div class="relative">
    <!-- Tip Button -->
    <button
      @click="showTipModal = true"
      :disabled="!canTip"
      class="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <CurrencyDollarIcon class="w-5 h-5" />
      <span class="font-medium">Tip</span>
      <span
        v-if="quickTipAmount"
        class="text-xs bg-white bg-opacity-20 px-2 py-0.5 rounded-full"
      >
        {{ quickTipAmount }} TIP
      </span>
    </button>

    <!-- Tip Modal -->
    <TipModal
      v-if="showTipModal"
      :video="video"
      :article-id="articleId"
      :author-id="authorId"
      :author-name="authorName"
      :blogger="blogger"
      @close="showTipModal = false"
      @tip-sent="onTipSent"
    />

    <!-- Quick Tip Options (Hover) -->
    <div
      v-if="showQuickTips && canTip"
      class="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-50"
      @mouseenter="quickTipHover = true"
      @mouseleave="quickTipHover = false"
    >
      <div class="flex space-x-2">
        <button
          v-for="amount in quickTipAmounts"
          :key="amount"
          @click="handleQuickTip(amount)"
          :disabled="tipping"
          class="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm rounded-md hover:from-yellow-500 hover:to-orange-600 transition-all disabled:opacity-50"
        >
          {{ amount }}
        </button>
      </div>
      <div class="text-xs text-gray-500 text-center mt-1">Tip nhanh</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useWalletStore } from "@/stores/wallet";
import { useTipStore } from "@/stores/tip";
import { useToast } from "vue-toastification";
import TipModal from "@/components/tip/TipModal.vue";
import { CurrencyDollarIcon } from "@heroicons/vue/24/outline";

// Props
const props = defineProps({
  // Legacy video prop (kept for backward compatibility)
  video: {
    type: Object,
    default: null,
  },
  // New article prop
  articleId: {
    type: String,
    default: null,
  },
  authorId: {
    type: String,
    default: null,
  },
  authorName: {
    type: String,
    default: "",
  },
  // Legacy blogger prop (kept for backward compatibility)
  blogger: {
    type: Object,
    default: null,
  },
  quickTipAmount: {
    type: Number,
    default: null,
  },
});

// Emits
const emit = defineEmits(["tip-sent"]);

// Stores
const authStore = useAuthStore();
const walletStore = useWalletStore();
const tipStore = useTipStore();
const toast = useToast();

// State
const showTipModal = ref(false);
const showQuickTips = ref(false);
const quickTipHover = ref(false);
const tipping = ref(false);
const quickTipAmounts = ref([1, 5, 10, 25]);

// Computed
const canTip = computed(() => {
  const targetAuthorId = props.authorId || props.blogger?.id;
  return (
    authStore.isAuthenticated &&
    walletStore.isConnected &&
    authStore.user?.id !== targetAuthorId &&
    parseFloat(walletStore.balance) > 0
  );
});

// Methods
const handleQuickTip = async (amount) => {
  if (!canTip.value) {
    if (!authStore.isAuthenticated) {
      toast.error("Vui lòng đăng nhập để tip");
    } else if (!walletStore.isConnected) {
      toast.error("Vui lòng kết nối ví để tip");
    } else if (parseFloat(walletStore.balance) < amount) {
      toast.error("Số dư không đủ để tip");
    }
    return;
  }

  try {
    tipping.value = true;

    // Support both article and video (legacy)
    const tipData = {
      articleId: props.articleId || null,
      videoId: props.video?.id || null,
      authorId: props.authorId || props.blogger?.id,
      amount: amount,
      message: `Quick tip ${amount} TIP`,
      fromAddress: walletStore.address,
      toAddress: props.blogger?.walletAddress || null,
    };

    const result = await tipStore.sendTip(tipData);

    if (result.success) {
      emit("tip-sent", {
        ...tipData,
        transactionHash: result.transactionHash,
      });

      // Update wallet balance
      await walletStore.updateBalances();

      toast.success(`Đã gửi ${amount} TIP thành công!`);
      showQuickTips.value = false;
    } else {
      throw new Error(result.error || "Gửi tip thất bại");
    }
  } catch (error) {
    console.error("Quick tip error:", error);
    toast.error(error.message || "Có lỗi xảy ra khi gửi tip");
  } finally {
    tipping.value = false;
  }
};

const onTipSent = (tipData) => {
  showTipModal.value = false;
  emit("tip-sent", tipData);
};

// Show quick tips on hover
let hoverTimeout;
const handleMouseEnter = () => {
  if (canTip.value && !props.quickTipAmount) {
    hoverTimeout = setTimeout(() => {
      showQuickTips.value = true;
    }, 500);
  }
};

const handleMouseLeave = () => {
  clearTimeout(hoverTimeout);
  if (!quickTipHover.value) {
    showQuickTips.value = false;
  }
};

onMounted(() => {
  // Add event listeners for hover effect
  const button = document.querySelector(".tip-button");
  if (button) {
    button.addEventListener("mouseenter", handleMouseEnter);
    button.addEventListener("mouseleave", handleMouseLeave);
  }
});

onUnmounted(() => {
  const button = document.querySelector(".tip-button");
  if (button) {
    button.removeEventListener("mouseenter", handleMouseEnter);
    button.removeEventListener("mouseleave", handleMouseLeave);
  }
});
</script>

<style scoped>
.tip-button {
  position: relative;
}
</style>
