<script>
  // stores
  import { business } from "$lib/config"
  import Prism from "prismjs"
  import beautify from "js-beautify"

  // Import additional languages
  import "prismjs/components/prism-javascript"
  import "prismjs/components/prism-css"
  import "prismjs/components/prism-markup"
  import { onMount } from "svelte"

  let code = `@media only screen and (max-width: 767px) {  margin: 0 0 2em 0;  }  @media only screen and (min-width: 768px) {  margin: 0 2em 0 0;  }`
  let language = "css"
  let highlighted = ""

  let isEditing = false
  let editableCode = code

  function formatAndHighlight() {
    let formattedCode = code

    // Format the code based on the language
    if (language === "css") {
      formattedCode = beautify.css(code)
    } else if (language === "html") {
      formattedCode = beautify.html(code)
    } else if (language === "javascript" || language === "js") {
      formattedCode = beautify.js(code)
    }

    highlighted = Prism.highlight(formattedCode, Prism.languages[language], language)
  }

  function toggleEdit() {
    isEditing = !isEditing
    if (!isEditing) {
      code = editableCode
      formatAndHighlight()
    }
  }

  onMount(() => {
    formatAndHighlight()
  })
</script>

<main>
  <section id="hero">
    <div class="code-editor">
      {#if isEditing}
        <textarea bind:value={editableCode} rows="10" cols="50" id=""></textarea>
        <button on:click={toggleEdit}>save changes</button>
      {:else}
        <pre><code class="language-{language}">{@html highlighted}</code></pre>
        <button on:click={toggleEdit}>Edit</button>
      {/if}
    </div>
  </section>
</main>

<style lang="less">
  .code-editor {
    display: block;
    overflow: auto;
    height: 100%;
    height: (400/20em);
    resize: vertical;
    padding: 1em;
    background-color: #2d2d2d;
    width: 90%;
    max-width: (600/20em);
    display: block;
    margin-inline: auto;

    pre {
      font-size: 14px;
      font-family: inherit;
    }
  }

  @import url("$styles/highlight.less");
</style>
