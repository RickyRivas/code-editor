// src/routes/sections/[category]/+page.js

import { createClient } from '@supabase/supabase-js';
import { error, redirect } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

const table = 'code_snippets'
const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY)
export async function load({ params }) {

    const category = params.category

    try {
        const { data: sections, error: snippetsError } = await supabase
            .from(table)
            .select('*')
            .eq('type', 'section')
            .eq('category', category);

        if (snippetsError) {
            throw error(500, 'Error fetching snippets from database');
        }

        if (sections.length === 0) {
            throw error(404, `No snippets found for category '${ category }'`);
        }

        // Fetch all unique categories

        const { data: categoriesData, error: categoriesError } = await supabase
            .from(table)
            .select('category')
            .eq('type', 'section')
            .order('category')

        if (categoriesError) {
            throw error(500, 'Error fetching categories from database');
        }

        const allCategories = [ ...new Set(categoriesData.map(item => item.category)) ]

        return {
            allCategories,
            category,
            sections
        };
    } catch (err) {
        redirect(303, '/sections')
    }

}