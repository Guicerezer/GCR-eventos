/* ======================================================================
   GALERIA — edite esta lista para adicionar, remover ou trocar fotos/vídeos
   ======================================================================
   type: "image" ou "video"
   src: caminho do arquivo dentro da pasta imagens/
   caption: legenda que aparece no hover e no lightbox
   big: true deixa o item maior no grid (use em só 1 ou 2 itens de destaque)
*/
const galleryItems = [
    { type: 'image', src: 'imagens/img_7112.jpg', caption: 'Festa de 15 anos · Pista Paris', big: true },
    { type: 'video', src: 'imagens/video1-comprimido.mp4', caption: 'Pista de dança em ação' },
    { type: 'image', src: 'imagens/IMG_0034.jpg', caption: 'Nosso DJ em ação' },
    { type: 'image', src: 'imagens/IMG_1619.jpg', caption: 'Iluminação de pista que transforma o ambiente.' },
    { type: 'video', src: 'imagens/video2-comprimido.mp4', caption: 'Casamento realizado em uma linda fazenda de café.' },

]




document.addEventListener('DOMContentLoaded', function () {

    // ---------- Renderização da galeria ----------
const galleryGrid = document.getElementById('gallery-grid');

function renderGallery() {
    if (!galleryGrid) return;

    galleryGrid.innerHTML = galleryItems.map(function (item, index) {
        const sizeClass = item.big ? 'span-2 span-row-2' : '';
        const playBadge = item.type === 'video'
            ? '<span class="play-badge"><i class="fa-solid fa-play"></i></span>'
            : '';

        const media = item.type === 'video'
            ? '<video src="' + item.src + '" muted loop autoplay playsinline preload="metadata"></video>'
            : '<img src="' + item.src + '" alt="' + (item.caption || '') + '" loading="lazy">';

        return '<div class="gallery-item ' + sizeClass + '" data-index="' + index + '" tabindex="0" role="button" aria-label="Ampliar ' + (item.caption || 'mídia') + '">' +
            media +
            playBadge +
            '<span class="gallery-caption">' + (item.caption || '') + '</span>' +
            '</div>';
    }).join('');

    galleryGrid.querySelectorAll('.gallery-item').forEach(function (el) {
        el.addEventListener('click', function () {
            openLightbox(parseInt(el.getAttribute('data-index'), 10));
        });
        el.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(parseInt(el.getAttribute('data-index'), 10));
            }
        });
    });
}

// ---------- Lightbox ----------
const lightbox = document.getElementById('lightbox');
const lightboxContent = document.getElementById('lightbox-content');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');

let currentIndex = 0;

function openLightbox(index) {
    currentIndex = index;
    renderLightboxItem();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    lightboxContent.innerHTML = '';
    document.body.style.overflow = '';
}

function renderLightboxItem() {
    const item = galleryItems[currentIndex];
    if (!item) return;

    lightboxContent.innerHTML = item.type === 'video'
        ? '<video src="' + item.src + '" controls autoplay playsinline></video>'
        : '<img src="' + item.src + '" alt="' + (item.caption || '') + '">';

    lightboxCaption.textContent = item.caption || '';
}

function showNext() {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    renderLightboxItem();
}

function showPrev() {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    renderLightboxItem();
}

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightboxNext) lightboxNext.addEventListener('click', showNext);
if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);

if (lightbox) {
    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}

document.addEventListener('keydown', function (e) {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
});

renderGallery();

    // ---------- Menu mobile ----------
    const mobileBtn = document.getElementById('mobile_btn');
    const mobileMenu = document.getElementById('mobile_menu');
    const mobileOverlay = document.getElementById('mobile_overlay');
    const mobileIcon = mobileBtn ? mobileBtn.querySelector('i') : null;

    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        if (mobileIcon) {
            mobileIcon.classList.remove('fa-x');
            mobileIcon.classList.add('fa-bars');
        }
    }

    function toggleMobileMenu() {
        mobileMenu.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        if (mobileIcon) {
            mobileIcon.classList.toggle('fa-bars');
            mobileIcon.classList.toggle('fa-x');
        }
    }

    if (mobileBtn) {
        mobileBtn.addEventListener('click', toggleMobileMenu);
    }

   if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileMenu);
    mobileOverlay.addEventListener('touchend', function(e) {
        e.preventDefault();
        closeMobileMenu();
    });
}

    document.querySelectorAll('#mobile_nav_list a').forEach(function (link) {
        link.addEventListener('click', closeMobileMenu);
    });

    // ---------- Item ativo do menu conforme scroll ----------
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-item');

    function setActiveNav() {
        let current = '';

        sections.forEach(function (section) {
            const top = section.getBoundingClientRect().top + window.scrollY - 120;
            if (window.scrollY >= top) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(function (item) {
            item.classList.remove('active');
            const link = item.querySelector('a');
            if (link && link.getAttribute('href') === '#' + current) {
                item.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', setActiveNav);
    setActiveNav();

    // ---------- Reveal ao rolar a página ----------
    const revealEls = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealEls.forEach(function (el) {
            observer.observe(el);
        });
    } else {
        revealEls.forEach(function (el) {
            el.classList.add('is-visible');
        });
    }

    // Seguranca extra: garante que tudo apareca mesmo se algo falhar
    window.addEventListener('load', function () {
        setTimeout(function () {
            revealEls.forEach(function (el) {
                el.classList.add('is-visible');
            });
        }, 2500);
    });

    // ---------- Formulario de contato -> WhatsApp ----------
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const inputs = contactForm.querySelectorAll('input, select, textarea');
            const nome = inputs[0].value;
            const tipoEvento = inputs[2].value;
            const data = inputs[3].value;
            const local = inputs[4].value;
            const mensagem = inputs[5].value;

            const texto = 'Olá! Meu nome é ' + nome + '.%0ATipo de evento: ' + tipoEvento +
    '%0AData: ' + (data || 'a definir') + '%0ALocal: ' + (local || 'a definir') +
    '%0AMensagem: ' + (mensagem ||  '-');

            window.open('https://wa.me/5519996110327?text=' + texto, '_blank');
        });
    }

// ---------- Contador animado nos números ----------
    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 1800;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = el.getAttribute('data-prefix') + Math.floor(eased * target) + el.getAttribute('data-suffix');
            if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    }

    const counterEls = document.querySelectorAll('.counter');
    if ('IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        counterEls.forEach(function (el) { counterObserver.observe(el); });
    }

});
