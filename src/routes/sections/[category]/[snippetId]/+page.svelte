<script>
  import { PUBLIC_CLOUDINARY_CLOUD_NAME } from "$env/static/public"
  import { CldImage, configureCloudinary } from "svelte-cloudinary"

  import SectionEditor from "$lib/components/SectionEditor.svelte"

  export let data
  const { fetchedFields, fetchedId, fetchedSnippet } = data.snippet

  // formatting for copy btn
  import beautify from "js-beautify"
  import Prism from "prismjs"
  import "prismjs/components/prism-javascript"
  import "prismjs/components/prism-css"
  import "prismjs/components/prism-markup"

  import { toggleFavorite } from "$lib/supabaseCodeSaver"

  // configure cloudinary for image upload widget
  configureCloudinary({
    cloudName: PUBLIC_CLOUDINARY_CLOUD_NAME,
  })

  // copy button will use these values to format and eventually copy
  let currentSnippet = {
    lang: "html",
    snippet: fetchedSnippet.html,
  }

  // copy btn
  let copyBtn
  const beautifyFunctions = {
    html: beautify.html,
    css: beautify.css,
    js: beautify.javascript,
  }

  function copy() {
    const beautifyFunction = beautifyFunctions[currentSnippet.lang] || ((x) => x)
    let prismOpts = {
      inline: [""],
      wrap_line_length: 100,
    }
    navigator.clipboard.writeText(beautifyFunction(currentSnippet.snippet, prismOpts))
    copyBtn.textContent = "Copied!"
    copyBtn.classList.add("active")

    setTimeout(() => {
      copyBtn.textContent = "Copy"
      copyBtn.classList.remove("active")
    }, 1000)
  }
</script>

<section>
  <div class="container">
    <h2>{fetchedFields.title}</h2>
    <p>{fetchedFields.description || "No description available."}</p>
    <span>id: {fetchedId}</span>
    <label for="component-fav-toggle">
      Favorite
      <input
        type="checkbox"
        name="component-fav-toggle"
        id="component-fav-toggle"
        checked={fetchedFields.favorite}
        on:change={async () => {
          await toggleFavorite(fetchedId)
        }} />
    </label>
    <a href="/manager?snippetId={fetchedId}">Edit</a>
    <button bind:this={copyBtn} on:click={copy}>copy {currentSnippet.lang}</button>
    <SectionEditor
      section={fetchedSnippet}
      on:langUpdate={(e) => {
        currentSnippet.snippet = e.detail.snippet
        currentSnippet.lang = e.detail.lang
      }}
      on:sectionUpdate={(e) => {
        console.log(e)
      }} />
    <a href="/sections/{fetchedFields.category}">back</a>
  </div>
</section>
