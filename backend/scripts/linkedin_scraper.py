#!/usr/bin/env python3
"""
Script de scraping LinkedIn pour Portfolio

⚠️ AVERTISSEMENT IMPORTANT ⚠️
-------------------------------
Le scraping de LinkedIn peut violer les conditions d'utilisation de LinkedIn.
LinkedIn interdit explicitement le scraping automatisé dans ses CGU.

ALTERNATIVES RECOMMANDÉES :
1. Télécharger vos données via LinkedIn Data Export (GDPR)
2. Utiliser l'API officielle LinkedIn (nécessite OAuth)
3. Saisir manuellement vos données dans data.json

Ce script est fourni à des fins ÉDUCATIVES uniquement.
Utilisez-le UNIQUEMENT pour votre propre profil public.

MÉTHODE LÉGALE RECOMMANDÉE :
→ Voir le fichier LINKEDIN_DATA_EXPORT.md
"""

import json
import sys
import argparse
from urllib.parse import urlparse

# Vérifier les dépendances
try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    print("❌ Dépendances manquantes. Installez-les avec :")
    print("   pip install requests beautifulsoup4")
    sys.exit(1)


class LinkedInProfileExtractor:
    """
    Extracteur de profil LinkedIn public

    ⚠️ LIMITATIONS :
    - Fonctionne uniquement sur les profils publics
    - LinkedIn bloque souvent les requêtes automatisées
    - Les données peuvent être incomplètes
    - Peut cesser de fonctionner à tout moment
    """

    def __init__(self, profile_url):
        self.profile_url = profile_url
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
        }
        self.data = {}

    def extract(self):
        """
        Extrait les données du profil

        Note: Cette méthode est très limitée car LinkedIn
        charge la plupart du contenu via JavaScript.
        """
        print(f"🔍 Tentative d'extraction depuis : {self.profile_url}")
        print("⚠️  LinkedIn bloque généralement ce type de requête...")

        try:
            response = requests.get(self.profile_url, headers=self.headers, timeout=10)

            if response.status_code == 999:
                print("\n❌ LinkedIn a bloqué la requête (code 999)")
                print("💡 Solution : Utilisez la méthode GDPR Data Export (voir LINKEDIN_DATA_EXPORT.md)")
                return None

            if response.status_code != 200:
                print(f"\n❌ Erreur HTTP {response.status_code}")
                return None

            soup = BeautifulSoup(response.content, 'html.parser')

            # Tentative d'extraction (très limitée)
            self.data = {
                'profile': {
                    'name': self._extract_name(soup),
                    'title': self._extract_title(soup),
                    'location': self._extract_location(soup),
                    'linkedin': self.profile_url,
                    'about': ''
                }
            }

            print("\n✅ Extraction partielle réussie (données limitées)")
            print("💡 Pour des données complètes, utilisez LinkedIn Data Export")

            return self.data

        except requests.RequestException as e:
            print(f"\n❌ Erreur de connexion : {e}")
            return None

    def _extract_name(self, soup):
        """Tente d'extraire le nom"""
        # LinkedIn change souvent ses sélecteurs
        selectors = [
            'h1.top-card-layout__title',
            'h1.text-heading-xlarge',
            '.pv-text-details__left-panel h1'
        ]

        for selector in selectors:
            element = soup.select_one(selector)
            if element:
                return element.get_text().strip()

        return "Nom non trouvé"

    def _extract_title(self, soup):
        """Tente d'extraire le titre"""
        selectors = [
            'div.top-card-layout__headline',
            '.text-body-medium',
            '.pv-text-details__left-panel .text-body-medium'
        ]

        for selector in selectors:
            element = soup.select_one(selector)
            if element:
                return element.get_text().strip()

        return "Titre non trouvé"

    def _extract_location(self, soup):
        """Tente d'extraire la localisation"""
        selectors = [
            'span.top-card__subline-item',
            '.pv-text-details__left-panel .text-body-small'
        ]

        for selector in selectors:
            element = soup.select_one(selector)
            if element:
                return element.get_text().strip()

        return "Localisation non trouvée"

    def save_to_json(self, output_file='linkedin_data.json'):
        """Sauvegarde les données extraites en JSON"""
        if not self.data:
            print("❌ Aucune donnée à sauvegarder")
            return False

        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(self.data, f, indent=2, ensure_ascii=False)

        print(f"\n✅ Données sauvegardées dans : {output_file}")
        return True


def main():
    parser = argparse.ArgumentParser(
        description='Extraction de profil LinkedIn (ÉDUCATIF UNIQUEMENT)',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
⚠️  AVERTISSEMENT ⚠️
Ce script peut violer les CGU de LinkedIn.

MÉTHODES ALTERNATIVES RECOMMANDÉES :
1. LinkedIn Data Export (GDPR) - LÉGAL et COMPLET
   → Voir LINKEDIN_DATA_EXPORT.md

2. API officielle LinkedIn
   → Nécessite OAuth et approbation

3. Saisie manuelle dans data.json

Exemple d'utilisation :
  python linkedin_scraper.py https://www.linkedin.com/in/alicesindayigaya
        """
    )

    parser.add_argument('profile_url', help='URL du profil LinkedIn')
    parser.add_argument('-o', '--output', default='linkedin_data.json',
                       help='Fichier de sortie JSON (défaut: linkedin_data.json)')

    args = parser.parse_args()

    # Validation de l'URL
    parsed = urlparse(args.profile_url)
    if 'linkedin.com' not in parsed.netloc:
        print("❌ URL invalide. Doit être une URL LinkedIn.")
        sys.exit(1)

    print("\n" + "="*60)
    print("  SCRAPER LINKEDIN - À DES FINS ÉDUCATIVES UNIQUEMENT")
    print("="*60)
    print("\n⚠️  Ce script a de fortes chances d'échouer.")
    print("💡 Méthode recommandée : LinkedIn Data Export (GDPR)")
    print("   Voir le fichier LINKEDIN_DATA_EXPORT.md\n")

    input("Appuyez sur Entrée pour continuer (Ctrl+C pour annuler)...")

    # Extraction
    extractor = LinkedInProfileExtractor(args.profile_url)
    data = extractor.extract()

    if data:
        extractor.save_to_json(args.output)
        print("\n📝 Prochaines étapes :")
        print("   1. Vérifiez les données dans", args.output)
        print("   2. Complétez manuellement les informations manquantes")
        print("   3. Importez dans votre portfolio")
    else:
        print("\n❌ Échec de l'extraction")
        print("\n💡 Utilisez plutôt LinkedIn Data Export :")
        print("   1. Allez sur LinkedIn > Paramètres > Confidentialité")
        print("   2. 'Obtenir une copie de vos données'")
        print("   3. Téléchargez l'archive")
        print("   4. Utilisez le script linkedin_import.py")


if __name__ == '__main__':
    main()
