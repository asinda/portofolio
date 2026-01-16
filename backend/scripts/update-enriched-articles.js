import supabase from '../src/config/supabase.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function updateEnrichedArticles() {
    console.log('\n🚀 MISE À JOUR DES ARTICLES ENRICHIS\n');
    console.log('='.repeat(80));

    // Article 1: Docker Security
    const dockerPath = path.join(__dirname, '../database/enriched-articles/01-docker-security-enriched.sql');
    const dockerSql = fs.readFileSync(dockerPath, 'utf8');

    // Extraire contenu entre $BODY$ et $BODY$
    const dockerMatch = dockerSql.match(/\$BODY\$([\s\S]*?)\$BODY\$/);

    if (!dockerMatch) {
        console.error('❌ Impossible d\'extraire le contenu Docker');
        return;
    }

    const dockerContent = dockerMatch[1].trim();
    console.log('\n📝 Article 1: Docker Security');
    console.log(`   Longueur: ${dockerContent.length} caractères`);
    console.log(`   Premières 100 caractères: ${dockerContent.substring(0, 100)}...`);

    const { error: dockerError } = await supabase
        .from('blog_posts')
        .update({
            content: dockerContent,
            read_time: 12
        })
        .eq('slug', 'docker-security-hardening-best-practices');

    if (dockerError) {
        console.error('❌ Erreur Docker:', dockerError);
    } else {
        console.log('✅ Article Docker Security enrichi avec succès!');
    }

    // Article 2: Azure DevOps
    const azurePath = path.join(__dirname, '../database/enriched-articles/02-azure-devops-aks-enriched.sql');
    const azureSql = fs.readFileSync(azurePath, 'utf8');

    const azureMatch = azureSql.match(/\$BODY\$([\s\S]*?)\$BODY\$/);

    if (!azureMatch) {
        console.error('❌ Impossible d\'extraire le contenu Azure');
        return;
    }

    const azureContent = azureMatch[1].trim();
    console.log('\n📝 Article 2: Azure DevOps + AKS');
    console.log(`   Longueur: ${azureContent.length} caractères`);
    console.log(`   Premières 100 caractères: ${azureContent.substring(0, 100)}...`);

    const { error: azureError } = await supabase
        .from('blog_posts')
        .update({
            content: azureContent,
            read_time: 15
        })
        .eq('slug', 'azure-devops-aks-pipeline');

    if (azureError) {
        console.error('❌ Erreur Azure:', azureError);
    } else {
        console.log('✅ Article Azure DevOps enrichi avec succès!');
    }

    // Vérifier les mises à jour
    console.log('\n' + '='.repeat(80));
    console.log('\n🔍 VÉRIFICATION DES ARTICLES MIS À JOUR\n');

    const { data: posts, error: verifyError } = await supabase
        .from('blog_posts')
        .select('title, slug, content, read_time')
        .in('slug', ['docker-security-hardening-best-practices', 'azure-devops-aks-pipeline']);

    if (verifyError) {
        console.error('❌ Erreur vérification:', verifyError);
    } else {
        posts.forEach(post => {
            console.log(`\n📄 ${post.title}`);
            console.log(`   Slug: ${post.slug}`);
            console.log(`   Longueur: ${post.content.length} caractères`);
            console.log(`   Temps de lecture: ${post.read_time} min`);
            console.log(`   ✅ Statut: ${post.content.length > 3000 ? 'ENRICHI' : 'COURT'}`);
        });
    }

    console.log('\n' + '='.repeat(80));
    console.log('\n✨ Mise à jour terminée!\n');
}

updateEnrichedArticles().catch(console.error);
