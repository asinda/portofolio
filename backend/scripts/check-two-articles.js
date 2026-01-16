import supabase from '../src/config/supabase.js';

async function checkTwoArticles() {
    console.log('\n🔍 VÉRIFICATION DES 2 ARTICLES PROBLÉMATIQUES\n');
    console.log('='.repeat(80));

    const slugs = [
        'docker-security-hardening-best-practices',
        'azure-devops-aks-pipeline'
    ];

    for (const slug of slugs) {
        const { data: post, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) {
            console.error(`\n❌ Erreur pour ${slug}:`, error);
            continue;
        }

        console.log(`\n📄 ${post.title}`);
        console.log('─'.repeat(80));
        console.log(`Slug: ${post.slug}`);
        console.log(`Catégorie: ${post.category}`);
        console.log(`Cover Image: ${post.cover_image}`);
        console.log(`Status: ${post.status}`);
        console.log(`Published: ${post.published_at ? 'Oui' : 'Non'}`);
        console.log(`Longueur contenu: ${post.content.length} caractères`);
        console.log(`Read time: ${post.read_time} min`);

        // Vérifier si le fichier image existe
        const imagePath = `C:/Users/ASINDAYIGAYA/Documents/projet/portofolio/frontend/public${post.cover_image}`;
        console.log(`\nChemin image: ${imagePath}`);

        const fs = await import('fs');
        if (fs.existsSync(imagePath)) {
            const stats = fs.statSync(imagePath);
            console.log(`✅ Fichier existe (${stats.size} octets)`);
        } else {
            console.log(`❌ FICHIER N'EXISTE PAS !`);
        }
    }

    console.log('\n' + '='.repeat(80));
    console.log('\n✨ Vérification terminée\n');
}

checkTwoArticles().catch(console.error);
