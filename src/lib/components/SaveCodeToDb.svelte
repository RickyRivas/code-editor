<script>
  import { enhance } from "$app/forms"
  import { saveOrUpdateCodeInSupabase, getCodeFromSupabase } from "$lib/supabaseCodeSaver"
  import SectionEditor from "./SectionEditor.svelte"
  import { page } from "$app/stores"

  let updatingSnippet = false

  let code = {
    metadata: {
      title: "Snippet",
      description: "Snippet Description",
      type: "section",
    },
    langs: {
      html: "<!-- html code -->",
      css: "/* Css/less */",
      javascript: "// Javascript or Jquery",
    },
  }

  function handleInput(key, e) {
    code.metadata[key] = e.target.value
    code.metadata = code.metadata
  }

  function saveFromEditor(e) {
    // only update code.langs
    code.langs = e.detail.section
  }

  async function saveToDb() {
    try {
      const savedCode = await saveOrUpdateCodeInSupabase(code)
      console.log("savedCode:", savedCode)
    } catch (error) {
      console.log("error saving code")
    }
  }

  async function fetchSnippet(id) {
    console.log(id)
    if (snippetId) {
      try {
        code = await getCodeFromSupabase(id)
      } catch (error) {
        console.error("Error loading snippet:", error)
      }
    }
  }

  // check if there is an id in the search params
  const snippetId = $page.url.searchParams.get("snippetId")
  if (snippetId) {
    fetchSnippet(snippetId)
    updatingSnippet = true
  }
</script>

{#if updatingSnippet}
  <h2>{`updating snippet #${snippetId}`}</h2>
{:else}
  <h2>Add a new snippet!</h2>
{/if}

<form
  action="/"
  method="post"
  use:enhance={async ({ cancel }) => {
    console.log("saving to db:", code)

    await saveToDb()
    cancel()
    return async ({ result }) => {}
  }}>
  {#each Object.entries(code.metadata) as [key, value]}
    <div class="form-action">
      <label for={key}>
        {key}
        <input type="text" name="" id="" {value} on:input={(e) => handleInput(key, e)} required />
      </label>
    </div>
  {/each}
  <button>Save to DB</button>
</form>

<h2>Preview</h2>
<SectionEditor
  section={code.langs}
  on:sectionUpdate={(e) => {
    saveFromEditor(e)
  }} />
