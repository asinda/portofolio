import supabase from '../src/config/supabase.js';

async function checkArticlesCompleteness() {
    const { data: posts, error } = await supabase
        .from('blog_posts')
        .select('title, slug, content, excerpt')
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Erreur:', error);
        return;
    }

    console.log(`\n📊 VÉRIFICATION DE ${posts.length} ARTICLES\n`);
    console.log('='.repeat(80));

    posts.forEach((post, i) => {
        const contentLength = post.content.length;
        const hasIntro = post.content.includes('## 🎯 Use Case');
        const hasCode = post.content.includes('```');
        const hasROI = post.content.includes('## ROI');

        // Vérifier si le contenu se termine proprement (pas tronqué)
        const endsWell = !post.content.endsWith('..') &&
                        !post.content.endsWith('```\r\n\r\n##');

        const isComplete = contentLength > 500 && hasIntro && hasCode && hasROI && endsWell;

        console.log(`\n${i + 1}. ${post.title}`);
        console.log(`   Slug: ${post.slug}`);
        console.log(`   Longueur: ${contentLength} caractères`);
        console.log(`   ✓ Intro (Use Case): ${hasIntro ? '✅' : '❌'}`);
        console.log(`   ✓ Code examples: ${hasCode ? '✅' : '❌'}`);
        console.log(`   ✓ Section ROI: ${hasROI ? '✅' : '❌'}`);
        console.log(`   ✓ Fin propre: ${endsWell ? '✅' : '❌'}`);
        console.log(`   📝 STATUT: ${isComplete ? '✅ COMPLET' : '⚠️ INCOMPLET'}`);

        if (!isComplete) {
            console.log(`   📄 Dernières 150 caractères:`);
            console.log(`   "${post.content.substring(post.content.length - 150)}"`);
        }
    });

    const completeCount = posts.filter(p =>
        p.content.length > 500 &&
        p.content.includes('## 🎯 Use Case') &&
        p.content.includes('```') &&
        p.content.includes('## ROI')
    ).length;

    console.log('\n' + '='.repeat(80));
    console.log(`\n📈 RÉSUMÉ: ${completeCount}/${posts.length} articles complets`);
    console.log(`⚠️  ${posts.length - completeCount} articles incomplets à corriger\n`);
}

checkArticlesCompleteness().catch(console.error);
