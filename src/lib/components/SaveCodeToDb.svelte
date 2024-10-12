<script>
  import { enhance } from "$app/forms"
  import { saveCodeToSupabase } from "$lib/supabaseCodeSaver"
  import SectionEditor from "./SectionEditor.svelte"

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
    // SectionEditor only takes/returns in langs
    code.langs = e.detail.section
  }

  async function saveToDb() {
    try {
      const savedCode = await saveCodeToSupabase(code)
      console.log("savedCode:", savedCode)
    } catch (error) {
      console.log("error saving code")
    }
  }
</script>

<h2>Add a new section or snippet to DB</h2>
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
