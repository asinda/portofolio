import supabase from '../src/config/supabase.js';

async function showArticleContent() {
    // Récupérer quelques articles pour vérifier le contenu
    const slugs = [
        'docker-security-hardening-best-practices',
        'azure-devops-aks-pipeline',
        'gcp-cloud-run-serverless'
    ];

    for (const slug of slugs) {
        const { data: post, error } = await supabase
            .from('blog_posts')
            .select('title, slug, content')
            .eq('slug', slug)
            .single();

        if (error) {
            console.error('Erreur:', error);
            continue;
        }

        console.log('\n' + '='.repeat(80));
        console.log(`📄 ${post.title}`);
        console.log('='.repeat(80));
        console.log(`Longueur: ${post.content.length} caractères\n`);
        console.log(post.content);
        console.log('\n' + '='.repeat(80) + '\n');
    }
}

showArticleContent().catch(console.error);
