/**
 * BLOG MODULE - Alice Sindayigaya Portfolio
 * Gestion du blog avec markdown, filtres et recherche
 */

// ===================================
// CONFIGURATION
// ===================================
const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : 'https://portfolio-backend-uj9f.onrender.com/api';

// Base path pour GitHub Pages (site dans un sous-dossier)
const BASE_PATH = window.location.hostname === 'localhost'
    ? ''
    : '/portofolio';

const BLOG_CONFIG = {
    apiUrl: `${API_BASE_URL}/blog/posts?limit=100`,
    categories: ['all', 'DevOps', 'Cloud', 'Kubernetes', 'CI/CD', 'Terraform', 'Ansible', 'Monitoring', 'Automation'],
    defaultCategory: 'all',
    defaultSort: 'date-desc'
};

// ===================================
// STATE
// ===================================
let blogState = {
    posts: [],
    filteredPosts: [],
    currentPost: null,
    currentFilter: 'all',
    searchQuery: ''
};

// ===================================
// FONCTIONS PRINCIPALES
// ===================================

/**
 * Initialiser le blog
 */
async function initBlog() {
    try {
        console.log('[Blog] Initialisation du blog...');
        await loadPosts();
        setupEventListeners();
        renderPosts();
        console.log('[Blog] Initialisation terminée');
    } catch (error) {
        console.error('[Blog] Erreur init blog:', error);
        showError();
    }
}

/**
 * Charger les posts depuis l'API
 */
async function loadPosts() {
    try {
        console.log('[Blog] Chargement des posts depuis:', BLOG_CONFIG.apiUrl);

        const response = await fetch(BLOG_CONFIG.apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('[Blog] Réponse API:', data);

        if (data.success && Array.isArray(data.data)) {
            // Filtrer uniquement les posts publiés
            blogState.posts = data.data.filter(post => post.status === 'published');
            blogState.filteredPosts = [...blogState.posts];

            console.log(`[Blog] ${blogState.posts.length} posts chargés`);
        } else {
            throw new Error(data.error || 'Format de réponse invalide');
        }
    } catch (error) {
        console.error('[Blog] Erreur loadPosts:', error);
        throw error;
    }
}

/**
 * Configurer les event listeners
 */
function setupEventListeners() {
    console.log('[Blog] Configuration des event listeners...');

    // Filtres catégories
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', handleCategoryFilter);
    });

    // Recherche
    const searchInput = document.querySelector('#blogSearch');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Modal
    const modal = document.querySelector('#blogModal');
    if (modal) {
        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');

        closeBtn?.addEventListener('click', closeModal);
        overlay?.addEventListener('click', closeModal);

        // Fermeture avec Échap
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // Navigation modal
    const prevBtn = document.querySelector('.btn-prev');
    const nextBtn = document.querySelector('.btn-next');

    prevBtn?.addEventListener('click', showPreviousPost);
    nextBtn?.addEventListener('click', showNextPost);

    console.log('[Blog] Event listeners configurés');
}

/**
 * Afficher les posts dans la grille
 */
function renderPosts() {
    const grid = document.querySelector('#blogGrid');
    if (!grid) {
        console.warn('[Blog] Élément #blogGrid non trouvé');
        return;
    }

    console.log(`[Blog] Rendu de ${blogState.filteredPosts.length} posts`);

    grid.innerHTML = '';

    if (blogState.filteredPosts.length === 0) {
        grid.innerHTML = '<p class="no-results" data-i18n="blog.noResults">Aucun article trouvé</p>';
        return;
    }

    blogState.filteredPosts.forEach(post => {
        const card = createPostCard(post);
        grid.appendChild(card);
    });
}

/**
 * Créer une card de post (Factory Pattern)
 */
function createPostCard(post) {
    const card = document.createElement('article');
    card.className = 'blog-card';
    card.dataset.postId = post.id;

    const categoryClass = post.category.toLowerCase().replace(/\s+/g, '-');
    const hasImage = post.cover_image && post.cover_image.trim() !== '';

    // Ajouter BASE_PATH aux images relatives
    const imageUrl = hasImage ? getFullImagePath(post.cover_image) : '';

    card.innerHTML = `
        ${hasImage ? `
            <div class="blog-card-image">
                <img src="${imageUrl}" alt="${escapeHtml(post.title)}" loading="lazy">
            </div>
        ` : ''}

        <div class="blog-card-content">
            <div class="blog-card-meta">
                <span class="category-badge ${categoryClass}">${escapeHtml(post.category)}</span>
                <span class="read-time">
                    <i class="fas fa-clock"></i> ${post.read_time || 5} min
                </span>
            </div>

            <h3 class="blog-card-title">${escapeHtml(post.title)}</h3>
            <p class="blog-card-excerpt">${escapeHtml(post.excerpt)}</p>

            <div class="blog-card-tags">
                ${post.tags.slice(0, 3).map(tag =>
                    `<span class="tag">#${escapeHtml(tag)}</span>`
                ).join('')}
            </div>

            <div class="blog-card-footer">
                <span class="published-date">
                    <i class="fas fa-calendar"></i> ${formatDate(post.published_at)}
                </span>
                <span class="views">
                    <i class="fas fa-eye"></i> ${post.views || 0} vues
                </span>
            </div>
        </div>
    `;

    card.addEventListener('click', () => openPostModal(post.id));

    return card;
}

/**
 * Ouvrir le modal avec le détail du post
 */
async function openPostModal(postId) {
    const post = blogState.posts.find(p => p.id === postId);
    if (!post) {
        console.error('[Blog] Post non trouvé:', postId);
        return;
    }

    console.log('[Blog] Ouverture modal pour:', post.title);

    blogState.currentPost = post;

    // Incrémenter les vues (fire-and-forget)
    incrementViews(postId).catch(console.error);

    // Remplir le modal
    const modal = document.querySelector('#blogModal');
    if (!modal) return;

    const content = modal.querySelector('.tutorial-content');

    // Header metadata
    const categoryBadge = content.querySelector('.category-badge');
    const readTimeValue = content.querySelector('.read-time-value');
    const viewsValue = content.querySelector('.views-value');
    const dateValue = content.querySelector('.date-value');

    if (categoryBadge) {
        categoryBadge.textContent = post.category;
        categoryBadge.className = `category-badge ${post.category.toLowerCase().replace(/\s+/g, '-')}`;
    }
    if (readTimeValue) readTimeValue.textContent = post.read_time || 5;
    if (viewsValue) viewsValue.textContent = (post.views || 0) + 1;
    if (dateValue) dateValue.textContent = formatDate(post.published_at);

    // Title & excerpt
    const titleEl = content.querySelector('.tutorial-title');
    const excerptEl = content.querySelector('.tutorial-excerpt');

    if (titleEl) titleEl.textContent = post.title;
    if (excerptEl) excerptEl.textContent = post.excerpt;

    // Tags
    const tagsContainer = content.querySelector('.tutorial-tags');
    if (tagsContainer) {
        tagsContainer.innerHTML = post.tags.map(tag =>
            `<span class="tag">#${escapeHtml(tag)}</span>`
        ).join('');
    }

    // Markdown content
    const markdownContainer = content.querySelector('.markdown-content');
    if (markdownContainer && typeof marked !== 'undefined') {
        try {
            const htmlContent = marked.parse(post.content);
            markdownContainer.innerHTML = htmlContent;

            // Syntax highlighting
            if (typeof Prism !== 'undefined') {
                Prism.highlightAllUnder(markdownContainer);
            }
        } catch (error) {
            console.error('[Blog] Erreur parsing markdown:', error);
            markdownContainer.innerHTML = `<p>Erreur lors du rendu du contenu.</p>`;
        }
    }

    // Navigation buttons
    updateNavigationButtons();

    // Afficher le modal
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Scroll to top du modal
    const modalContent = modal.querySelector('.blog-detail');
    if (modalContent) {
        modalContent.scrollTop = 0;
    }
}

/**
 * Fermer le modal
 */
function closeModal() {
    const modal = document.querySelector('#blogModal');
    if (!modal) return;

    console.log('[Blog] Fermeture modal');

    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    blogState.currentPost = null;
}

/**
 * Filtrer par catégorie
 */
function handleCategoryFilter(e) {
    const category = e.currentTarget.dataset.category;

    console.log('[Blog] Filtre catégorie:', category);

    blogState.currentFilter = category;

    // UI: Activer le bouton
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === category);
    });

    // Filtrer et afficher
    applyFilters();
    renderPosts();
}

/**
 * Recherche texte
 */
function handleSearch(e) {
    blogState.searchQuery = e.target.value.toLowerCase().trim();

    console.log('[Blog] Recherche:', blogState.searchQuery);

    applyFilters();
    renderPosts();
}

/**
 * Appliquer tous les filtres
 */
function applyFilters() {
    let posts = [...blogState.posts];

    // Filtre catégorie
    if (blogState.currentFilter !== 'all') {
        posts = posts.filter(post => post.category === blogState.currentFilter);
    }

    // Filtre recherche
    if (blogState.searchQuery) {
        posts = posts.filter(post => {
            const searchableText = `
                ${post.title}
                ${post.excerpt}
                ${post.content}
                ${post.tags.join(' ')}
            `.toLowerCase();

            return searchableText.includes(blogState.searchQuery);
        });
    }

    blogState.filteredPosts = posts;

    console.log(`[Blog] Filtres appliqués: ${posts.length} résultats`);
}

/**
 * Naviguer vers le post précédent
 */
function showPreviousPost() {
    const currentIndex = blogState.filteredPosts.findIndex(
        p => p.id === blogState.currentPost?.id
    );

    if (currentIndex > 0) {
        openPostModal(blogState.filteredPosts[currentIndex - 1].id);
    }
}

/**
 * Naviguer vers le post suivant
 */
function showNextPost() {
    const currentIndex = blogState.filteredPosts.findIndex(
        p => p.id === blogState.currentPost?.id
    );

    if (currentIndex < blogState.filteredPosts.length - 1) {
        openPostModal(blogState.filteredPosts[currentIndex + 1].id);
    }
}

/**
 * Mettre à jour les boutons de navigation
 */
function updateNavigationButtons() {
    const currentIndex = blogState.filteredPosts.findIndex(
        p => p.id === blogState.currentPost?.id
    );

    const prevBtn = document.querySelector('.btn-prev');
    const nextBtn = document.querySelector('.btn-next');

    if (prevBtn) {
        prevBtn.disabled = currentIndex === 0;
    }

    if (nextBtn) {
        nextBtn.disabled = currentIndex === blogState.filteredPosts.length - 1;
    }
}

/**
 * Incrémenter le compteur de vues
 */
async function incrementViews(postId) {
    try {
        const response = await fetch(`${API_BASE_URL}/blog/posts/${postId}/view`, {
            method: 'POST'
        });

        if (response.ok) {
            console.log('[Blog] Vues incrémentées pour:', postId);
        }
    } catch (error) {
        console.warn('[Blog] Erreur increment views:', error);
    }
}

/**
 * Formater une date
 */
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        return dateString;
    }
}

/**
 * Convertir un chemin d'image relatif en chemin complet avec BASE_PATH
 */
function getFullImagePath(imagePath) {
    if (!imagePath) return '';

    // Si l'URL est absolue (http:// ou https://), la retourner telle quelle
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }

    // Si l'image commence par '/', ajouter BASE_PATH
    if (imagePath.startsWith('/')) {
        return `${BASE_PATH}${imagePath}`;
    }

    // Sinon ajouter BASE_PATH et '/'
    return `${BASE_PATH}/${imagePath}`;
}

/**
 * Échapper HTML pour prévenir XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Afficher une erreur
 */
function showError() {
    const grid = document.querySelector('#blogGrid');
    if (grid) {
        grid.innerHTML = `
            <div class="error-message" style="
                max-width: 600px;
                margin: 40px auto;
                padding: 30px;
                background: rgba(239, 68, 68, 0.1);
                border: 2px solid rgba(239, 68, 68, 0.3);
                border-radius: 12px;
                text-align: center;
            ">
                <div style="font-size: 48px; margin-bottom: 20px;">🔧</div>
                <h3 style="color: #ef4444; margin-bottom: 15px; font-size: 24px;">
                    Service Temporairement Indisponible
                </h3>
                <p style="color: rgba(255, 255, 255, 0.8); margin-bottom: 15px; line-height: 1.6;">
                    Le serveur API est en cours de configuration.
                    <br>
                    Les articles seront de nouveau disponibles dans quelques minutes.
                </p>
                <p style="color: rgba(255, 255, 255, 0.6); font-size: 14px; margin-top: 20px;">
                    💡 Le blog contient 28 tutoriels DevOps sur Ansible, Terraform, Kubernetes, CI/CD, Docker, Cloud et plus encore.
                </p>
                <button
                    onclick="window.location.reload()"
                    style="
                        margin-top: 20px;
                        padding: 12px 24px;
                        background: #ef4444;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 16px;
                        font-weight: bold;
                    "
                    onmouseover="this.style.background='#dc2626'"
                    onmouseout="this.style.background='#ef4444'"
                >
                    🔄 Réessayer
                </button>
            </div>
        `;
    }
}

// ===================================
// INITIALISATION AUTOMATIQUE
// ===================================
console.log('[Blog Module] Module chargé, readyState:', document.readyState);

// Initialiser le blog quand le DOM est prêt
if (document.readyState === 'loading') {
    console.log('[Blog Module] En attente du DOMContentLoaded...');
    document.addEventListener('DOMContentLoaded', initBlog);
} else {
    // DOM déjà chargé, initialiser immédiatement
    console.log('[Blog Module] DOM déjà chargé, initialisation immédiate...');
    initBlog();
}

// Export pour utilisation dans d'autres modules si besoin
export { initBlog, blogState };
