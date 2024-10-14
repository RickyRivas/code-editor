<script>
  // stores
  import CodeEditor from "$lib/components/CodeEditor.svelte"
  import SectionEditor from "$lib/components/SectionEditor.svelte"
  import { onMount } from "svelte"

  let section
  function handleSectionUpdate(updatedSection) {
    section = updatedSection
    console.log("Section updated:", sections)
  }

  onMount(() => {
    return () => {
      // This will log the final state of the section when the component is destroyed
      console.log("Final section state:", section)
    }
  })
</script>

<section id="hero">
  <!-- <h2>Snippet</h2>
    {#each library as { code, lang }}
      <CodeEditor {code} language={lang} />
    {/each}

    <h2>Section</h2>
    <SectionEditor bind:section on:sectionUpdate={handleSectionUpdate} /> -->
</section>
