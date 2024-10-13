<script>
  import { PUBLIC_CLOUDINARY_CLOUD_NAME } from "$env/static/public"

  export let data
  // show specific snippets from a requested category

  $: sections = data.sections
  $: category = data.category
  $: allCategories = data.allCategories

  import { CldImage, configureCloudinary } from "svelte-cloudinary"
  // configure cloudinary for image upload widget
  configureCloudinary({
    cloudName: PUBLIC_CLOUDINARY_CLOUD_NAME,
  })
</script>

<section>
  <div class="container">
    <h2>All Categories</h2>
    <ul>
      {#each allCategories as categoryLink}
        <li class:active={categoryLink === category}>
          <a href="/sections/{categoryLink}">{categoryLink}</a>
        </li>
      {/each}
    </ul>

    <h2>{`Sections for ${category}`}</h2>

    <div class="category-section-items">
      <!-- display all sections for this category -->
      {#each sections as section}
        <a class="category-section-item" href={`/sections/${category}/${section.id}`}>
          <div class="thumbnail">
            {#if section.thumbnailurl}
              <CldImage width="300" height="300" src={section.thumbnailurl} alt="" crop="pad" />
            {/if}
          </div>
          <h3>{`Title: ${section.title}`}</h3>
        </a>
      {/each}
    </div>

    <a href="/sections">back</a>
  </div>
</section>

<style lang="less">
  .category-section-items {
    display: flex;
    flex-wrap: wrap;
    gap: 1em;
  }

  .category-section-item {
    display: flex;
    flex-direction: column;
    gap: 1em;
    width: (300/20em);

    .thumbnail {
      width: (300/20em);
      height: (300/20em);
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;
      position: relative;
    }
  }
</style>
