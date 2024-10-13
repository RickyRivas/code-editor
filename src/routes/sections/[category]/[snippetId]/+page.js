// src/routes/sections/[category]/+page.js

import { error, redirect } from '@sveltejs/kit';
import { getCodeFromSupabase } from '$lib/supabaseCodeSaver';

export async function load({ params }) {

    const snippetId = params.snippetId
    try {
        const snippet = await getCodeFromSupabase(snippetId)

        return { success: true, snippet }
    } catch (err) {
        redirect(303, '/sections')
    }
}