import supabase from '../src/config/supabase.js';

async function verifyEnrichment() {
  console.log('🔍 Vérification Finale de l\'Enrichissement\\n');
  console.log('═'.repeat(70) + '\\n');

  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at');

  if (error) {
    console.error('❌ Erreur:', error);
    return;
  }

  // Statistiques globales
  const total = posts.length;
  const enriched = posts.filter(p => p.content.length >= 10000);
  const superEnriched = posts.filter(p => p.content.length >= 20000);
  const avgLength = Math.round(posts.reduce((sum, p) => sum + p.content.length, 0) / posts.length);
  const avgReadTime = Math.round(posts.reduce((sum, p) => sum + (p.read_time || 10), 0) / posts.length);

  console.log('📊 STATISTIQUES GLOBALES\\n');
  console.log(`✅ Total d'articles : ${total}`);
  console.log(`✅ Articles enrichis (>10k chars) : ${enriched.length} (${Math.round(enriched.length/total*100)}%)`);
  console.log(`✅ Articles super enrichis (>20k chars) : ${superEnriched.length} (${Math.round(superEnriched.length/total*100)}%)`);
  console.log(`✅ Taille moyenne : ${avgLength.toLocaleString()} caractères`);
  console.log(`✅ Temps de lecture moyen : ${avgReadTime} minutes`);
  console.log('');

  // Top 10 articles les plus complets
  console.log('═'.repeat(70) + '\\n');
  console.log('🏆 TOP 10 ARTICLES LES PLUS COMPLETS\\n');

  const sorted = [...posts].sort((a, b) => b.content.length - a.content.length);
  sorted.slice(0, 10).forEach((post, i) => {
    console.log(`${i + 1}. ${post.title}`);
    console.log(`   📝 ${post.content.length.toLocaleString()} caractères`);
    console.log(`   ⏱️  ${post.read_time || 10} min de lecture`);
    console.log(`   🔗 Slug: ${post.slug}\\n`);
  });

  // Vérification contenu
  console.log('═'.repeat(70) + '\\n');
  console.log('✅ VÉRIFICATION QUALITÉ DU CONTENU\\n');

  let hasUseCase = 0;
  let hasCode = 0;
  let hasROI = 0;
  let hasTroubleshooting = 0;
  let hasBestPractices = 0;

  enriched.forEach(post => {
    if (post.content.includes('## 🎯 Use Case') || post.content.includes('Use Case')) hasUseCase++;
    if (post.content.includes('```')) hasCode++;
    if (post.content.includes('## ROI') || post.content.includes('ROI')) hasROI++;
    if (post.content.includes('Troubleshooting') || post.content.includes('## Troubleshooting')) hasTroubleshooting++;
    if (post.content.includes('Best Practices') || post.content.includes('## Best Practices')) hasBestPractices++;
  });

  console.log(`✅ Articles avec Use Case : ${hasUseCase}/${enriched.length} (${Math.round(hasUseCase/enriched.length*100)}%)`);
  console.log(`✅ Articles avec exemples de code : ${hasCode}/${enriched.length} (${Math.round(hasCode/enriched.length*100)}%)`);
  console.log(`✅ Articles avec section ROI : ${hasROI}/${enriched.length} (${Math.round(hasROI/enriched.length*100)}%)`);
  console.log(`✅ Articles avec Troubleshooting : ${hasTroubleshooting}/${enriched.length} (${Math.round(hasTroubleshooting/enriched.length*100)}%)`);
  console.log(`✅ Articles avec Best Practices : ${hasBestPractices}/${enriched.length} (${Math.round(hasBestPractices/enriched.length*100)}%)`);
  console.log('');

  // Articles à améliorer (si moins de 10k)
  const toImprove = posts.filter(p => p.content.length < 10000);
  if (toImprove.length > 0) {
    console.log('═'.repeat(70) + '\\n');
    console.log('⚠️  ARTICLES À AMÉLIORER (<10k caractères)\\n');
    toImprove.forEach(post => {
      console.log(`- ${post.title}`);
      console.log(`  Actuel: ${post.content.length} caractères (objectif: 10000+)\\n`);
    });
  }

  // Résumé final
  console.log('═'.repeat(70) + '\\n');
  console.log('🎉 RÉSUMÉ FINAL\\n');

  if (enriched.length >= 26) {
    console.log('✅ MISSION ACCOMPLIE ! Tous les 26 articles ciblés sont enrichis.\\n');
    console.log('📈 Performance:');
    console.log(`   - Croissance moyenne: +${Math.round((avgLength - 1316) / 1316 * 100)}%`);
    console.log(`   - Contenu ajouté: ${((avgLength - 1316) * enriched.length / 1000).toFixed(0)}k caractères`);
    console.log('');
    console.log('🎯 Qualité:');
    console.log(`   - ${Math.round(hasCode/enriched.length*100)}% ont du code pratique`);
    console.log(`   - ${Math.round(hasROI/enriched.length*100)}% ont une section ROI`);
    console.log(`   - ${Math.round(hasTroubleshooting/enriched.length*100)}% ont du troubleshooting`);
    console.log('');
    console.log('✨ Les articles sont prêts pour publication !\\n');
  } else {
    console.log(`⚠️  ${26 - enriched.length} articles restent à enrichir pour atteindre l'objectif.\\n`);
  }
}

verifyEnrichment().catch(console.error);