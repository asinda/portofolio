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
    blog_posts: [],
    blog_comments: [],
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
    document.getElementById('addBlogPostBtn')?.addEventListener('click', () => showBlogPostModal());

    // Filtres blog
    document.getElementById('blogStatusFilter')?.addEventListener('change', renderBlogPostsList);
    document.getElementById('blogCategoryFilter')?.addEventListener('change', renderBlogPostsList);

    // Filtres commentaires
    document.getElementById('commentsStatusFilter')?.addEventListener('change', renderCommentsList);
    document.getElementById('approveAllBtn')?.addEventListener('click', approveAllPendingComments);

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
        blog: 'Blog & Articles',
        comments: 'Commentaires',
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
        const [profile, experiences, education, projects, skillsTech, skillsLang, skillsSoft, certifications, blogPosts, blogComments] = await Promise.all([
            supabase.from(TABLES.PROFILE).select('*').single(),
            supabase.from(TABLES.EXPERIENCE).select('*').order('start_date', { ascending: false }),
            supabase.from(TABLES.EDUCATION).select('*').order('start_date', { ascending: false }),
            supabase.from(TABLES.PROJECTS).select('*').order('created_at', { ascending: false }),
            supabase.from(TABLES.SKILLS_TECHNICAL).select('*').order('name'),
            supabase.from(TABLES.SKILLS_LANGUAGES).select('*').order('name'),
            supabase.from(TABLES.SKILLS_SOFT).select('*').order('name'),
            supabase.from(TABLES.CERTIFICATIONS).select('*').order('date', { ascending: false }),
            supabase.from(TABLES.BLOG_POSTS).select('*').order('created_at', { ascending: false }),
            supabase.from(TABLES.BLOG_COMMENTS).select('*').order('created_at', { ascending: false })
        ]);

        portfolioData = {
            profile: profile.data,
            experiences: experiences.data || [],
            education: education.data || [],
            projects: projects.data || [],
            skills_technical: skillsTech.data || [],
            skills_languages: skillsLang.data || [],
            skills_soft: skillsSoft.data || [],
            certifications: certifications.data || [],
            blog_posts: blogPosts.data || [],
            blog_comments: blogComments.data || []
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
        case 'blog':
            renderBlogPostsList();
            break;
        case 'comments':
            renderCommentsList();
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
    document.getElementById('statsBlogPosts').textContent = portfolioData.blog_posts.length;
    document.getElementById('statsComments').textContent = portfolioData.blog_comments.filter(c => c.status === 'pending').length;
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
// Blog & Articles
// ===================================
function renderBlogPostsList() {
    const container = document.getElementById('blogPostsList');
    container.innerHTML = '';

    const statusFilter = document.getElementById('blogStatusFilter')?.value || 'all';
    const categoryFilter = document.getElementById('blogCategoryFilter')?.value || 'all';

    let filteredPosts = portfolioData.blog_posts;
    if (statusFilter !== 'all') {
        filteredPosts = filteredPosts.filter(p => p.status === statusFilter);
    }
    if (categoryFilter !== 'all') {
        filteredPosts = filteredPosts.filter(p => p.category === categoryFilter);
    }

    if (filteredPosts.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--admin-text-secondary);">Aucun article trouvé</p>';
        return;
    }

    filteredPosts.forEach(post => {
        const statusBadge = getStatusBadge(post.status);
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-header">
                <div>
                    <div class="item-title">${post.title}</div>
                    <div class="item-subtitle">${post.category} • ${post.slug}</div>
                    <div class="item-date">
                        ${statusBadge}
                        ${post.published_at ? new Date(post.published_at).toLocaleDateString('fr-FR') : 'Non publié'}
                        • ${post.views || 0} vues
                    </div>
                </div>
                <div class="item-actions">
                    <button class="btn btn-sm btn-primary" onclick="editBlogPost('${post.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteBlogPost('${post.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <p class="item-description">${post.excerpt || ''}</p>
        `;
        container.appendChild(card);
    });
}

function getStatusBadge(status) {
    const badges = {
        published: '<span class="badge badge-success">Publié</span>',
        draft: '<span class="badge badge-warning">Brouillon</span>',
        archived: '<span class="badge badge-secondary">Archivé</span>'
    };
    return badges[status] || '';
}

function showBlogPostModal(data = null) {
    const isEdit = data !== null;
    document.getElementById('modalTitle').textContent = isEdit ? 'Modifier l\'article' : 'Nouvel article';

    const form = `
        <form id="blogPostForm" class="admin-form">
            <div class="form-group">
                <label>Titre *</label>
                <input type="text" id="postTitle" required value="${data?.title || ''}" maxlength="200">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Slug (URL) *</label>
                    <input type="text" id="postSlug" required value="${data?.slug || ''}" pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$">
                    <small>Format: texte-en-minuscules-avec-tirets</small>
                </div>
                <div class="form-group">
                    <label>Catégorie *</label>
                    <select id="postCategory" required>
                        <option value="">Sélectionner...</option>
                        <option value="DevOps" ${data?.category === 'DevOps' ? 'selected' : ''}>DevOps</option>
                        <option value="Cloud" ${data?.category === 'Cloud' ? 'selected' : ''}>Cloud</option>
                        <option value="Kubernetes" ${data?.category === 'Kubernetes' ? 'selected' : ''}>Kubernetes</option>
                        <option value="Terraform" ${data?.category === 'Terraform' ? 'selected' : ''}>Terraform</option>
                        <option value="Ansible" ${data?.category === 'Ansible' ? 'selected' : ''}>Ansible</option>
                        <option value="CI/CD" ${data?.category === 'CI/CD' ? 'selected' : ''}>CI/CD</option>
                        <option value="Monitoring" ${data?.category === 'Monitoring' ? 'selected' : ''}>Monitoring</option>
                        <option value="Automation" ${data?.category === 'Automation' ? 'selected' : ''}>Automation</option>
                        <option value="Tutorial" ${data?.category === 'Tutorial' ? 'selected' : ''}>Tutorial</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label>Extrait (résumé)</label>
                <textarea id="postExcerpt" rows="2" maxlength="500">${data?.excerpt || ''}</textarea>
            </div>
            <div class="form-group">
                <label>Contenu Markdown *</label>
                <textarea id="postContent" rows="15" required>${data?.content || ''}</textarea>
                <small>Utilisez la syntaxe Markdown pour formater votre article</small>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Image de couverture (URL)</label>
                    <input type="url" id="postCoverImage" value="${data?.cover_image || ''}">
                </div>
                <div class="form-group">
                    <label>Temps de lecture (minutes)</label>
                    <input type="number" id="postReadTime" value="${data?.read_time || ''}" min="1">
                </div>
            </div>
            <div class="form-group">
                <label>Tags (séparés par des virgules)</label>
                <input type="text" id="postTags" value="${data?.tags?.join(', ') || ''}">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Statut *</label>
                    <select id="postStatus" required>
                        <option value="draft" ${data?.status === 'draft' ? 'selected' : ''}>Brouillon</option>
                        <option value="published" ${data?.status === 'published' ? 'selected' : ''}>Publié</option>
                        <option value="archived" ${data?.status === 'archived' ? 'selected' : ''}>Archivé</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Date de publication</label>
                    <input type="datetime-local" id="postPublishedAt" value="${data?.published_at ? new Date(data.published_at).toISOString().slice(0, 16) : ''}">
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
    document.getElementById('blogPostForm').addEventListener('submit', (e) => saveBlogPost(e, data?.id));
    openModal();
}

async function saveBlogPost(e, id = null) {
    e.preventDefault();

    const tagsInput = document.getElementById('postTags').value;
    const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()) : [];

    const postData = {
        title: document.getElementById('postTitle').value,
        slug: document.getElementById('postSlug').value,
        content: document.getElementById('postContent').value,
        excerpt: document.getElementById('postExcerpt').value,
        cover_image: document.getElementById('postCoverImage').value,
        category: document.getElementById('postCategory').value,
        tags: tags,
        status: document.getElementById('postStatus').value,
        published_at: document.getElementById('postPublishedAt').value || null,
        read_time: parseInt(document.getElementById('postReadTime').value) || null,
        user_id: currentUser.id
    };

    try {
        let result;
        if (id) {
            result = await supabase.from(TABLES.BLOG_POSTS).update(postData).eq('id', id);
        } else {
            result = await supabase.from(TABLES.BLOG_POSTS).insert([postData]);
        }

        if (result.error) throw result.error;

        closeModal();
        showToast('Article enregistré !', 'success');
        await loadAllData();
        renderBlogPostsList();
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors de l\'enregistrement: ' + error.message, 'error');
    }
}

async function deleteBlogPost(id) {
    if (!confirm('Supprimer cet article ? Cette action est irréversible.')) return;

    try {
        const { error } = await supabase.from(TABLES.BLOG_POSTS).delete().eq('id', id);
        if (error) throw error;

        showToast('Article supprimé', 'success');
        await loadAllData();
        renderBlogPostsList();
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors de la suppression', 'error');
    }
}

window.editBlogPost = async function(id) {
    const post = portfolioData.blog_posts.find(p => p.id === id);
    if (post) showBlogPostModal(post);
};

window.deleteBlogPost = deleteBlogPost;

// ===================================
// Commentaires
// ===================================
function renderCommentsList() {
    const container = document.getElementById('commentsList');
    container.innerHTML = '';

    const statusFilter = document.getElementById('commentsStatusFilter')?.value || 'all';

    let filteredComments = portfolioData.blog_comments;
    if (statusFilter !== 'all') {
        filteredComments = filteredComments.filter(c => c.status === statusFilter);
    }

    if (filteredComments.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--admin-text-secondary);">Aucun commentaire trouvé</p>';
        return;
    }

    filteredComments.forEach(comment => {
        const statusBadge = getCommentStatusBadge(comment.status);
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-header">
                <div>
                    <div class="item-title">${comment.author_name} (${comment.author_email})</div>
                    <div class="item-subtitle">
                        ${statusBadge}
                        ${new Date(comment.created_at).toLocaleDateString('fr-FR')}
                    </div>
                </div>
                <div class="item-actions">
                    ${comment.status === 'pending' ? `
                        <button class="btn btn-sm btn-success" onclick="approveComment('${comment.id}')">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="btn btn-sm btn-warning" onclick="rejectComment('${comment.id}')">
                            <i class="fas fa-times"></i>
                        </button>
                        <button class="btn btn-sm btn-secondary" onclick="markAsSpam('${comment.id}')">
                            <i class="fas fa-ban"></i>
                        </button>
                    ` : `
                        <button class="btn btn-sm btn-danger" onclick="deleteComment('${comment.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    `}
                </div>
            </div>
            <p class="item-description">${comment.content}</p>
        `;
        container.appendChild(card);
    });
}

function getCommentStatusBadge(status) {
    const badges = {
        pending: '<span class="badge badge-warning">En attente</span>',
        approved: '<span class="badge badge-success">Approuvé</span>',
        rejected: '<span class="badge badge-danger">Rejeté</span>',
        spam: '<span class="badge badge-secondary">Spam</span>'
    };
    return badges[status] || '';
}

async function approveComment(id) {
    try {
        const { error } = await supabase
            .from(TABLES.BLOG_COMMENTS)
            .update({
                status: 'approved',
                moderated_by: currentUser.id,
                moderated_at: new Date().toISOString()
            })
            .eq('id', id);

        if (error) throw error;

        showToast('Commentaire approuvé', 'success');
        await loadAllData();
        renderCommentsList();
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors de l\'approbation', 'error');
    }
}

async function rejectComment(id) {
    try {
        const { error } = await supabase
            .from(TABLES.BLOG_COMMENTS)
            .update({
                status: 'rejected',
                moderated_by: currentUser.id,
                moderated_at: new Date().toISOString()
            })
            .eq('id', id);

        if (error) throw error;

        showToast('Commentaire rejeté', 'success');
        await loadAllData();
        renderCommentsList();
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors du rejet', 'error');
    }
}

async function markAsSpam(id) {
    try {
        const { error } = await supabase
            .from(TABLES.BLOG_COMMENTS)
            .update({
                status: 'spam',
                moderated_by: currentUser.id,
                moderated_at: new Date().toISOString()
            })
            .eq('id', id);

        if (error) throw error;

        showToast('Commentaire marqué comme spam', 'success');
        await loadAllData();
        renderCommentsList();
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur', 'error');
    }
}

async function deleteComment(id) {
    if (!confirm('Supprimer ce commentaire ?')) return;

    try {
        const { error } = await supabase.from(TABLES.BLOG_COMMENTS).delete().eq('id', id);
        if (error) throw error;

        showToast('Commentaire supprimé', 'success');
        await loadAllData();
        renderCommentsList();
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors de la suppression', 'error');
    }
}

async function approveAllPendingComments() {
    const pendingComments = portfolioData.blog_comments.filter(c => c.status === 'pending');

    if (pendingComments.length === 0) {
        showToast('Aucun commentaire en attente', 'info');
        return;
    }

    if (!confirm(`Approuver ${pendingComments.length} commentaire(s) en attente ?`)) return;

    try {
        const promises = pendingComments.map(comment =>
            supabase.from(TABLES.BLOG_COMMENTS).update({
                status: 'approved',
                moderated_by: currentUser.id,
                moderated_at: new Date().toISOString()
            }).eq('id', comment.id)
        );

        await Promise.all(promises);

        showToast('Tous les commentaires ont été approuvés', 'success');
        await loadAllData();
        renderCommentsList();
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors de l\'approbation', 'error');
    }
}

window.approveComment = approveComment;
window.rejectComment = rejectComment;
window.markAsSpam = markAsSpam;
window.deleteComment = deleteComment;

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
