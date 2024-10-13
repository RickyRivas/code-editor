<script>
  import { fetchSnippetsByType } from "$lib/supabaseCodeSaver"
  import { onMount } from "svelte"
  import Modal from "$lib/components/Modal.svelte"
  import LoadingStatus from "$lib/components/LoadingStatus.svelte"

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
  let sections = []
  let categories = []

  function extractUnqiqueCategoriesWithCounts(snippets) {
    // Use an object to store categories and their counts
    const categoryCountMap = {}

    snippets.forEach((snippet) => {
      if (snippet.category) {
        if (categoryCountMap[snippet.category]) {
          categoryCountMap[snippet.category]++
        } else {
          categoryCountMap[snippet.category] = 1
        }
      }
    })

    // Convert the map to an array of objects and sort by category name
    return Object.entries(categoryCountMap)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => a.category.localeCompare(b.category))
  }

  onMount(async () => {
    initLoadingModal()
    const { data, error } = await fetchSnippetsByType("section")

    if (!error) {
      sections = data

      categories = extractUnqiqueCategoriesWithCounts(sections)
      console.log(categories)
      successfulCall("", true)
    } else {
      failedCall("", true)
    }
  })
</script>

<section>
  <div class="container">
    <h2>Sections</h2>

    <!-- display categories and their counts -->
    <h3>Categories</h3>
    {#if categories.length > 0}
      <ul>
        {#each categories as category}
          <li>
            <a href={`/sections/${category.category.toLowerCase().replaceAll(" ", "-")}`}>
              {category.category} ({category.count})
            </a>
          </li>
        {/each}
      </ul>
    {:else}
      <p>Please add some snippets!</p>
    {/if}
  </div>
</section>

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
