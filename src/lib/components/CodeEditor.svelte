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

  // Import themes
  import { oneDark } from "@codemirror/theme-one-dark"

  let section = {
    html: `<div class="spot05"> <div class="container"> \n <?php include 'assets/includes/tshow.php'; ?> \n <div class="socialmedia"> <a class="facebook spot" aria-label="follow us on facebook" href="#"> <span class="icon fa-brands fa-fw fa-facebook-f" aria-hidden="true" role="img"></span> </a> <button class='google-init' aria-label="Click to view a list of our locations and leave a review"> <span class="icon fa-brands fa-fw fa-google" aria-hidden="true" role="img"></span> </button> \n <!-- Google Links --> \n <div class="links"> <a class="link" aria-label="review our Clarksville location on google" href="https://maps.app.goo.gl/6o5GPtSkX2jTTpdG8"> Clarksville Office </a> <a class="link" aria-label="review our Scottsburg location on google" href="https://maps.app.goo.gl/mL1jooMRjKjmGVDj7"> Scottsburg Office </a> </div> </div> <div class="pager"></div> </div> </div>`,
    css: `.spot05 { padding: 3em 0; background: #ccc url(../images/spotlight/spot05.jpg) center / cover no-repeat; @media only screen and (min-width: 768px) { padding: 8.6em 0 4.5em; } @media only screen and (min-width: 1024px) and (max-width: 1999px) { background-size: auto; } .container { max-width: 1313/20em; width: 90%; } .cycle-slideshow { color: #0e2c49; width: 100%; max-width: 915/20em; margin: 0 auto; display: block; &:hover { color: @color1; } } .cycle-slide { width: 100%; display: block; transition: color 0.33s ease-in-out; } .testimony { @fs: 22; @lh: 30; @marginbottom: 27; display: block; .fs(@fs/20em); .lh(1.2); margin-bottom: @marginbottom/@fs*1em; } .testifier { @fs: 20; @lh: 22; @marginbottom: 69; display: block; .fs(@fs/20em); .lh(@lh/@fs); .sbold; text-transform: capitalize; & when (@marginbottom > 0) { margin-bottom: @marginbottom/@fs*1em; } } .socialmedia { @parentwidth: 162.5; @baseheight: 61; @iconfs: 12; @textfs: 12; display: inline-flex; justify-content: center; align-items: center; vertical-align: top; width: @parentwidth/20em; color: #fff; text-align: center; background-color: #4e84e0; margin: 0; position: relative; @media only screen and (max-width: 767px) { font-size: 1.2em; } &::before { content: 'leave a review'; display: inline-block; vertical-align: top; font-size: @textfs/20*1em; line-height: @baseheight/@textfs*1em; .upp; } a:not(.link),
                 .google-init { display: inline-block; vertical-align: top; font-size: @iconfs/20*1em; line-height: @baseheight/@iconfs*1em; height: auto; padding: 0; transition: transform .33s ease, color .33s ease; color: currentColor; margin: 0 .1em; background: none; border: 0; /* &:not(.spot) { display: none; } */ &.facebook { .icon::before { content: '\f09a'; } } &:hover { transform: scale(1.1); color: #68e9b6; } } .links { display: flex; justify-content: center; align-items: center; flex-direction: column; position: absolute; gap: 5px; top: calc(100% + 1em); right: calc(-50% + 1.6em); width: 100%; max-width: 300/20em; z-index: 77; opacity: 0; pointer-events: none; transition: opacity .33s ease, top .33s ease; a { display: block; width: 100%; font-size: 15/20em; line-height: 2; background-color: white; color: @color0; transition: color .33s ease, background-color .33s ease; &:hover { color: #fff; background-color: @color0; } } } &.active { .google-init { transform: scale(1.1); color: #68e9b6; } .links { opacity: 1; pointer-events: all; top: calc(100% - .5em); } } } .pager { margin-top: 50/20em; @media only screen and (min-width: 1024px) { position: absolute; transform: translateY(-50%); top: 41.5%; left: 0; margin: 0; } span { width: 17.5/20em; height: 17.5/20em; display: inline-block; vertical-align: top; border: 2px solid #3a9571; background-color: #3a9571; color: transparent; .round; margin: 0 5/20em; transition: background-color .33s ease; @media only screen and (min-width: 1024px) { display: block; margin: 6.5/20em 0; } &:hover, &.cycle-pager-active { background-color: transparent; } } } }`,
    javascript: `$(".google-init").on("click", function() { $(".spot05 .socialmedia").toggleClass('active'); }); function gsapBgParallax(target, trigger) { gsap.fromTo(target, { backgroundPositionY: '0%', }, { scrollTrigger: { trigger, scrub: true, end: '50%' }, backgroundPositionY: '100%' }); } gsap.registerPlugin(ScrollTrigger); gsap.matchMedia().add('(min-width: 1024px)', () => { gsapBgParallax('.spot01-02', '.spot01-02'); gsapBgParallax('.spot05', '.spot05'); })`,
  }

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
<button on:click={toggleEdit}>{isEditing ? "Save Changes" : "Edit"}</button>
<span
  >note: this is for editting snippets only. not solely writing snippets and testing them. Thats
  what your IDE does.</span>

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
