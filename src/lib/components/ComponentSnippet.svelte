<script>
  // simple code editor that we dont need to full codemirror exp.
  // ideal for displaying large amounts of components/sections

  import Prism from "prismjs"
  import beautify from "js-beautify"
  // Import additional languages
  import "prismjs/components/prism-javascript"
  import "prismjs/components/prism-css"
  import "prismjs/components/prism-markup"
  import { onMount } from "svelte"
  import { toggleFavorite } from "$lib/supabaseCodeSaver"

  export let component

  const codeToDisplay = {
    html: component.html || "",
    css: component.css || "",
    javascript: component.javascript || "",
  }

  const beautifyFunctions = {
    html: beautify.html,
    css: beautify.css,
    js: beautify.javascript,
  }

  const prismLanguages = {
    html: Prism.languages.markup,
    css: Prism.languages.css,
    js: Prism.languages.javascript,
  }

  let formattedCode, activeIndex
  let selectedSnippet = Object.entries(codeToDisplay)[0]

  function formatAndHighlightCode(index, code, tech) {
    const beautifyFunction = beautifyFunctions[tech] || ((x) => x)
    const language = prismLanguages[tech] || Prism.languages.markup

    selectedSnippet = Object.entries(codeToDisplay)[index]

    let prismOpts = {
      inline: [""],
      wrap_line_length: 100,
    }

    if (!code) {
      formattedCode = `<pre>${tech} snippet not included.</pre>`
    } else {
      formattedCode = Prism.highlight(beautifyFunction(code, prismOpts), language, tech)
    }
  }

  function copy() {
    const beautifyFunction = beautifyFunctions[selectedSnippet[0]] || ((x) => x)
    let prismOpts = {
      inline: [""],
      wrap_line_length: 100,
    }
    navigator.clipboard.writeText(beautifyFunction(selectedSnippet[1], prismOpts))
    console.log("copied!")
  }

  onMount(() => {
    formatAndHighlightCode(0, codeToDisplay.html, "html")
  })
</script>

<div class="component">
  <div class="info">
    <span>id: {component.id}</span>
    <h3>Title: {component.title}</h3>
    <p>{component.description || "No description available."}</p>
    <label for="component-fav-toggle">
      Favorite
      <input
        type="checkbox"
        name="component-fav-toggle"
        id="component-fav-toggle"
        checked={component.favorite}
        on:change={async () => {
          await toggleFavorite(component.id)
        }} />
    </label>
  </div>
  <div class="display">
    <pre>{@html formattedCode}</pre>
  </div>
  <button on:click={copy}>copy</button>
  <div class="tabs">
    {#each Object.entries(codeToDisplay) as [tech, snippet], i}
      <button
        on:click={() => formatAndHighlightCode(i, snippet, tech)}
        class:active={i === activeIndex}
        disabled={i === activeIndex}>
        {tech}
      </button>
    {/each}
  </div>
</div>
