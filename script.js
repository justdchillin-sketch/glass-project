/**
 * Glassmorphism UI Showcase Script
 * Pure Vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initCopyButton();
    setupParallax();
    setupRouting();
    setupScrollReveal();
    setupLibrarySearch();
    setupFormValidation();
    setupInteractions();
    setupLightbox();
    setupLibraryNavigation();
});

/**
 * Showcase Lightbox
 */
function setupLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('lightbox-close');
    
    // We use event delegation for better reliability with dynamic elements
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('.lightbox-trigger');
        if (trigger) {
            lightboxImg.src = trigger.src;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Log for debugging
            console.log("Lightbox activated for:", trigger.src);
        }
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
    });
}

/**
 * Library Component Preview Logic
 */
function setupLibraryNavigation() {
    const items = document.querySelectorAll('.search-item.clickable');
    const renderArea = document.getElementById('preview-render');
    const codeArea = document.getElementById('css-code');
    const codeLabel = document.getElementById('code-label');

    const componentData = {
        'primary-btn': {
            label: 'PRIMARY BUTTON',
            render: '<button class="glass-preview-btn">Premium Action</button>',
            code: `.glass-btn {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 50px;
  padding: 1rem 2rem;
}`
        },
        'glass-input': {
            label: 'GLASS INPUT',
            render: '<input type="text" class="glass-input" placeholder="Type here..." style="padding-left: 1rem; width: 250px;">',
            code: `.glass-input {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 0.8rem 1rem;
}`
        },
        'glass-switch': {
            label: 'FROSTED SWITCH',
            render: '<div class="glass-preview-switch" id="demo-switch"></div>',
            code: `.glass-switch {
  width: 60px;
  height: 30px;
  background: rgba(255,255,255,0.1);
  border-radius: 30px;
}`,
            init: () => {
                const sw = document.getElementById('demo-switch');
                sw.onclick = () => sw.classList.toggle('on');
            }
        },
        'glass-card': {
            label: 'UI CARD',
            render: '<div class="glass-card" style="width: 250px; padding: 1.5rem;"><h4>Glass Card</h4><p style="font-size: 0.8rem; opacity: 0.7;">Premium container component.</p></div>',
            code: `.glass-card {
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 24px;
}`
        },
        'glass-loader': {
            label: 'ACTIVITY LOADER',
            render: '<div class="glass-preview-loader"></div>',
            code: `@keyframes rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.loader {
  border: 5px solid rgba(255,255,255,0.1);
  border-bottom-color: var(--accent-color);
  border-radius: 50%;
  animation: rotation 1s linear infinite;
}`
        }
    };

    items.forEach(item => {
        item.addEventListener('click', () => {
            const id = item.getAttribute('data-id');
            const data = componentData[id];

            if (data) {
                // Update Sidebar
                items.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                // Update Preview
                renderArea.innerHTML = data.render;
                codeLabel.textContent = data.label;
                codeArea.innerHTML = `<code>${data.code}</code>`;
                
                if (data.init) data.init();
            }
        });
    });
}

/**
 * Library Search Logic
 */
function setupLibrarySearch() {
    const searchInput = document.getElementById('lib-search');
    const clearBtn = document.getElementById('clear-search');
    const items = document.querySelectorAll('.search-item');

    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase();
        clearBtn.style.display = val ? 'block' : 'none';

        items.forEach(item => {
            const tags = (item.getAttribute('data-tags') || '').toLowerCase();
            const text = item.textContent.toLowerCase();
            if (tags.includes(val) || text.includes(val)) {
                item.classList.remove('hidden');
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            } else {
                item.classList.add('hidden');
            }
        });
    });

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const firstVisible = document.querySelector('.search-item:not(.hidden)');
            if (firstVisible) {
                firstVisible.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstVisible.style.borderColor = 'var(--accent-color)';
                setTimeout(() => firstVisible.style.borderColor = '', 1000);
            }
        }
    });

    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
        searchInput.focus();
    });
}

/**
 * Real-time Form Validation
 */
function setupFormValidation() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const msgInput = document.getElementById('form-message');
    const submitBtn = document.getElementById('submit-btn');

    const nameHint = document.getElementById('name-hint');
    const emailHint = document.getElementById('email-hint');
    const msgHint = document.getElementById('msg-hint');

    const validate = () => {
        const isNameValid = nameInput.value.length >= 3;
        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value) && emailInput.value.endsWith('.com');
        const isMsgValid = msgInput.value.length >= 20;

        // Update hints
        updateHint(nameHint, isNameValid, nameInput.value.length > 0);
        updateHint(emailHint, isEmailValid, emailInput.value.length > 0);
        updateHint(msgHint, isMsgValid, msgInput.value.length > 0);

        if (isNameValid && isEmailValid && isMsgValid) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('disabled');
        } else {
            submitBtn.disabled = true;
            submitBtn.classList.add('disabled');
        }
    };

    const updateHint = (el, isValid, isDirty) => {
        if (!isDirty) {
            el.classList.remove('valid', 'invalid');
            return;
        }
        if (isValid) {
            el.classList.add('valid');
            el.classList.remove('invalid');
        } else {
            el.classList.add('invalid');
            el.classList.remove('valid');
        }
    };

    [nameInput, emailInput, msgInput].forEach(input => {
        input.addEventListener('input', validate);
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        navigateTo('success');
        form.reset();
        validate();
    });
}

/**
 * UI Interactions (Dice, etc.)
 */
function setupInteractions() {
    const dice = document.getElementById('dice-roll');
    const diceVal = document.getElementById('dice-val');

    if (dice) {
        dice.addEventListener('click', () => {
            const roll = Math.floor(Math.random() * 6) + 1;
            dice.style.transform = `scale(0.8) rotate(${Math.random() * 360}deg)`;
            
            setTimeout(() => {
                diceVal.textContent = roll;
                dice.style.transform = 'scale(1) rotate(0deg)';
                // Sparkle effect
                const coin = document.querySelector('.coin');
                if (coin) coin.style.animation = 'none';
                setTimeout(() => { if (coin) coin.style.animation = ''; }, 10);
            }, 200);
        });
    }
}

/**
 * Navigation Routing
 */
function setupRouting() {
    const navLinks = document.querySelectorAll('.nav-item');
    const logo = document.getElementById('nav-logo');

    const handleNavigation = (targetId) => {
        // Update active page
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        const targetPage = document.getElementById(targetId);
        if (targetPage) {
            targetPage.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Update active nav link
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === targetId) {
                link.classList.add('active');
            }
        });

        // Update URL hash without jumping
        history.pushState(null, null, `#${targetId}`);
        
        // Refresh icons for new content if needed
        if (window.lucide) window.lucide.createIcons();
    };

    window.triggerNavigation = handleNavigation;

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('data-page');
            handleNavigation(target);
        });
    });

    logo.addEventListener('click', () => handleNavigation('home'));

    // Handle initial load or back/forward
    window.addEventListener('popstate', () => {
        const hash = window.location.hash.substring(1) || 'home';
        handleNavigation(hash);
    });

    // Check initial hash
    const initialHash = window.location.hash.substring(1);
    if (initialHash && document.getElementById(initialHash)) {
        handleNavigation(initialHash);
    }
}

// Exposed global for simple button navigation
window.navigateTo = (pageId) => {
    // If the function is called, manually trigger handleNavigation directly
    if (typeof window.triggerNavigation === 'function') {
        window.triggerNavigation(pageId);
    } else {
        const navItem = document.querySelector(`.nav-item[data-page="${pageId}"]`);
        if (navItem) {
            navItem.click();
        } else {
            // Fallback: manually update classes if handleNavigation isn't exposed properly
            document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
            const target = document.getElementById(pageId);
            if (target) target.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            history.pushState(null, null, `#${pageId}`);
        }
    }
};
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
        updateToggleButton(savedTheme);
    } else if (prefersDark.matches) {
        document.body.setAttribute('data-theme', 'dark');
        updateToggleButton('dark');
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateToggleButton(newTheme);
    });
}

function updateToggleButton(theme) {
    const themeBtn = document.getElementById('theme-toggle');
    if (!themeBtn) return;

    const icon = themeBtn.querySelector('[data-lucide]') || themeBtn.querySelector('svg');
    const text = themeBtn.querySelector('span');
    
    if (text) {
        text.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
    }

    if (icon) {
        icon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
        // Re-run lucide to replace the icon
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
}

/**
 * Copy to Clipboard functionality
 */
function initCopyButton() {
    const copyBtn = document.getElementById('copy-btn');
    const codeEl = document.getElementById('css-code');
    
    if (!copyBtn || !codeEl) return;

    const codeSnippet = codeEl.innerText;

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(codeSnippet).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            copyBtn.style.background = 'var(--blob-3)';
            
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.background = 'rgba(255,255,255,0.1)';
            }, 2000);
        });
    });
}

/**
 * Subtle parallax for background blobs
 */
function setupParallax() {
    document.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
        
        const blobs = document.querySelectorAll('.blob');
        blobs.forEach((blob, index) => {
            const speed = (index + 1) * 0.5;
            blob.style.transform = `translate(${moveX * speed}px, ${moveY * speed}px)`;
        });
    });
}

/**
 * Simple Scroll Reveal
 */
function setupScrollReveal() {
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.glass-card, .section-title');
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
}
