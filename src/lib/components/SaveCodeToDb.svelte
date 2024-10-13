<script>
  import { enhance } from "$app/forms"
  import { saveOrUpdateCodeInSupabase, getCodeFromSupabase } from "$lib/supabaseCodeSaver"
  import SectionEditor from "./SectionEditor.svelte"
  import { page } from "$app/stores"
  import UploadWidget from "./UploadWidget.svelte"
  import { CldImage, configureCloudinary } from "svelte-cloudinary"
  import { PUBLIC_CLOUDINARY_CLOUD_NAME } from "$env/static/public"

  configureCloudinary({
    cloudName: PUBLIC_CLOUDINARY_CLOUD_NAME,
  })

  let updatingSnippet = false
  let snippetId

  let snippet = {
    html: "",
    css: "",
    javascript: "",
  }

  let fields = [
    {
      name: "title",
      label: "title",
      value: "",
      inputType: "text",
    },
    {
      name: "description",
      label: "description",
      value: "",
      inputType: "text",
    },
    {
      name: "type",
      label: "type",
      value: "",
      inputType: "text",
    },
    {
      name: "thumbnailurl",
      label: "thumbnail url",
      value: "",
      inputType: "text",
      widget: "cloudinary",
    },
    {
      name: "favorite",
      label: "favorite",
      value: false,
      inputType: "checkbox",
    },
  ]

  function saveFromEditor(e) {
    // after editor saves changes, e.detail.section comes up from the component
    snippet.html = e.detail.section.html
    snippet.css = e.detail.section.css
    snippet.javascript = e.detail.section.javascript
  }

  async function saveToDb() {
    try {
      const savedCode = await saveOrUpdateCodeInSupabase({ id: snippetId, fields, snippet })
      console.log("Successfully updated or saved snippet.")
    } catch (error) {
      console.log("error saving code")
    }
  }

  // Function to update fields with fetched data
  function updateFieldsWithFetchedData(fields, fetchedData) {
    return fields.map((field) => {
      if (fetchedData.hasOwnProperty(field.name)) {
        return { ...field, value: fetchedData[field.name] }
      }
      return field
    })
  }

  // Function to update snippet with fetched data
  function updateSnippetWithFetchedData(snippet, fetchedData) {
    return {
      ...snippet,
      ...Object.fromEntries(Object.entries(fetchedData).filter(([key]) => key in snippet)),
    }
  }

  async function fetchSnippet(id) {
    if (reqSnippetId) {
      try {
        const { fetchedFields, fetchedSnippet, fetchedId } = await getCodeFromSupabase(id)

        // Update fields with fetched data
        fields = updateFieldsWithFetchedData(fields, fetchedFields)

        // Update snippet with fetched data
        snippet = updateSnippetWithFetchedData(snippet, fetchedSnippet)

        // update id
        console.log(fetchedId)
        snippetId = fetchedId

        // reassigning destroys and reinits the SectionEditor component
        codeReactivity = { fetchedFields, fetchedSnippet, fetchedId }
      } catch (error) {
        console.error("Error loading snippet:", error)
      }
    }
  }

  // check if there is an id in the search params
  let codeReactivity = {}
  const reqSnippetId = $page.url.searchParams.get("snippetId")
  if (reqSnippetId) {
    fetchSnippet(reqSnippetId)
    updatingSnippet = true
  }

  // $: console.log("fields", fields)
  // $: console.log("snippet langs", snippet)
</script>

{#if updatingSnippet}
  <h2>{`updating snippet #${reqSnippetId}`}</h2>
{:else}
  <h2>Add a new snippet!</h2>
{/if}

<form
  action="/"
  method="post"
  use:enhance={async ({ cancel }) => {
    await saveToDb()
    cancel()
  }}>
  {#each fields as field}
    <!-- regular inputs -->
    {#if field.inputType === "text"}
      <div class="form-control">
        <label for={field.name}>
          {field.label}
          <input type="text" name="" id="" bind:value={field.value} required />
        </label>
        <!-- widget -->
        {#if field.widget === "cloudinary"}
          <UploadWidget bind:imageUrl={field.value} />
        {/if}
      </div>
    {/if}

    {#if field.inputType === "checkbox"}
      <div class="form-control">
        <label for={`field-${field.name}`}>
          {field.label}
          <input
            type="checkbox"
            name={field.name}
            id={`field-${field.name}`}
            bind:checked={field.value} />
        </label>
        <!-- widget -->
        {#if field.widget === "cloudinary"}
          <UploadWidget bind:imageUrl={field.value} />
        {/if}
      </div>
    {/if}
  {/each}

  <button>Save to DB</button>
</form>

<h2>Preview</h2>

<!-- snippet thumbnail -->
<!-- This {#key} block tells Svelte to completely destroy 
    and recreate the SectionEditor component whenever [codeReactivity] changes. This ensures that the SectionEditor will update on load -->
{#key codeReactivity}
  <SectionEditor
    section={snippet}
    on:sectionUpdate={(e) => {
      saveFromEditor(e)
    }} />
{/key}
