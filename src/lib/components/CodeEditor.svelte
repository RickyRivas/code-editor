<script>
  // stores
  import { EditorView, basicSetup } from "codemirror"
  import { EditorState, StateEffect, StateField } from "@codemirror/state"
  import { javascript } from "@codemirror/lang-javascript"
  import { html } from "@codemirror/lang-html"
  import { css } from "@codemirror/lang-css"
  import beautify from "js-beautify"
  import { onMount, createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()

  export let edit = false

  // Import themes
  import { oneDark } from "@codemirror/theme-one-dark"

  export let code
  export let language

  let editor
  let editorElement
  let isEditing = false

  const toggleEditableEffect = StateEffect.define()

  const editableExtension = StateField.define({
    create: () => false,
    update(value, tr) {
      for (let e of tr.effects) if (e.is(toggleEditableEffect)) value = e.value
      return value
    },
    provide: (f) => EditorView.editable.from(f),
  })

  function getLangSupport(lang) {
    switch (lang) {
      case "javascript":
      case "js":
        return javascript()
      case "css":
        return css()
      case "html":
        return html()
      default:
        return javascript()
    }
  }

  function formatCode(codeToFormat, lang) {
    switch (lang) {
      case "css":
        return beautify.css(codeToFormat)
      case "html":
        return beautify.html(codeToFormat)
      case "javascript":
      case "js":
        return beautify.js(codeToFormat)
      default:
        return codeToFormat
    }
  }

  function toggleEdit() {
    isEditing = !isEditing

    // editor
    editor.dispatch({
      effects: toggleEditableEffect.of(isEditing),
    })

    // when saving changes, update code snippet
    // TODO: save to db here
    if (!isEditing) {
      const updatedCode = editor.state.doc.toString()
      code = updatedCode
      console.log("updated code:", code)
      // svelte dispatch to parent
      dispatch("update", { code: updatedCode })
    }
  }

  onMount(() => {
    const langSupport = getLangSupport(language)
    const formattedCode = formatCode(code, language)

    const state = EditorState.create({
      doc: formattedCode,
      extensions: [
        basicSetup,
        langSupport,
        oneDark,
        // EditorView.lineWrapping,
        editableExtension,
      ],
    })

    editor = new EditorView({
      state,
      parent: editorElement,
    })

    return () => {
      editor.destroy()
    }
  })
</script>

<div class="code-mirror-el" bind:this={editorElement}></div>

{#if edit}
  <button on:click={toggleEdit}>{isEditing ? "Save Changes" : "Edit"}</button>
  <span
    >note: this is for editting snippets only. not solely writing snippets and testing them. Thats
    what your IDE does.</span>
{/if}

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
