// ===================================
// Variables Globales
// ===================================
const { supabase, TABLES, STORAGE_BUCKETS, isConfigured } = window.SupabaseConfig;

let currentUser = null;
let portfolioData = {
    profile: null,
    experiences: [],
    education: [],
    projects: [],
    skills_technical: [],
    skills_languages: [],
    skills_soft: [],
    certifications: [],
    media: []
};

// ===================================
// Initialisation
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    if (!isConfigured()) {
        showToast('Configuration Supabase manquante. Consultez SUPABASE_SETUP.md', 'error');
        return;
    }

    checkAuth();
    initEventListeners();
});

// ===================================
// Authentification
// ===================================
async function checkAuth() {
    try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
            currentUser = session.user;
            showAdmin();
            loadDashboard();
        } else {
            showLogin();
        }
    } catch (error) {
        console.error('Erreur auth:', error);
        showLogin();
    }
}

async function login(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        currentUser = data.user;
        showAdmin();
        loadDashboard();
        showToast('Connexion réussie !', 'success');
    } catch (error) {
        console.error('Erreur connexion:', error);
        document.getElementById('loginError').textContent = error.message;
        document.getElementById('loginError').classList.add('show');
    }
}

async function logout() {
    try {
        await supabase.auth.signOut();
        currentUser = null;
        showLogin();
        showToast('Déconnexion réussie', 'success');
    } catch (error) {
        console.error('Erreur déconnexion:', error);
        showToast('Erreur lors de la déconnexion', 'error');
    }
}

function showLogin() {
    document.getElementById('loginContainer').style.display = 'flex';
    document.getElementById('adminContainer').style.display = 'none';
}

function showAdmin() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('adminContainer').style.display = 'flex';
    document.getElementById('userEmail').textContent = currentUser.email;
}

// ===================================
// Event Listeners
// ===================================
function initEventListeners() {
    // Connexion
    document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        await login(email, password);
    });

    // Déconnexion
    document.getElementById('logoutBtn')?.addEventListener('click', logout);

    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            navigateToSection(section);
        });
    });

    // Bouton sync
    document.getElementById('syncBtn')?.addEventListener('click', syncData);

    // Modal close
    document.getElementById('modalClose')?.addEventListener('click', closeModal);

    // Tabs des compétences
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            switchSkillsTab(tab);
        });
    });

    // Boutons d'ajout
    document.getElementById('addExperienceBtn')?.addEventListener('click', () => showExperienceModal());
    document.getElementById('addEducationBtn')?.addEventListener('click', () => showEducationModal());
    document.getElementById('addProjectBtn')?.addEventListener('click', () => showProjectModal());
    document.getElementById('addCertificationBtn')?.addEventListener('click', () => showCertificationModal());
    document.getElementById('addTechnicalSkillBtn')?.addEventListener('click', () => showSkillModal('technical'));
    document.getElementById('addLanguageBtn')?.addEventListener('click', () => showLanguageModal());
    document.getElementById('addSoftSkillBtn')?.addEventListener('click', () => showSkillModal('soft'));

    // Formulaire profil
    document.getElementById('profileForm')?.addEventListener('submit', saveProfile);

    // Upload fichiers
    document.getElementById('fileInput')?.addEventListener('change', handleFileUpload);
}

// ===================================
// Navigation
// ===================================
function navigateToSection(section) {
    // Mettre à jour le menu
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === section) {
            item.classList.add('active');
        }
    });

    // Afficher la section
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.classList.remove('active');
    });
    document.getElementById(`section-${section}`)?.classList.add('active');

    // Mettre à jour le titre
    const titles = {
        dashboard: 'Tableau de bord',
        profile: 'Mon Profil',
        experience: 'Expériences Professionnelles',
        education: 'Formation',
        projects: 'Mes Projets',
        skills: 'Compétences',
        certifications: 'Certifications',
        media: 'Gestion des Médias'
    };
    document.getElementById('sectionTitle').textContent = titles[section] || section;

    // Charger les données de la section
    loadSectionData(section);
}

// ===================================
// Chargement des données
// ===================================
async function loadDashboard() {
    await loadAllData();
    updateStats();
    navigateToSection('dashboard');
}

async function loadAllData() {
    try {
        // Charger toutes les données en parallèle
        const [profile, experiences, education, projects, skillsTech, skillsLang, skillsSoft, certifications] = await Promise.all([
            supabase.from(TABLES.PROFILE).select('*').single(),
            supabase.from(TABLES.EXPERIENCE).select('*').order('start_date', { ascending: false }),
            supabase.from(TABLES.EDUCATION).select('*').order('start_date', { ascending: false }),
            supabase.from(TABLES.PROJECTS).select('*').order('created_at', { ascending: false }),
            supabase.from(TABLES.SKILLS_TECHNICAL).select('*').order('name'),
            supabase.from(TABLES.SKILLS_LANGUAGES).select('*').order('name'),
            supabase.from(TABLES.SKILLS_SOFT).select('*').order('name'),
            supabase.from(TABLES.CERTIFICATIONS).select('*').order('date', { ascending: false })
        ]);

        portfolioData = {
            profile: profile.data,
            experiences: experiences.data || [],
            education: education.data || [],
            projects: projects.data || [],
            skills_technical: skillsTech.data || [],
            skills_languages: skillsLang.data || [],
            skills_soft: skillsSoft.data || [],
            certifications: certifications.data || []
        };

        console.log('Données chargées:', portfolioData);
    } catch (error) {
        console.error('Erreur chargement données:', error);
        showToast('Erreur lors du chargement des données', 'error');
    }
}

async function loadSectionData(section) {
    switch(section) {
        case 'profile':
            loadProfileForm();
            break;
        case 'experience':
            renderExperiencesList();
            break;
        case 'education':
            renderEducationList();
            break;
        case 'projects':
            renderProjectsList();
            break;
        case 'skills':
            renderSkillsLists();
            break;
        case 'certifications':
            renderCertificationsList();
            break;
        case 'media':
            loadMediaGallery();
            break;
    }
}

async function syncData() {
    showToast('Synchronisation en cours...', 'info');
    await loadAllData();
    updateStats();
    showToast('Données synchronisées !', 'success');
}

function updateStats() {
    document.getElementById('statsExperience').textContent = portfolioData.experiences.length;
    document.getElementById('statsProjects').textContent = portfolioData.projects.length;
    document.getElementById('statsSkills').textContent = portfolioData.skills_technical.length;
    document.getElementById('statsCertifications').textContent = portfolioData.certifications.length;
}

// ===================================
// Profil
// ===================================
function loadProfileForm() {
    if (!portfolioData.profile) return;

    const p = portfolioData.profile;
    document.getElementById('profileName').value = p.name || '';
    document.getElementById('profileTitle').value = p.title || '';
    document.getElementById('profileEmail').value = p.email || '';
    document.getElementById('profilePhone').value = p.phone || '';
    document.getElementById('profileLocation').value = p.location || '';
    document.getElementById('profilePhoto').value = p.photo || '';
    document.getElementById('profileAbout').value = p.about || '';
    document.getElementById('profileLinkedin').value = p.linkedin || '';
    document.getElementById('profileGithub').value = p.github || '';
}

async function saveProfile(e) {
    e.preventDefault();

    const profileData = {
        name: document.getElementById('profileName').value,
        title: document.getElementById('profileTitle').value,
        email: document.getElementById('profileEmail').value,
        phone: document.getElementById('profilePhone').value,
        location: document.getElementById('profileLocation').value,
        photo: document.getElementById('profilePhoto').value,
        about: document.getElementById('profileAbout').value,
        linkedin: document.getElementById('profileLinkedin').value,
        github: document.getElementById('profileGithub').value,
        user_id: currentUser.id
    };

    try {
        let result;
        if (portfolioData.profile && portfolioData.profile.id) {
            // Mise à jour
            result = await supabase
                .from(TABLES.PROFILE)
                .update(profileData)
                .eq('id', portfolioData.profile.id);
        } else {
            // Création
            result = await supabase
                .from(TABLES.PROFILE)
                .insert([profileData]);
        }

        if (result.error) throw result.error;

        showToast('Profil enregistré avec succès !', 'success');
        await loadAllData();
    } catch (error) {
        console.error('Erreur sauvegarde profil:', error);
        showToast('Erreur lors de la sauvegarde', 'error');
    }
}

// ===================================
// Expériences
// ===================================
function renderExperiencesList() {
    const container = document.getElementById('experienceList');
    container.innerHTML = '';

    if (portfolioData.experiences.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--admin-text-secondary);">Aucune expérience ajoutée</p>';
        return;
    }

    portfolioData.experiences.forEach(exp => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-header">
                <div>
                    <div class="item-title">${exp.position}</div>
                    <div class="item-subtitle">${exp.company} • ${exp.location}</div>
                    <div class="item-date">${exp.start_date} - ${exp.current ? 'Présent' : exp.end_date}</div>
                </div>
                <div class="item-actions">
                    <button class="btn btn-sm btn-primary" onclick="editExperience(${exp.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteExperience(${exp.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <p class="item-description">${exp.description || ''}</p>
        `;
        container.appendChild(card);
    });
}

function showExperienceModal(data = null) {
    const isEdit = data !== null;
    document.getElementById('modalTitle').textContent = isEdit ? 'Modifier l\'expérience' : 'Nouvelle expérience';

    const form = `
        <form id="experienceForm" class="admin-form">
            <div class="form-group">
                <label>Poste *</label>
                <input type="text" id="expPosition" required value="${data?.position || ''}">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Entreprise *</label>
                    <input type="text" id="expCompany" required value="${data?.company || ''}">
                </div>
                <div class="form-group">
                    <label>Localisation</label>
                    <input type="text" id="expLocation" value="${data?.location || ''}">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Date de début *</label>
                    <input type="month" id="expStartDate" required value="${data?.start_date || ''}">
                </div>
                <div class="form-group">
                    <label>Date de fin</label>
                    <input type="month" id="expEndDate" value="${data?.end_date || ''}">
                </div>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="expCurrent" ${data?.current ? 'checked' : ''}>
                    Poste actuel
                </label>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea id="expDescription" rows="4">${data?.description || ''}</textarea>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Annuler</button>
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save"></i> Enregistrer
                </button>
            </div>
        </form>
    `;

    document.getElementById('modalBody').innerHTML = form;
    document.getElementById('experienceForm').addEventListener('submit', (e) => saveExperience(e, data?.id));
    openModal();
}

async function saveExperience(e, id = null) {
    e.preventDefault();

    const expData = {
        position: document.getElementById('expPosition').value,
        company: document.getElementById('expCompany').value,
        location: document.getElementById('expLocation').value,
        start_date: document.getElementById('expStartDate').value,
        end_date: document.getElementById('expEndDate').value,
        current: document.getElementById('expCurrent').checked,
        description: document.getElementById('expDescription').value,
        user_id: currentUser.id
    };

    try {
        let result;
        if (id) {
            result = await supabase.from(TABLES.EXPERIENCE).update(expData).eq('id', id);
        } else {
            result = await supabase.from(TABLES.EXPERIENCE).insert([expData]);
        }

        if (result.error) throw result.error;

        closeModal();
        showToast('Expérience enregistrée !', 'success');
        await loadAllData();
        renderExperiencesList();
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors de l\'enregistrement', 'error');
    }
}

async function deleteExperience(id) {
    if (!confirm('Supprimer cette expérience ?')) return;

    try {
        const { error } = await supabase.from(TABLES.EXPERIENCE).delete().eq('id', id);
        if (error) throw error;

        showToast('Expérience supprimée', 'success');
        await loadAllData();
        renderExperiencesList();
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors de la suppression', 'error');
    }
}

window.editExperience = async function(id) {
    const exp = portfolioData.experiences.find(e => e.id === id);
    if (exp) showExperienceModal(exp);
};

window.deleteExperience = deleteExperience;

// ===================================
// Formation (similaire aux expériences)
// ===================================
function renderEducationList() {
    const container = document.getElementById('educationList');
    container.innerHTML = '';

    if (portfolioData.education.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--admin-text-secondary);">Aucune formation ajoutée</p>';
        return;
    }

    portfolioData.education.forEach(edu => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-header">
                <div>
                    <div class="item-title">${edu.degree}</div>
                    <div class="item-subtitle">${edu.institution} • ${edu.location}</div>
                    <div class="item-date">${edu.start_date} - ${edu.end_date}</div>
                </div>
                <div class="item-actions">
                    <button class="btn btn-sm btn-primary" onclick="editEducation(${edu.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteEducation(${edu.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <p class="item-description">${edu.description || ''}</p>
        `;
        container.appendChild(card);
    });
}

function showEducationModal(data = null) {
    const isEdit = data !== null;
    document.getElementById('modalTitle').textContent = isEdit ? 'Modifier la formation' : 'Nouvelle formation';

    const form = `
        <form id="educationForm" class="admin-form">
            <div class="form-group">
                <label>Diplôme *</label>
                <input type="text" id="eduDegree" required value="${data?.degree || ''}">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Institution *</label>
                    <input type="text" id="eduInstitution" required value="${data?.institution || ''}">
                </div>
                <div class="form-group">
                    <label>Localisation</label>
                    <input type="text" id="eduLocation" value="${data?.location || ''}">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Année de début *</label>
                    <input type="text" id="eduStartDate" required value="${data?.start_date || ''}">
                </div>
                <div class="form-group">
                    <label>Année de fin *</label>
                    <input type="text" id="eduEndDate" required value="${data?.end_date || ''}">
                </div>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea id="eduDescription" rows="3">${data?.description || ''}</textarea>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Annuler</button>
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save"></i> Enregistrer
                </button>
            </div>
        </form>
    `;

    document.getElementById('modalBody').innerHTML = form;
    document.getElementById('educationForm').addEventListener('submit', (e) => saveEducation(e, data?.id));
    openModal();
}

async function saveEducation(e, id = null) {
    e.preventDefault();

    const eduData = {
        degree: document.getElementById('eduDegree').value,
        institution: document.getElementById('eduInstitution').value,
        location: document.getElementById('eduLocation').value,
        start_date: document.getElementById('eduStartDate').value,
        end_date: document.getElementById('eduEndDate').value,
        description: document.getElementById('eduDescription').value,
        user_id: currentUser.id
    };

    try {
        let result;
        if (id) {
            result = await supabase.from(TABLES.EDUCATION).update(eduData).eq('id', id);
        } else {
            result = await supabase.from(TABLES.EDUCATION).insert([eduData]);
        }

        if (result.error) throw result.error;

        closeModal();
        showToast('Formation enregistrée !', 'success');
        await loadAllData();
        renderEducationList();
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors de l\'enregistrement', 'error');
    }
}

async function deleteEducation(id) {
    if (!confirm('Supprimer cette formation ?')) return;

    try {
        const { error } = await supabase.from(TABLES.EDUCATION).delete().eq('id', id);
        if (error) throw error;

        showToast('Formation supprimée', 'success');
        await loadAllData();
        renderEducationList();
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors de la suppression', 'error');
    }
}

window.editEducation = async function(id) {
    const edu = portfolioData.education.find(e => e.id === id);
    if (edu) showEducationModal(edu);
};

window.deleteEducation = deleteEducation;

// ===================================
// Projets
// ===================================
function renderProjectsList() {
    const container = document.getElementById('projectsList');
    container.innerHTML = '';

    if (portfolioData.projects.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--admin-text-secondary);">Aucun projet ajouté</p>';
        return;
    }

    portfolioData.projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-header">
                <div>
                    <div class="item-title">${project.title}</div>
                </div>
                <div class="item-actions">
                    <button class="btn btn-sm btn-primary" onclick="editProject(${project.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProject(${project.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <p class="item-description">${project.description || ''}</p>
            <div class="item-tags">
                ${(project.technologies || []).map(tech => `<span class="tag">${tech}</span>`).join('')}
            </div>
        `;
        container.appendChild(card);
    });
}

function showProjectModal(data = null) {
    const isEdit = data !== null;
    document.getElementById('modalTitle').textContent = isEdit ? 'Modifier le projet' : 'Nouveau projet';

    const form = `
        <form id="projectForm" class="admin-form">
            <div class="form-group">
                <label>Titre *</label>
                <input type="text" id="projTitle" required value="${data?.title || ''}">
            </div>
            <div class="form-group">
                <label>Description *</label>
                <textarea id="projDescription" rows="4" required>${data?.description || ''}</textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>URL de l'image</label>
                    <input type="url" id="projImage" value="${data?.image || ''}">
                </div>
                <div class="form-group">
                    <label>Technologies (séparées par des virgules)</label>
                    <input type="text" id="projTech" value="${data?.technologies?.join(', ') || ''}">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Lien du projet</label>
                    <input type="url" id="projLink" value="${data?.link || ''}">
                </div>
                <div class="form-group">
                    <label>Lien GitHub</label>
                    <input type="url" id="projGithub" value="${data?.github || ''}">
                </div>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Annuler</button>
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save"></i> Enregistrer
                </button>
            </div>
        </form>
    `;

    document.getElementById('modalBody').innerHTML = form;
    document.getElementById('projectForm').addEventListener('submit', (e) => saveProject(e, data?.id));
    openModal();
}

async function saveProject(e, id = null) {
    e.preventDefault();

    const techInput = document.getElementById('projTech').value;
    const technologies = techInput ? techInput.split(',').map(t => t.trim()) : [];

    const projData = {
        title: document.getElementById('projTitle').value,
        description: document.getElementById('projDescription').value,
        image: document.getElementById('projImage').value,
        technologies: technologies,
        link: document.getElementById('projLink').value,
        github: document.getElementById('projGithub').value,
        user_id: currentUser.id
    };

    try {
        let result;
        if (id) {
            result = await supabase.from(TABLES.PROJECTS).update(projData).eq('id', id);
        } else {
            result = await supabase.from(TABLES.PROJECTS).insert([projData]);
        }

        if (result.error) throw result.error;

        closeModal();
        showToast('Projet enregistré !', 'success');
        await loadAllData();
        renderProjectsList();
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors de l\'enregistrement', 'error');
    }
}

async function deleteProject(id) {
    if (!confirm('Supprimer ce projet ?')) return;

    try {
        const { error } = await supabase.from(TABLES.PROJECTS).delete().eq('id', id);
        if (error) throw error;

        showToast('Projet supprimé', 'success');
        await loadAllData();
        renderProjectsList();
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors de la suppression', 'error');
    }
}

window.editProject = async function(id) {
    const project = portfolioData.projects.find(p => p.id === id);
    if (project) showProjectModal(project);
};

window.deleteProject = deleteProject;

// ===================================
// Compétences
// ===================================
function switchSkillsTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `tab-${tab}`);
    });
}

function renderSkillsLists() {
    renderTechnicalSkills();
    renderLanguages();
    renderSoftSkills();
}

function renderTechnicalSkills() {
    const container = document.getElementById('technicalSkillsList');
    container.innerHTML = '';

    portfolioData.skills_technical.forEach(skill => {
        const badge = document.createElement('div');
        badge.className = 'skill-badge';
        badge.innerHTML = `
            ${skill.name}
            <button onclick="deleteSkill('technical', ${skill.id})">
                <i class="fas fa-times"></i>
            </button>
        `;
        container.appendChild(badge);
    });
}

function renderLanguages() {
    const container = document.getElementById('languagesList');
    container.innerHTML = '';

    portfolioData.skills_languages.forEach(lang => {
        const badge = document.createElement('div');
        badge.className = 'skill-badge';
        badge.innerHTML = `
            ${lang.name} (${lang.level})
            <button onclick="deleteSkill('languages', ${lang.id})">
                <i class="fas fa-times"></i>
            </button>
        `;
        container.appendChild(badge);
    });
}

function renderSoftSkills() {
    const container = document.getElementById('softSkillsList');
    container.innerHTML = '';

    portfolioData.skills_soft.forEach(skill => {
        const badge = document.createElement('div');
        badge.className = 'skill-badge';
        badge.innerHTML = `
            ${skill.name}
            <button onclick="deleteSkill('soft', ${skill.id})">
                <i class="fas fa-times"></i>
            </button>
        `;
        container.appendChild(badge);
    });
}

function showSkillModal(type) {
    document.getElementById('modalTitle').textContent = 'Ajouter une compétence';

    const form = `
        <form id="skillForm" class="admin-form">
            <div class="form-group">
                <label>Nom de la compétence *</label>
                <input type="text" id="skillName" required>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Annuler</button>
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save"></i> Ajouter
                </button>
            </div>
        </form>
    `;

    document.getElementById('modalBody').innerHTML = form;
    document.getElementById('skillForm').addEventListener('submit', (e) => saveSkill(e, type));
    openModal();
}

function showLanguageModal() {
    document.getElementById('modalTitle').textContent = 'Ajouter une langue';

    const form = `
        <form id="languageForm" class="admin-form">
            <div class="form-group">
                <label>Langue *</label>
                <input type="text" id="langName" required>
            </div>
            <div class="form-group">
                <label>Niveau *</label>
                <select id="langLevel" required>
                    <option value="Débutant">Débutant</option>
                    <option value="Intermédiaire">Intermédiaire</option>
                    <option value="Avancé">Avancé</option>
                    <option value="Courant">Courant</option>
                    <option value="Natif">Natif</option>
                </select>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Annuler</button>
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save"></i> Ajouter
                </button>
            </div>
        </form>
    `;

    document.getElementById('modalBody').innerHTML = form;
    document.getElementById('languageForm').addEventListener('submit', saveLanguage);
    openModal();
}

async function saveSkill(e, type) {
    e.preventDefault();

    const table = type === 'technical' ? TABLES.SKILLS_TECHNICAL : TABLES.SKILLS_SOFT;
    const skillData = {
        name: document.getElementById('skillName').value,
        user_id: currentUser.id
    };

    try {
        const { error } = await supabase.from(table).insert([skillData]);
        if (error) throw error;

        closeModal();
        showToast('Compétence ajoutée !', 'success');
        await loadAllData();
        renderSkillsLists();
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors de l\'ajout', 'error');
    }
}

async function saveLanguage(e) {
    e.preventDefault();

    const langData = {
        name: document.getElementById('langName').value,
        level: document.getElementById('langLevel').value,
        user_id: currentUser.id
    };

    try {
        const { error } = await supabase.from(TABLES.SKILLS_LANGUAGES).insert([langData]);
        if (error) throw error;

        closeModal();
        showToast('Langue ajoutée !', 'success');
        await loadAllData();
        renderSkillsLists();
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors de l\'ajout', 'error');
    }
}

window.deleteSkill = async function(type, id) {
    if (!confirm('Supprimer cette compétence ?')) return;

    const table = type === 'technical' ? TABLES.SKILLS_TECHNICAL :
                  type === 'languages' ? TABLES.SKILLS_LANGUAGES :
                  TABLES.SKILLS_SOFT;

    try {
        const { error } = await supabase.from(table).delete().eq('id', id);
        if (error) throw error;

        showToast('Compétence supprimée', 'success');
        await loadAllData();
        renderSkillsLists();
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors de la suppression', 'error');
    }
};

// ===================================
// Certifications
// ===================================
function renderCertificationsList() {
    const container = document.getElementById('certificationsList');
    container.innerHTML = '';

    if (portfolioData.certifications.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--admin-text-secondary);">Aucune certification ajoutée</p>';
        return;
    }

    portfolioData.certifications.forEach(cert => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-header">
                <div>
                    <div class="item-title">${cert.name}</div>
                    <div class="item-subtitle">${cert.issuer}</div>
                    <div class="item-date">${cert.date}</div>
                </div>
                <div class="item-actions">
                    <button class="btn btn-sm btn-primary" onclick="editCertification(${cert.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteCertification(${cert.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function showCertificationModal(data = null) {
    const isEdit = data !== null;
    document.getElementById('modalTitle').textContent = isEdit ? 'Modifier la certification' : 'Nouvelle certification';

    const form = `
        <form id="certificationForm" class="admin-form">
            <div class="form-group">
                <label>Nom de la certification *</label>
                <input type="text" id="certName" required value="${data?.name || ''}">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Organisme émetteur *</label>
                    <input type="text" id="certIssuer" required value="${data?.issuer || ''}">
                </div>
                <div class="form-group">
                    <label>Date *</label>
                    <input type="month" id="certDate" required value="${data?.date || ''}">
                </div>
            </div>
            <div class="form-group">
                <label>Lien vers la certification</label>
                <input type="url" id="certLink" value="${data?.link || ''}">
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Annuler</button>
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save"></i> Enregistrer
                </button>
            </div>
        </form>
    `;

    document.getElementById('modalBody').innerHTML = form;
    document.getElementById('certificationForm').addEventListener('submit', (e) => saveCertification(e, data?.id));
    openModal();
}

async function saveCertification(e, id = null) {
    e.preventDefault();

    const certData = {
        name: document.getElementById('certName').value,
        issuer: document.getElementById('certIssuer').value,
        date: document.getElementById('certDate').value,
        link: document.getElementById('certLink').value,
        user_id: currentUser.id
    };

    try {
        let result;
        if (id) {
            result = await supabase.from(TABLES.CERTIFICATIONS).update(certData).eq('id', id);
        } else {
            result = await supabase.from(TABLES.CERTIFICATIONS).insert([certData]);
        }

        if (result.error) throw result.error;

        closeModal();
        showToast('Certification enregistrée !', 'success');
        await loadAllData();
        renderCertificationsList();
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors de l\'enregistrement', 'error');
    }
}

async function deleteCertification(id) {
    if (!confirm('Supprimer cette certification ?')) return;

    try {
        const { error } = await supabase.from(TABLES.CERTIFICATIONS).delete().eq('id', id);
        if (error) throw error;

        showToast('Certification supprimée', 'success');
        await loadAllData();
        renderCertificationsList();
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors de la suppression', 'error');
    }
}

window.editCertification = async function(id) {
    const cert = portfolioData.certifications.find(c => c.id === id);
    if (cert) showCertificationModal(cert);
};

window.deleteCertification = deleteCertification;

// ===================================
// Médias / Storage
// ===================================
async function loadMediaGallery() {
    try {
        const { data, error } = await supabase.storage
            .from(STORAGE_BUCKETS.IMAGES)
            .list();

        if (error) throw error;

        const container = document.getElementById('mediaGallery');
        container.innerHTML = '';

        if (!data || data.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--admin-text-secondary);">Aucun média</p>';
            return;
        }

        data.forEach(file => {
            const { data: { publicUrl } } = supabase.storage
                .from(STORAGE_BUCKETS.IMAGES)
                .getPublicUrl(file.name);

            const item = document.createElement('div');
            item.className = 'media-item';
            item.innerHTML = `
                <img src="${publicUrl}" alt="${file.name}">
                <div class="media-item-info">
                    <div class="media-item-name">${file.name}</div>
                    <div class="media-item-actions">
                        <button class="btn btn-sm btn-primary" onclick="copyMediaUrl('${publicUrl}')">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteMedia('${file.name}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(item);
        });
    } catch (error) {
        console.error('Erreur chargement médias:', error);
        showToast('Erreur lors du chargement des médias', 'error');
    }
}

async function handleFileUpload(e) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    showToast('Upload en cours...', 'info');

    try {
        for (const file of files) {
            const fileName = `${Date.now()}_${file.name}`;
            const { error } = await supabase.storage
                .from(STORAGE_BUCKETS.IMAGES)
                .upload(fileName, file);

            if (error) throw error;
        }

        showToast('Fichiers uploadés avec succès !', 'success');
        loadMediaGallery();
    } catch (error) {
        console.error('Erreur upload:', error);
        showToast('Erreur lors de l\'upload', 'error');
    }
}

window.copyMediaUrl = function(url) {
    navigator.clipboard.writeText(url);
    showToast('URL copiée !', 'success');
};

window.deleteMedia = async function(fileName) {
    if (!confirm('Supprimer ce fichier ?')) return;

    try {
        const { error } = await supabase.storage
            .from(STORAGE_BUCKETS.IMAGES)
            .remove([fileName]);

        if (error) throw error;

        showToast('Fichier supprimé', 'success');
        loadMediaGallery();
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors de la suppression', 'error');
    }
};

// ===================================
// Utilitaires Modal
// ===================================
function openModal() {
    document.getElementById('formModal').classList.add('show');
}

function closeModal() {
    document.getElementById('formModal').classList.remove('show');
}

// ===================================
// Toast Notifications
// ===================================
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    toast.className = `toast ${type} show`;
    toastMessage.textContent = message;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
