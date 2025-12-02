<template>
  <div class="rich-text-editor">
    <div
      class="editor-toolbar bg-gray-100 border border-gray-300 rounded-t-lg p-2 flex flex-wrap gap-2"
    >
      <button
        v-for="action in toolbarActions"
        :key="action.command"
        type="button"
        @click="execCommand(action.command, action.value)"
        :title="action.title"
        class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
      >
        <span v-html="action.icon"></span>
      </button>
    </div>

    <div
      ref="editorRef"
      class="editor-content min-h-[400px] p-4 border border-gray-300 border-t-0 rounded-b-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
      contenteditable="true"
      @input="onInput"
      @paste="onPaste"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const editorRef = ref(null);

const toolbarActions = [
  { command: "bold", icon: "<b>B</b>", title: "In đậm (Ctrl+B)" },
  { command: "italic", icon: "<i>I</i>", title: "In nghiêng (Ctrl+I)" },
  { command: "underline", icon: "<u>U</u>", title: "Gạch chân (Ctrl+U)" },
  { command: "strikeThrough", icon: "<s>S</s>", title: "Gạch ngang" },
  { command: "formatBlock", value: "h1", icon: "H1", title: "Tiêu đề 1" },
  { command: "formatBlock", value: "h2", icon: "H2", title: "Tiêu đề 2" },
  { command: "formatBlock", value: "h3", icon: "H3", title: "Tiêu đề 3" },
  { command: "formatBlock", value: "p", icon: "P", title: "Đoạn văn" },
  {
    command: "insertUnorderedList",
    icon: "• List",
    title: "Danh sách có dấu đầu dòng",
  },
  { command: "insertOrderedList", icon: "1. List", title: "Danh sách có số" },
  { command: "createLink", icon: "🔗", title: "Chèn liên kết" },
  { command: "removeFormat", icon: "✖", title: "Xóa định dạng" },
];

const execCommand = (command, value = null) => {
  if (command === "createLink") {
    const url = prompt("Nhập URL:");
    if (url) {
      document.execCommand(command, false, url);
    }
  } else {
    document.execCommand(command, false, value);
  }
  editorRef.value?.focus();
  onInput();
};

const onInput = () => {
  if (editorRef.value) {
    emit("update:modelValue", editorRef.value.innerHTML);
  }
};

const onPaste = (e) => {
  e.preventDefault();
  const text = e.clipboardData.getData("text/plain");
  document.execCommand("insertText", false, text);
};

onMounted(() => {
  if (editorRef.value && props.modelValue) {
    editorRef.value.innerHTML = props.modelValue;
  }
});

watch(
  () => props.modelValue,
  (newValue) => {
    if (editorRef.value && newValue !== editorRef.value.innerHTML) {
      editorRef.value.innerHTML = newValue;
    }
  }
);
</script>

<style scoped>
.editor-content:focus {
  outline: none;
}

.editor-content :deep(h1) {
  font-size: 2em;
  font-weight: bold;
  margin: 0.67em 0;
}

.editor-content :deep(h2) {
  font-size: 1.5em;
  font-weight: bold;
  margin: 0.75em 0;
}

.editor-content :deep(h3) {
  font-size: 1.17em;
  font-weight: bold;
  margin: 0.83em 0;
}

.editor-content :deep(p) {
  margin: 1em 0;
}

.editor-content :deep(ul),
.editor-content :deep(ol) {
  margin: 1em 0;
  padding-left: 2em;
}

.editor-content :deep(a) {
  color: #3b82f6;
  text-decoration: underline;
}

.editor-content :deep(strong),
.editor-content :deep(b) {
  font-weight: bold;
}

.editor-content :deep(em),
.editor-content :deep(i) {
  font-style: italic;
}

.editor-content :deep(u) {
  text-decoration: underline;
}

.editor-content :deep(s) {
  text-decoration: line-through;
}
</style>
