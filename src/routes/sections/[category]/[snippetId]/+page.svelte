<script>
  import { PUBLIC_CLOUDINARY_CLOUD_NAME } from "$env/static/public"
  import { CldImage, configureCloudinary } from "svelte-cloudinary"

  export let data
  const { fetchedFields, fetchedId, fetchedSnippet } = data.snippet

  // configure cloudinary for image upload widget
  configureCloudinary({
    cloudName: PUBLIC_CLOUDINARY_CLOUD_NAME,
  })

  console.log(data)
</script>

<section>
  <div class="container">
    <h2>section id: {fetchedId}</h2>
    <a href="/sections/{fetchedFields.category}">back</a>
  </div>
</section>
