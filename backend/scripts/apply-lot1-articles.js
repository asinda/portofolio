import supabase from '../src/config/supabase.js';
import { lot1Articles } from '../database/enriched-articles/lot1-cloud-articles.js';

async function applyLot1Articles() {
    console.log('\n🚀 APPLICATION DU LOT 1 - 3 ARTICLES ENRICHIS\n');
    console.log('='.repeat(80));

    let successCount = 0;
    let errorCount = 0;

    for (const [slug, data] of Object.entries(lot1Articles)) {
        console.log(`\n📝 Mise à jour: ${slug}`);
        console.log(`   Longueur: ${data.content.length} caractères`);
        console.log(`   Temps lecture: ${data.read_time} min`);

        const { error } = await supabase
            .from('blog_posts')
            .update({
                content: data.content,
                read_time: data.read_time
            })
            .eq('slug', slug);

        if (error) {
            console.error(`   ❌ Erreur:`, error.message);
            errorCount++;
        } else {
            console.log(`   ✅ Enrichi avec succès!`);
            successCount++;
        }
    }

    console.log('\n' + '='.repeat(80));
    console.log(`\n📊 RÉSUMÉ LOT 1:`);
    console.log(`   ✅ Succès: ${successCount}`);
    console.log(`   ❌ Erreurs: ${errorCount}`);
    console.log(`\n✨ Lot 1 terminé!\n`);
}

applyLot1Articles().catch(console.error);
