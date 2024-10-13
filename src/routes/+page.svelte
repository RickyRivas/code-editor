<script>
  // stores
  import CodeEditor from "$lib/components/CodeEditor.svelte"
  import SectionEditor from "$lib/components/SectionEditor.svelte"
  import { onMount } from "svelte"

  let section = {
    title: "stotts-stephen - multiple google locations",
    description: "js included. Background parallax",
    thumbPath: "/sections/stotts-stephen-test.png",
    thumbWidth: "1000",
    thumbHeight: "424",
    html: `<div class="spot05"> <div class="container"> \n <?php include 'assets/includes/tshow.php'; ?> \n <div class="socialmedia"> <a class="facebook spot" aria-label="follow us on facebook" href="#"> <span class="icon fa-brands fa-fw fa-facebook-f" aria-hidden="true" role="img"></span> </a> <button class='google-init' aria-label="Click to view a list of our locations and leave a review"> <span class="icon fa-brands fa-fw fa-google" aria-hidden="true" role="img"></span> </button> \n <!-- Google Links --> \n <div class="links"> <a class="link" aria-label="review our Clarksville location on google" href="https://maps.app.goo.gl/6o5GPtSkX2jTTpdG8"> Clarksville Office </a> <a class="link" aria-label="review our Scottsburg location on google" href="https://maps.app.goo.gl/mL1jooMRjKjmGVDj7"> Scottsburg Office </a> </div> </div> <div class="pager"></div> </div> </div>`,
    css: `.spot05 { padding: 3em 0; background: #ccc url(../images/spotlight/spot05.jpg) center / cover no-repeat; @media only screen and (min-width: 768px) { padding: 8.6em 0 4.5em; } @media only screen and (min-width: 1024px) and (max-width: 1999px) { background-size: auto; } .container { max-width: 1313/20em; width: 90%; } .cycle-slideshow { color: #0e2c49; width: 100%; max-width: 915/20em; margin: 0 auto; display: block; &:hover { color: @color1; } } .cycle-slide { width: 100%; display: block; transition: color 0.33s ease-in-out; } .testimony { @fs: 22; @lh: 30; @marginbottom: 27; display: block; .fs(@fs/20em); .lh(1.2); margin-bottom: @marginbottom/@fs*1em; } .testifier { @fs: 20; @lh: 22; @marginbottom: 69; display: block; .fs(@fs/20em); .lh(@lh/@fs); .sbold; text-transform: capitalize; & when (@marginbottom > 0) { margin-bottom: @marginbottom/@fs*1em; } } .socialmedia { @parentwidth: 162.5; @baseheight: 61; @iconfs: 12; @textfs: 12; display: inline-flex; justify-content: center; align-items: center; vertical-align: top; width: @parentwidth/20em; color: #fff; text-align: center; background-color: #4e84e0; margin: 0; position: relative; @media only screen and (max-width: 767px) { font-size: 1.2em; } &::before { content: 'leave a review'; display: inline-block; vertical-align: top; font-size: @textfs/20*1em; line-height: @baseheight/@textfs*1em; .upp; } a:not(.link),
                 .google-init { display: inline-block; vertical-align: top; font-size: @iconfs/20*1em; line-height: @baseheight/@iconfs*1em; height: auto; padding: 0; transition: transform .33s ease, color .33s ease; color: currentColor; margin: 0 .1em; background: none; border: 0; /* &:not(.spot) { display: none; } */ &.facebook { .icon::before { content: '\f09a'; } } &:hover { transform: scale(1.1); color: #68e9b6; } } .links { display: flex; justify-content: center; align-items: center; flex-direction: column; position: absolute; gap: 5px; top: calc(100% + 1em); right: calc(-50% + 1.6em); width: 100%; max-width: 300/20em; z-index: 77; opacity: 0; pointer-events: none; transition: opacity .33s ease, top .33s ease; a { display: block; width: 100%; font-size: 15/20em; line-height: 2; background-color: white; color: @color0; transition: color .33s ease, background-color .33s ease; &:hover { color: #fff; background-color: @color0; } } } &.active { .google-init { transform: scale(1.1); color: #68e9b6; } .links { opacity: 1; pointer-events: all; top: calc(100% - .5em); } } } .pager { margin-top: 50/20em; @media only screen and (min-width: 1024px) { position: absolute; transform: translateY(-50%); top: 41.5%; left: 0; margin: 0; } span { width: 17.5/20em; height: 17.5/20em; display: inline-block; vertical-align: top; border: 2px solid #3a9571; background-color: #3a9571; color: transparent; .round; margin: 0 5/20em; transition: background-color .33s ease; @media only screen and (min-width: 1024px) { display: block; margin: 6.5/20em 0; } &:hover, &.cycle-pager-active { background-color: transparent; } } } }`,
    javascript: `$(".google-init").on("click", function() { $(".spot05 .socialmedia").toggleClass('active'); }); function gsapBgParallax(target, trigger) { gsap.fromTo(target, { backgroundPositionY: '0%', }, { scrollTrigger: { trigger, scrub: true, end: '50%' }, backgroundPositionY: '100%' }); } gsap.registerPlugin(ScrollTrigger); gsap.matchMedia().add('(min-width: 1024px)', () => { gsapBgParallax('.spot01-02', '.spot01-02'); gsapBgParallax('.spot05', '.spot05'); })`,
  }

  function handleSectionUpdate(updatedSection) {
    section = updatedSection
    console.log("Section updated:", sections)
  }

  onMount(() => {
    return () => {
      // This will log the final state of the section when the component is destroyed
      console.log("Final section state:", section)
    }
  })
</script>

<section id="hero">
  <!-- <h2>Snippet</h2>
    {#each library as { code, lang }}
      <CodeEditor {code} language={lang} />
    {/each}

    <h2>Section</h2>
    <SectionEditor bind:section on:sectionUpdate={handleSectionUpdate} /> -->
</section>
