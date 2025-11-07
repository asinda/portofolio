#!/usr/bin/env python3
"""
Convertisseur de données LinkedIn Export vers format Portfolio

Ce script convertit les fichiers CSV de l'export LinkedIn (GDPR)
vers le format JSON utilisé par le portfolio.

Usage:
    python linkedin_import.py /chemin/vers/Basic_LinkedInDataExport_XX-XX-XXXX

Fichiers CSV attendus:
    - Profile.csv
    - Positions.csv
    - Education.csv
    - Skills.csv
    - Certifications.csv
    - (optionnels: Languages.csv, Projects.csv)
"""

import os
import sys
import json
import csv
from pathlib import Path
from datetime import datetime

# Vérifier pandas
try:
    import pandas as pd
except ImportError:
    print("❌ pandas est requis. Installez avec : pip install pandas")
    sys.exit(1)


class LinkedInDataConverter:
    """Convertit les données LinkedIn Export en format Portfolio"""

    def __init__(self, export_dir):
        self.export_dir = Path(export_dir)
        self.portfolio_data = {
            'profile': {},
            'experience': [],
            'education': [],
            'skills': {
                'technical': [],
                'languages': [],
                'soft': []
            },
            'projects': [],
            'certifications': []
        }

    def convert(self):
        """Convertit tous les fichiers CSV"""
        print("🔄 Conversion des données LinkedIn...\n")

        # Profil
        if self._file_exists('Profile.csv'):
            print("📝 Conversion du profil...")
            self._convert_profile()

        # Expérience
        if self._file_exists('Positions.csv'):
            print("💼 Conversion de l'expérience professionnelle...")
            self._convert_positions()

        # Formation
        if self._file_exists('Education.csv'):
            print("🎓 Conversion de la formation...")
            self._convert_education()

        # Compétences
        if self._file_exists('Skills.csv'):
            print("⚡ Conversion des compétences...")
            self._convert_skills()

        # Certifications
        if self._file_exists('Certifications.csv'):
            print("🏆 Conversion des certifications...")
            self._convert_certifications()

        # Langues (optionnel)
        if self._file_exists('Languages.csv'):
            print("🌍 Conversion des langues...")
            self._convert_languages()

        # Projets (optionnel)
        if self._file_exists('Projects.csv'):
            print("🚀 Conversion des projets...")
            self._convert_projects()

        print("\n✅ Conversion terminée !")
        return self.portfolio_data

    def _file_exists(self, filename):
        """Vérifie si un fichier existe"""
        return (self.export_dir / filename).exists()

    def _read_csv(self, filename):
        """Lit un fichier CSV"""
        file_path = self.export_dir / filename
        try:
            return pd.read_csv(file_path, encoding='utf-8')
        except UnicodeDecodeError:
            # Essayer avec un autre encodage
            return pd.read_csv(file_path, encoding='latin-1')

    def _convert_profile(self):
        """Convertit Profile.csv"""
        df = self._read_csv('Profile.csv')

        if len(df) > 0:
            row = df.iloc[0]
            self.portfolio_data['profile'] = {
                'name': self._get_value(row, 'First Name', '') + ' ' + self._get_value(row, 'Last Name', ''),
                'title': self._get_value(row, 'Headline', 'Professionnel'),
                'location': self._get_value(row, 'Geo Location', 'France'),
                'email': self._get_value(row, 'Email Address', 'email@example.com'),
                'phone': '+33 X XX XX XX XX',  # À compléter manuellement
                'linkedin': 'https://www.linkedin.com/in/' + self._get_value(row, 'Public Profile URL', '').split('/')[-1],
                'github': '',  # À compléter manuellement
                'website': self._get_value(row, 'Websites', ''),
                'photo': 'images/profile.jpg',
                'about': self._get_value(row, 'Summary', 'À propos de moi...')
            }

    def _convert_positions(self):
        """Convertit Positions.csv"""
        df = self._read_csv('Positions.csv')

        for _, row in df.iterrows():
            # Déterminer si le poste est actuel
            ends_at = self._get_value(row, 'Finished On', '')
            is_current = ends_at == '' or pd.isna(ends_at)

            # Formater les dates
            start_date = self._format_linkedin_date(self._get_value(row, 'Started On', ''))
            end_date = 'Présent' if is_current else self._format_linkedin_date(ends_at)

            position = {
                'position': self._get_value(row, 'Title', 'Poste'),
                'company': self._get_value(row, 'Company Name', 'Entreprise'),
                'location': self._get_value(row, 'Location', ''),
                'startDate': start_date,
                'endDate': end_date,
                'current': is_current,
                'description': self._get_value(row, 'Description', ''),
                'achievements': []  # À compléter manuellement
            }

            self.portfolio_data['experience'].append(position)

    def _convert_education(self):
        """Convertit Education.csv"""
        df = self._read_csv('Education.csv')

        for _, row in df.iterrows():
            start_date = self._format_linkedin_date(self._get_value(row, 'Start Date', ''), year_only=True)
            end_date = self._format_linkedin_date(self._get_value(row, 'End Date', ''), year_only=True)

            education = {
                'degree': self._get_value(row, 'Degree Name', 'Diplôme'),
                'institution': self._get_value(row, 'School Name', 'Établissement'),
                'location': '',  # Non fourni par LinkedIn
                'startDate': start_date,
                'endDate': end_date,
                'description': self._get_value(row, 'Notes', '')
            }

            self.portfolio_data['education'].append(education)

    def _convert_skills(self):
        """Convertit Skills.csv"""
        df = self._read_csv('Skills.csv')

        for _, row in df.iterrows():
            skill_name = self._get_value(row, 'Name', '')

            if skill_name:
                # Toutes les compétences vont dans 'technical'
                # Vous pouvez les réorganiser manuellement après
                skill = {
                    'name': skill_name,
                    'level': 'Intermédiaire',  # LinkedIn ne fournit pas le niveau
                    'category': 'technical'
                }

                self.portfolio_data['skills']['technical'].append(skill)

    def _convert_certifications(self):
        """Convertit Certifications.csv"""
        df = self._read_csv('Certifications.csv')

        for _, row in df.iterrows():
            start_date = self._format_linkedin_date(self._get_value(row, 'Started On', ''))

            certification = {
                'name': self._get_value(row, 'Name', 'Certification'),
                'issuer': self._get_value(row, 'Authority', 'Organisme'),
                'date': start_date,
                'url': self._get_value(row, 'Url', ''),
                'description': ''
            }

            self.portfolio_data['certifications'].append(certification)

    def _convert_languages(self):
        """Convertit Languages.csv (optionnel)"""
        df = self._read_csv('Languages.csv')

        for _, row in df.iterrows():
            language = {
                'name': self._get_value(row, 'Name', 'Langue'),
                'level': self._get_value(row, 'Proficiency', 'Intermédiaire')
            }

            self.portfolio_data['skills']['languages'].append(language)

    def _convert_projects(self):
        """Convertit Projects.csv (optionnel)"""
        if not self._file_exists('Projects.csv'):
            return

        df = self._read_csv('Projects.csv')

        for _, row in df.iterrows():
            start_date = self._format_linkedin_date(self._get_value(row, 'Started On', ''))
            end_date = self._format_linkedin_date(self._get_value(row, 'Finished On', ''))

            project = {
                'title': self._get_value(row, 'Title', 'Projet'),
                'description': self._get_value(row, 'Description', ''),
                'startDate': start_date,
                'endDate': end_date,
                'url': self._get_value(row, 'Url', ''),
                'image': 'images/project-placeholder.jpg',
                'technologies': [],  # À compléter manuellement
                'category': 'Professionnel'
            }

            self.portfolio_data['projects'].append(project)

    def _get_value(self, row, key, default=''):
        """Récupère une valeur en gérant les valeurs manquantes"""
        try:
            value = row.get(key, default)
            if pd.isna(value):
                return default
            return str(value).strip()
        except:
            return default

    def _format_linkedin_date(self, date_str, year_only=False):
        """Formate une date LinkedIn (YYYY-MM-DD) vers un format lisible"""
        if not date_str or pd.isna(date_str):
            return ''

        try:
            parts = str(date_str).split('-')
            if len(parts) >= 1:
                year = parts[0]
                if year_only:
                    return year

                if len(parts) >= 2:
                    month = int(parts[1])
                    months_fr = ['', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                                'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
                    return f"{months_fr[month]} {year}"

                return year
        except:
            pass

        return str(date_str)

    def save_to_json(self, output_file='portfolio_data.json'):
        """Sauvegarde les données converties"""
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(self.portfolio_data, f, indent=2, ensure_ascii=False)

        print(f"\n💾 Données sauvegardées dans : {output_file}")


def main():
    if len(sys.argv) < 2:
        print("❌ Usage: python linkedin_import.py /chemin/vers/Basic_LinkedInDataExport_XX-XX-XXXX")
        print("\n💡 Pour obtenir vos données LinkedIn :")
        print("   Voir le guide : docs/LINKEDIN_DATA_EXPORT.md")
        sys.exit(1)

    export_dir = sys.argv[1]

    if not os.path.isdir(export_dir):
        print(f"❌ Le dossier n'existe pas : {export_dir}")
        sys.exit(1)

    print("="*60)
    print("  CONVERSION LINKEDIN EXPORT → PORTFOLIO")
    print("="*60)
    print(f"\n📁 Dossier source : {export_dir}\n")

    # Vérifier les fichiers requis
    required_files = ['Profile.csv', 'Positions.csv']
    missing = [f for f in required_files if not os.path.exists(os.path.join(export_dir, f))]

    if missing:
        print(f"⚠️  Fichiers manquants : {', '.join(missing)}")
        print("💡 Vérifiez que vous avez bien sélectionné ces catégories lors de l'export")
        print()

    # Conversion
    converter = LinkedInDataConverter(export_dir)
    data = converter.convert()

    # Sauvegarde
    output_file = 'portfolio_data.json'
    converter.save_to_json(output_file)

    # Statistiques
    print("\n📊 Statistiques :")
    print(f"   • Expériences : {len(data['experience'])}")
    print(f"   • Formations : {len(data['education'])}")
    print(f"   • Compétences : {len(data['skills']['technical'])}")
    print(f"   • Langues : {len(data['skills']['languages'])}")
    print(f"   • Certifications : {len(data['certifications'])}")
    print(f"   • Projets : {len(data['projects'])}")

    print("\n✅ Conversion terminée avec succès !")
    print("\n📝 Prochaines étapes :")
    print("   1. Vérifiez et complétez les données dans portfolio_data.json")
    print("   2. Importez dans Supabase : node import_to_supabase.js portfolio_data.json")
    print("   3. OU remplacez data.json : cp portfolio_data.json ../src/data.json")
    print("\n💡 Astuce : Certaines informations nécessitent un complément manuel")
    print("   (téléphone, achievements, images, etc.)")


if __name__ == '__main__':
    main()
