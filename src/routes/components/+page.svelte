<script>
  import ComponentSnippet from "$lib/components/ComponentSnippet.svelte"
  import { fetchSnippetsByType } from "$lib/supabaseCodeSaver"
  import { onMount } from "svelte"

  let components = []
  // grab components on load

  onMount(async () => {
    const { data, error } = await fetchSnippetsByType("component")

    if (!error) {
      components = data
    }
    // console.log(data)
  })
</script>

<section id="components">
  <div class="container">
    <h2>Components</h2>

    <div class="components">
      {#each components as component}
        <ComponentSnippet {component} />
      {/each}
    </div>
  </div>
</section>
