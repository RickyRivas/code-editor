import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY
)

let table = 'code_snippets'

function stripFormatting(snippet, language) {

    if (language === 'css' || language === 'less' || language === 'javascript') {
        return snippet
            .split('\n')
            .map(line => {
                line = line.trim();
                if (line.startsWith('//')) {
                    // Preserve comments
                    return line;
                } else {
                    // For non-comment lines, remove extra spaces
                    return line
                        .replace(/\s+/g, ' ')
                        .replace(/:\s/g, ':')
                        .replace(/\{\s/g, '{')
                        .replace(/\s\}/g, '}')
                        .replace(/;\s/g, ';')
                        .replace(/,\s/g, ',')
                        .trim();
                }
            })
            .join('\n')
            .replace(/\n+/g, '\n') // Replace multiple newlines with a single newline
            .trim();
    } else {
        // For HTML and JavaScript, use the original stripping logic
        return snippet
            .replace(/\s+/g, ' ')
            .replace(/:\s/g, ':')
            .replace(/\{\s/g, '{')
            .replace(/\s\}/g, '}')
            .replace(/;\s/g, ';')
            .replace(/,\s/g, ',')
            .trim();
    }
}

function flattenAndStripCodeObject(code) {
    const { fields, snippet } = code

    const fieldMap = Object.fromEntries(
        fields.map(field => [ field.name, field.value ])
    )

    // Define the fields to extract and process
    const fieldsToExtract = [ 'title', 'description', 'type', 'thumbnailurl', 'favorite' ];

    // Create the result object
    const result = Object.fromEntries(
        fieldsToExtract.map(fieldName => [
            fieldName,
            fieldName === 'favorite' ? fieldMap[ fieldName ] : (fieldMap[ fieldName ] || '').trim()
        ])
    )

    // Process snippet fields
    const snippetLangs = [ 'html', 'css', 'javascript' ]
    snippetLangs.forEach(lang => {
        result[ lang ] = stripFormatting(snippet[ lang ] || '', lang);
    });

    return result;
}

export async function saveOrUpdateCodeInSupabase(code) {
    try {
        const flattenedCode = flattenAndStripCodeObject(code)
        let result

        if (code.id) {
            // id will be true if we're updating an exisiting snippet
            const { data, error } = await supabase
                .from(table)
                .update(flattenedCode)
                .eq('id', code.id)
                .select()

            if (error) throw error
            result = data[ 0 ]
            console.log('Code updated successfully:', result)
        }
        else {
            // add a new snippet
            const { data, error } = await supabase
                .from(table)
                .insert(flattenedCode)
                .select()

            if (error) throw error
            result = data[ 0 ]
            console.log('New code saved successfully:', result)
        }
    } catch (error) {
        console.error('Error saving/updating code:', error.message)
        throw error
    }
}

export async function getCodeFromSupabase(id) {
    try {
        const { data, error } = await supabase
            .from(table)
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error

        if (!data) {
            throw new Error('Snippet not found.')
        }

        return {
            fetchedId: data.id,
            fetchedFields: {
                title: data.title,
                description: data.description,
                type: data.type,
                thumbnailurl: data.thumbnailurl,
                favorite: data.favorite
            },
            fetchedSnippet: {
                html: data.html,
                css: data.css,
                javascript: data.javascript,
            }
        }
    } catch (error) {
        console.error('Error fetching code:', error.message)
        throw error
    }
}