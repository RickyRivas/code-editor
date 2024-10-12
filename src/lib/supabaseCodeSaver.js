import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY
)

export async function saveCodeToSupabase(code) {
    try {
        const { data, error } = await supabase
            .from('snippets') // Replace with your actual table name
            .insert({
                title: code.metadata.title,
                description: code.metadata.description,
                type: code.metadata.type,
                html: code.langs.html,
                css: code.langs.css,
                javascript: code.langs.javascript
            })
            .select()

        if (error) throw error

        console.log('Code saved successfully:', data)
        return data
    } catch (error) {
        console.error('Error saving code:', error.message)
        throw error
    }
}