<template>
  <div class="cloudinary-upload">
    <input
      ref="fileInput"
      type="file"
      :accept="acceptedTypes"
      class="hidden"
      @change="handleFileSelect"
    />

    <slot
      :openUploader="openUploader"
      :uploading="uploading"
      :progress="progress"
      :uploadedUrl="uploadedUrl"
      :fileName="fileName"
      :fileSize="fileSize"
      :removeFile="removeFile"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useToast } from "vue-toastification";
import apiService from "@/services/api";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  options: {
    type: Object,
    default: () => ({
      resourceType: "image",
      allowedFormats: ["jpg", "jpeg", "png", "webp"],
      maxFileSize: 10000000,
      folder: "uploads",
    }),
  },
});

const emit = defineEmits([
  "update:modelValue",
  "upload-success",
  "upload-error",
]);

const toast = useToast();

// State
const uploading = ref(false);
const progress = ref(0);
const uploadedUrl = ref(props.modelValue);
const fileName = ref("");
const fileSize = ref(0);
const fileInput = ref(null);

// Computed accept attribute for file input
const acceptedTypes = computed(() => {
  const resourceType = props.options.resourceType;
  const allowedFormats = props.options.allowedFormats || [];

  if (resourceType === "video") {
    return "video/*";
  } else if (resourceType === "image") {
    return "image/*";
  } else if (allowedFormats.length > 0) {
    return allowedFormats.map((format) => `.${format}`).join(",");
  }

  return "*/*";
});

const openUploader = () => {
  fileInput.value?.click();
};

const handleFileSelect = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  // Validate file type
  const resourceType = props.options.resourceType;
  const allowedFormats = props.options.allowedFormats || [];

  if (resourceType === "video" && !file.type.startsWith("video/")) {
    toast.error("Vui lòng chọn file video");
    return;
  }

  if (resourceType === "image" && !file.type.startsWith("image/")) {
    toast.error("Vui lòng chọn file hình ảnh");
    return;
  }

  // Validate file size
  const maxFileSize = props.options.maxFileSize || 10000000;
  if (file.size > maxFileSize) {
    toast.error(
      `File quá lớn. Tối đa ${Math.round(maxFileSize / 1024 / 1024)}MB`,
    );
    return;
  }

  await uploadFile(file);
};

const uploadFile = async (file) => {
  try {
    uploading.value = true;
    progress.value = 0;
    fileName.value = file.name;
    fileSize.value = file.size;

    const formData = new FormData();
    formData.append(getFormFieldName(), file);

    const uploadEndpoint = getUploadEndpoint();

    const response = await apiService.post(uploadEndpoint, formData, {
      timeout: 120000, // 2 minutes for video uploads
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          progress.value = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100,
          );
        }
      },
    });

    if (response.data.success) {
      const result = response.data.data;
      handleUploadSuccess(result);
    } else {
      throw new Error(response.data.message || "Upload failed");
    }
  } catch (error) {
    handleUploadError(error);
  } finally {
    uploading.value = false;
    // Clear file input
    if (fileInput.value) {
      fileInput.value.value = "";
    }
  }
};

const getUploadEndpoint = () => {
  const resourceType = props.options.resourceType;
  switch (resourceType) {
    case "video":
      return "/upload/video";
    case "image":
      return "/upload/image";
    default:
      return "/upload/image";
  }
};

const getFormFieldName = () => {
  const resourceType = props.options.resourceType;
  switch (resourceType) {
    case "video":
      return "video";
    case "image":
      return "image";
    default:
      return "image";
  }
};

const handleUploadSuccess = (result) => {
  uploading.value = false;
  progress.value = 100;

  // Handle different response formats from backend
  const url =
    result.videoUrl ||
    result.imageUrl ||
    result.avatarUrl ||
    result.thumbnailUrl ||
    result.secure_url;
  const originalName = result.original_filename || fileName.value;
  const bytes = result.bytes || fileSize.value;

  uploadedUrl.value = url;
  fileName.value = originalName;
  fileSize.value = bytes;

  emit("update:modelValue", url);
  emit("upload-success", result);

  toast.success("Upload thành công!");
};

const handleUploadError = (error) => {
  uploading.value = false;
  progress.value = 0;

  console.error("Upload error:", error);

  const errorMessage =
    error.response?.data?.message || error.message || "Lỗi upload file";

  emit("upload-error", error);
  toast.error(errorMessage);
};

const removeFile = () => {
  uploadedUrl.value = "";
  fileName.value = "";
  fileSize.value = 0;
  progress.value = 0;

  emit("update:modelValue", "");
};

// Watch for prop changes
import { watch } from "vue";
watch(
  () => props.modelValue,
  (newValue) => {
    uploadedUrl.value = newValue;
  },
);
</script>

<style scoped>
.cloudinary-upload {
  width: 100%;
}
</style>
