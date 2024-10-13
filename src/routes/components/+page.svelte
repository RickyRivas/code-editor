<script>
  import ComponentSnippet from "$lib/components/ComponentSnippet.svelte"
  import Modal from "$lib/components/Modal.svelte"
  import LoadingStatus from "$lib/components/LoadingStatus.svelte"
  import { fetchSnippetsByType } from "$lib/supabaseCodeSaver"
  import { onMount } from "svelte"

  // modal
  let showModal = false
  let success = false
  let error = false
  let message = ""
  let disableModalClose = false
  let loading = false

  function clearModal() {
    message = ""
    showModal = false
    success = false
    loading = false
    error = false
  }

  function initLoadingModal() {
    showModal = true
    loading = true
  }

  function successfulCall(responseMessage, closeImmediately) {
    // if closeImmediately, when fetch is done close modal
    if (closeImmediately) {
      clearModal()
      return
    }

    success = true
    message = responseMessage
    loading = false
  }
  function failedCall(responseMessage, closeImmediately) {
    // if closeImmediately, when fetch is done close modal
    if (closeImmediately) {
      clearModal()
      return
    }

    error = true
    message = responseMessage
    loading = false
  }

  // grab components on load
  let components = []

  onMount(async () => {
    initLoadingModal()
    const { data, error } = await fetchSnippetsByType("component")

    if (!error) {
      components = data
      successfulCall("", true)
    } else {
      failedCall("", true)
    }
  })
</script>

{#if showModal}
  <Modal
    disable={disableModalClose}
    on:escape={() => {
      clearModal()
    }}>
    <div>
      <LoadingStatus bind:loading bind:success bind:error />
      {#if loading}
        <p>Loading...</p>
      {/if}
      {#if success}
        <!-- successfully added to db -->
        <p>{message}</p>
      {:else if error}
        <!-- failed to be added to db -->
        <p>{message}</p>
      {/if}
    </div>
  </Modal>
{/if}

<section id="components">
  <div class="container">
    <h2>Components</h2>
    {#if components.length > 0}
      <div class="components">
        {#each components as component}
          <ComponentSnippet {component} />
        {/each}
      </div>
    {:else}
      <p>Please add some components!</p>
    {/if}
  </div>
</section>
