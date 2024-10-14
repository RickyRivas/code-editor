<script>
  import { enhance } from "$app/forms"
  import { page } from "$app/stores"

  import SectionEditor from "$lib/components/SectionEditor.svelte"
  import UploadWidget from "$lib/components/UploadWidget.svelte"
  import Modal from "$lib/components/Modal.svelte"
  import LoadingStatus from "$lib/components/LoadingStatus.svelte"

  import { CldImage, configureCloudinary } from "svelte-cloudinary"
  import {
    saveOrUpdateCodeInSupabase,
    getCodeFromSupabase,
    deleteSnippetById,
  } from "$lib/supabaseCodeSaver"
  import { PUBLIC_CLOUDINARY_CLOUD_NAME } from "$env/static/public"

  import { updateFieldsWithFetchedData, updateSnippetWithFetchedData } from "$lib/utils/index"
  import { goto } from "$app/navigation"

  // configure cloudinary for image upload widget
  configureCloudinary({
    cloudName: PUBLIC_CLOUDINARY_CLOUD_NAME,
  })

  // modal
  //   $: console.log("fields", fields)
  //   $: console.log("snippet langs", snippet)
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

  // Logic
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
      required: true,
    },
    {
      name: "description",
      label: "description",
      value: "",
      inputType: "text",
      required: false,
    },
    {
      name: "type",
      label: "type",
      value: "",
      inputType: "radio",
      required: true,
      options: ["section", "component", "snippet"],
    },
    {
      name: "category",
      label: "category - one word, lowercase",
      value: "",
      inputType: "text",
      required: true,
    },
    {
      name: "thumbnailurl",
      label: "thumbnail url",
      value: "",
      inputType: "text",
      widget: "cloudinary",
      required: false,
    },
    {
      name: "favorite",
      label: "favorite",
      value: false,
      inputType: "checkbox",
      required: false,
    },
  ]

  function saveFromEditor(e) {
    // after editor saves changes, e.detail.section comes up from the component
    snippet.html = e.detail.section.html
    snippet.css = e.detail.section.css
    snippet.javascript = e.detail.section.javascript
  }

  async function saveToDb() {
    initLoadingModal()
    try {
      const savedCode = await saveOrUpdateCodeInSupabase({ id: snippetId, fields, snippet })
      successfulCall("Successfully updated or saved snippet.", false)
    } catch (error) {
      failedCall(`"Error trying to save or update snippet: ${error.message}`, false)
    }
  }

  async function fetchSnippet(id) {
    initLoadingModal()
    if (reqSnippetId) {
      try {
        const { fetchedFields, fetchedSnippet, fetchedId } = await getCodeFromSupabase(id)

        // Update fields with fetched data
        fields = updateFieldsWithFetchedData(fields, fetchedFields)

        // Update snippet with fetched data
        snippet = updateSnippetWithFetchedData(snippet, fetchedSnippet)

        // update id
        snippetId = fetchedId

        // reassigning destroys and reinits the SectionEditor component
        codeReactivity = { fetchedFields, fetchedSnippet, fetchedId }

        // close modal
        successfulCall("", true)
      } catch (error) {
        failedCall(`"Error loading snippet:", ${error.message}`, false)
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
</script>

{#if showModal}
  <Modal
    disable={disableModalClose}
    on:escape={() => {
      clearModal()
    }}>
    <div>
      <LoadingStatus bind:loading bind:success bind:error />
      {#if loading}
        <p>Loading...</p>
      {/if}
      {#if success}
        <!-- successfully added to db -->
        <p>{message}</p>
      {:else if error}
        <!-- failed to be added to db -->
        <p>{message}</p>
      {/if}
    </div>
  </Modal>
{/if}

<section>
  <div class="container">
    {#if updatingSnippet}
      <h2>{`updating snippet #${reqSnippetId}`}</h2>
    {:else}
      <h2>RWD Code Library</h2>
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
              <input type="text" name="" id="" bind:value={field.value} required={field.required} />
            </label>
            <!-- widget -->
            {#if field.widget === "cloudinary"}
              <UploadWidget bind:imageUrl={field.value} />
            {/if}
          </div>
        {/if}

        <!-- checkboxs -->
        {#if field.inputType === "checkbox"}
          <div class="form-control">
            <label for={`field-${field.name}`}>
              {field.label}
              <input
                type="checkbox"
                name={field.name}
                id={`field-${field.name}`}
                required={field.required}
                bind:checked={field.value} />
            </label>
            <!-- widget -->
            {#if field.widget === "cloudinary"}
              <UploadWidget bind:imageUrl={field.value} />
            {/if}
          </div>
        {/if}

        <!-- radio -->
        {#if field.inputType === "radio"}
          <div class="form-control">
            <label>
              {field.name}
              <input type="hidden" name="" /></label>
            <div class="form-radio-group">
              {#each field.options as option}
                <label>
                  {option}
                  <input
                    type="radio"
                    name={field.name}
                    checked={field.value === option}
                    on:change={() => {
                      field.value = option
                    }} />
                </label>
              {/each}
            </div>
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
        edit={true}
        on:sectionUpdate={(e) => {
          saveFromEditor(e)
        }} />
    {/key}

    {#if snippetId}
      <button
        data-wow="h"
        on:click={async () => {
          initLoadingModal()
          try {
            await deleteSnippetById(reqSnippetId)
            successfulCall("Successfully deleted snippet.")
            setTimeout(() => {
              goto("/")
            }, 3000)
          } catch (error) {
            failedCall("failed to delete snippet", false)
          }
          // delete snippet and redirect user
        }}>delete snippet :(</button>
    {/if}
  </div>
</section>
