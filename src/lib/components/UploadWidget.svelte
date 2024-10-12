<script>
  import { env } from "$env/dynamic/public"
  import { PUBLIC_CLOUDINARY_CLOUD_NAME, PUBLIC_CLOUDINARY_UPLOAD_PRESET } from "$env/static/public"
  import { onMount } from "svelte"

  let widget
  export let imageUrl

  let onUpload = (error, result, widget) => {
    if (!error && result) {
      console.log("url of new image:", result.info.url)
      imageUrl = result.info.url
    }
  }

  const cldOptions = {
    cloudName: PUBLIC_CLOUDINARY_CLOUD_NAME,
    uploadPreset: PUBLIC_CLOUDINARY_UPLOAD_PRESET,
  }

  function cldCallback(error, result) {
    if (error || result.event === "success") {
      onUpload && onUpload(error, result, widget)
    }
  }

  onMount(() => {
    function onIdle() {
      if (!widget) {
        widget = window.cloudinary.createUploadWidget(cldOptions, cldCallback)
      }
    }

    "requestIdleCallback" in window ? requestIdleCallback(onIdle) : setTimeout(onIdle, 1)
  })
  function handleClick() {
    if (widget) {
      widget.open()
    }
  }
</script>

<button on:click={handleClick} type="button"> Upload an image </button>
