async function findPosition() {
    const response = await fetch('http://localhost:5000/api/blog/posts?limit=100');
    const data = await response.json();

    console.log('\n📍 POSITION DES ARTICLES DANS LA LISTE\n');
    console.log('='.repeat(80));

    data.data.forEach((p, index) => {
        if (p.slug === 'docker-security-hardening-best-practices') {
            console.log(`\n🔴 Docker Security`);
            console.log(`   Position: ${index + 1}/28`);
            console.log(`   Slug: ${p.slug}`);
            console.log(`   Image: ${p.cover_image}`);
        }
        if (p.slug === 'azure-devops-aks-pipeline') {
            console.log(`\n🔵 Azure DevOps`);
            console.log(`   Position: ${index + 1}/28`);
            console.log(`   Slug: ${p.slug}`);
            console.log(`   Image: ${p.cover_image}`);
        }
    });

    console.log('\n' + '='.repeat(80));
    console.log('\n💡 EXPLICATION:');
    console.log('Si les articles sont en position 11+, ils ne s\'affichent pas');
    console.log('immédiatement car le navigateur charge les images lazy (paresseusement).');
    console.log('\nSOLUTION: Scroller vers le bas sur la page blog pour charger ces articles.\n');
}

findPosition().catch(console.error);
