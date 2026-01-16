async function checkAPIResponse() {
    const response = await fetch('http://localhost:5000/api/blog/posts?limit=100');
    const data = await response.json();

    console.log('\n📊 ANALYSE DE LA RÉPONSE API\n');
    console.log('='.repeat(80));
    console.log(`Total articles retournés: ${data.data.length}`);

    console.log('\n🔍 Recherche des 2 articles problématiques:');
    console.log('-'.repeat(80));

    const docker = data.data.find(p => p.slug && p.slug.includes('docker-security'));
    console.log('\n1. Docker Security:');
    if (docker) {
        console.log(`   ✅ TROUVÉ`);
        console.log(`   Titre: ${docker.title}`);
        console.log(`   Slug: ${docker.slug}`);
        console.log(`   Cover: ${docker.cover_image}`);
        console.log(`   Category: ${docker.category}`);
        console.log(`   Status: ${docker.status}`);
    } else {
        console.log('   ❌ NON TROUVÉ dans l\'API');
    }

    const azure = data.data.find(p => p.slug && p.slug.includes('azure-devops'));
    console.log('\n2. Azure DevOps:');
    if (azure) {
        console.log(`   ✅ TROUVÉ`);
        console.log(`   Titre: ${azure.title}`);
        console.log(`   Slug: ${azure.slug}`);
        console.log(`   Cover: ${azure.cover_image}`);
        console.log(`   Category: ${azure.category}`);
        console.log(`   Status: ${azure.status}`);
    } else {
        console.log('   ❌ NON TROUVÉ dans l\'API');
    }

    console.log('\n📋 Liste des 10 premiers articles:');
    console.log('-'.repeat(80));
    data.data.slice(0, 10).forEach((p, i) => {
        console.log(`${i+1}. ${p.slug}`);
        console.log(`   Image: ${p.cover_image}`);
    });

    console.log('\n' + '='.repeat(80));
}

checkAPIResponse().catch(console.error);
