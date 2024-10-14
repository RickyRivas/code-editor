
export function findPage(business, url) {
    // Page check
    let thisPage
    let isTopLevelPage = business.interiorPages.find((p) => p.path === url)
    if (!isTopLevelPage) {
        const pagesWithSubPages = business.interiorPages.filter((p) => p.subPages)
        const pageImLookingFor = url;
        for (const pageWithSubPage of pagesWithSubPages) {
            const children = pageWithSubPage.subPages
            for (const child of children) {
                if (child.path === pageImLookingFor) {
                    thisPage = child
                }
            }
        }
    } else {
        thisPage = isTopLevelPage
    }

    return thisPage
}

export function formatDate(date) {
    return new Date(date).toLocaleDateString("en-us", {
        year: "numeric",
        month: "long",
        day: "numeric",
    })
}

export const fetchMarkdownPosts = async () => {
    // grabbing mds from our lib folder
    const blogPostsPath = '/src/lib/blogposts/'
    const blogMarkdownFiles = import.meta.glob('/src/lib/blogposts/*.md');
    const files = Object.entries(blogMarkdownFiles);

    const posts = await Promise.all(
        files.map(async ([ postpath, resolver ]) => {
            const { metadata: postData } = await resolver();
            const path = postpath.split(blogPostsPath)[ 1 ];

            return {
                postData,
                path
            };
        })
    );
    // most recent to least recent
    return posts.sort((a, b) => Date.parse(b.postData.date) - Date.parse(a.postData.date))
};

export const fetchNewsMarkdownPosts = async (limit) => {
    console.log('util:', limit)
    // grabbing mds from our lib folder
    const newsPostsPath = '/src/lib/newsposts/'
    const newsMarkdownFiles = import.meta.glob('/src/lib/newsposts/*.md');
    const files = Object.entries(newsMarkdownFiles);

    const posts = await Promise.all(
        files.map(async ([ postpath, resolver ]) => {
            const data = await resolver()
            const { metadata: postData } = data
            const Content = data.default.render()
            const path = postpath.split(newsPostsPath)[ 1 ];

            return {
                postData,
                path,
                Content
            };
        })
    );
    // most recent to least recent
    return posts.sort((a, b) => Date.parse(b.postData.date) - Date.parse(a.postData.date))
};


export function clearStepThreeErrors() {
    for (const input of document.querySelectorAll(`.step-three input`)) {
        input.classList.remove("error")
        input.dataset.errorMessage = ""
    }
}

export function addStepThreeErrors(errors) {
    for (const { message, selector } of errors) {
        const selectedInput = document.querySelector(`.step-three input[name="${ selector }"]`)
        selectedInput?.classList.add("error")
        selectedInput.dataset.errorMessage = message
    }
}

export function noNestedObjects(data) {
    let master = {}

    for (const [ key, value ] of Object.entries(data)) {
        if (typeof value === "object") {
            for (const [ subkey, subvalue ] of Object.entries(value)) {
                if (typeof subvalue === "object") {
                    for (const [ subsubkey, subsubvalue ] of Object.entries(subvalue)) {
                        master[ `${ subkey }${ subsubkey }` ] = subsubvalue
                    }
                } else {
                    master[ `${ key }${ subkey }` ] = subvalue
                }
            }
        } else {
            master[ key ] = value
        }
    }
    return master
}

// Function to update fields with fetched data
export function updateFieldsWithFetchedData(fields, fetchedData) {
    return fields.map((field) => {
        if (fetchedData.hasOwnProperty(field.name)) {
            return { ...field, value: fetchedData[ field.name ] }
        }
        return field
    })
}

// Function to update snippet with fetched data
export function updateSnippetWithFetchedData(snippet, fetchedData) {
    return {
        ...snippet,
        ...Object.fromEntries(Object.entries(fetchedData).filter(([ key ]) => key in snippet)),
    }
}

export function extractUnqiqueCategoriesWithCounts(snippets) {
    // Use an object to store categories and their counts
    const categoryCountMap = {}

    snippets.forEach((snippet) => {
        if (snippet.category) {
            if (categoryCountMap[ snippet.category ]) {
                categoryCountMap[ snippet.category ]++
            } else {
                categoryCountMap[ snippet.category ] = 1
            }
        }
    })

    // Convert the map to an array of objects and sort by category name
    return Object.entries(categoryCountMap)
        .map(([ category, count ]) => ({ category, count }))
        .sort((a, b) => a.category.localeCompare(b.category))
}