<script>
  import Modal from "$lib/components/Modal.svelte"
  import LoadingStatus from "$lib/components/LoadingStatus.svelte"
  import { fetchSnippetsByType } from "$lib/supabaseCodeSaver"
  import { onMount } from "svelte"
  import SnippetBlock from "$lib/components/SnippetBlock.svelte"
  import { extractUnqiqueCategoriesWithCounts } from "$lib/utils"

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

  // grab snippets on load
  let snippets = []
  let categories = []

  onMount(async () => {
    initLoadingModal()
    const { data, error } = await fetchSnippetsByType("snippet")

    if (!error) {
      snippets = data
      categories = extractUnqiqueCategoriesWithCounts(snippets)
      successfulCall("", true)
    } else {
      failedCall("", true)
    }
  })
</script>

<section>
  <div class="container">
    <h2>Snippets</h2>

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

    {#if snippets.length > 0}
      <div class="snippets-items">
        {#each snippets as snippet}
          <SnippetBlock {snippet} />
        {/each}
      </div>
    {:else}
      <p>Please add some snippets!</p>
    {/if}
  </div>
</section>
