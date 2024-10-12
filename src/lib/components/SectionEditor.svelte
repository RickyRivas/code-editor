<script>
  import { writable } from "svelte/store"
  import { onMount, createEventDispatcher } from "svelte"
  import CodeEditor from "./CodeEditor.svelte"
  const dispatch = createEventDispatcher()

  export let section

  const langs = ["html", "css", "javascript"]
  let currentLang = langs[0]

  // create writable store for the section
  $: sectionStore = writable(section)

  function switchLang(lang) {
    currentLang = lang
  }

  function handleCodeUpdate(event) {
    const updatedCode = event.detail.code
    console.log("updatedCode", updatedCode)

    sectionStore.update((currentSection) => ({
      ...currentSection,
      [currentLang]: updatedCode,
    }))

    // propagate the change to the parent component
    section = $sectionStore

    dispatch("sectionUpdate", { section })
  }

  // subscribe to changes in the section prop
  $: sectionStore.set(section)
</script>

<!-- This {#key} block tells Svelte to completely destroy 
    and recreate the CodeEditor component whenever currentLanguage changes. This ensures that the CodeEditor always re-initializes with the correct language and code. -->

{#key currentLang}
  <CodeEditor
    code={$sectionStore[currentLang]}
    language={currentLang}
    on:update={handleCodeUpdate} />
{/key}

{#each langs as lang}
  <button
    on:click={() => {
      switchLang(lang)
    }}
    class:active={currentLang === lang}>{lang}</button>
{/each}
