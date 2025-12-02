<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex min-h-full items-center justify-center p-4 text-center"
        >
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
            >
              <DialogTitle
                as="h3"
                class="text-lg font-medium leading-6 text-gray-900 mb-4"
              >
                Kết nối Wallet
              </DialogTitle>

              <div class="space-y-4">
                <!-- MetaMask Option -->
                <button
                  @click="connectMetaMask"
                  :disabled="loading"
                  class="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <div class="flex items-center space-x-3">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
                      alt="MetaMask"
                      class="w-8 h-8"
                    />
                    <div class="text-left">
                      <div class="font-medium text-gray-900">MetaMask</div>
                      <div class="text-sm text-gray-500">
                        Kết nối với MetaMask wallet
                      </div>
                    </div>
                  </div>
                  <ChevronRightIcon class="w-5 h-5 text-gray-400" />
                </button>

                <!-- WalletConnect Option -->
                <button
                  @click="connectWalletConnect"
                  :disabled="loading"
                  class="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <div class="flex items-center space-x-3">
                    <div
                      class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"
                    >
                      <LinkIcon class="w-5 h-5 text-blue-600" />
                    </div>
                    <div class="text-left">
                      <div class="font-medium text-gray-900">WalletConnect</div>
                      <div class="text-sm text-gray-500">
                        Kết nối với các wallet khác
                      </div>
                    </div>
                  </div>
                  <ChevronRightIcon class="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <!-- Loading State -->
              <div
                v-if="loading"
                class="mt-4 flex items-center justify-center py-4"
              >
                <div class="w-6 h-6 spinner mr-3"></div>
                <span class="text-sm text-gray-600">Đang kết nối...</span>
              </div>

              <!-- Error State -->
              <div
                v-if="error"
                class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <div class="flex">
                  <ExclamationTriangleIcon class="w-5 h-5 text-red-400 mr-2" />
                  <div class="text-sm text-red-700">{{ error }}</div>
                </div>
              </div>

              <!-- Info -->
              <div
                class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <div class="flex">
                  <InformationCircleIcon
                    class="w-5 h-5 text-blue-400 mr-2 mt-0.5"
                  />
                  <div class="text-sm text-blue-700">
                    <div class="font-medium mb-1">Lưu ý:</div>
                    <ul class="text-xs space-y-1">
                      <li>• Đảm bảo bạn đang sử dụng Sepolia Testnet</li>
                      <li>• Cần có ít nhất 0.01 ETH để trả phí gas</li>
                      <li>• Wallet của bạn sẽ được kết nối an toàn</li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Close Button -->
              <div class="mt-6 flex justify-end">
                <button @click="closeModal" class="btn btn-outline">
                  Há»§y
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref } from "vue";
import { useWalletStore } from "@/stores/wallet";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import {
  ChevronRightIcon,
  LinkIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/vue/24/outline";

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

// Emits
const emit = defineEmits(["close"]);

const walletStore = useWalletStore();

// State
const loading = ref(false);
const error = ref("");

// Methods
const closeModal = () => {
  emit("close");
  error.value = "";
};

const connectMetaMask = async () => {
  try {
    loading.value = true;
    error.value = "";

    await walletStore.connect("metamask");
    closeModal();
  } catch (err) {
    error.value = err.message || "Lá»—i káº¿t ná»‘i MetaMask";
  } finally {
    loading.value = false;
  }
};

const connectWalletConnect = async () => {
  try {
    loading.value = true;
    error.value = "";

    await walletStore.connect("walletconnect");
    closeModal();
  } catch (err) {
    error.value = err.message || "Lá»—i káº¿t ná»‘i WalletConnect";
  } finally {
    loading.value = false;
  }
};
</script>
