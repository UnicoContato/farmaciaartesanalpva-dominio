const header = document.getElementById('header')
const menuToggle = document.getElementById('menuToggle')
const mobileMenu = document.getElementById('mobileMenu')
const mobileLinks = mobileMenu.querySelectorAll('a')
const privacyModal = document.getElementById('privacyModal')
const openPrivacy = document.getElementById('openPrivacy')
const lightbox = document.getElementById('lightbox')
const lightboxImage = document.getElementById('lightboxImage')
const galleryItems = document.querySelectorAll('.gallery-item')
const navLinks = document.querySelectorAll('.nav-link')
const sections = document.querySelectorAll('main section[id]')
let lastScroll = 0

const setMenu = open => {
  menuToggle.classList.toggle('is-open', open)
  mobileMenu.classList.toggle('is-open', open)
  menuToggle.setAttribute('aria-expanded', String(open))
  menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu')
  mobileMenu.setAttribute('aria-hidden', String(!open))
}

menuToggle.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('is-open')))
mobileLinks.forEach(link => link.addEventListener('click', () => setMenu(false)))

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY
  const menuOpen = mobileMenu.classList.contains('is-open')
  header.classList.toggle('header-hidden', currentScroll > lastScroll && currentScroll > 140 && !menuOpen)
  lastScroll = Math.max(currentScroll, 0)
}, { passive: true })

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible')
      revealObserver.unobserve(entry.target)
    }
  })
}, { threshold: 0.12, rootMargin: '0px 0px -40px' })

document.querySelectorAll('.reveal').forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 3, 2) * 90}ms`
  revealObserver.observe(element)
})

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`))
    }
  })
}, { rootMargin: '-35% 0px -55%', threshold: 0 })

sections.forEach(section => navObserver.observe(section))

const openModal = modal => {
  modal.classList.add('is-open')
  modal.setAttribute('aria-hidden', 'false')
  document.body.style.overflow = 'hidden'
}

const closeModal = modal => {
  modal.classList.remove('is-open')
  modal.setAttribute('aria-hidden', 'true')
  document.body.style.overflow = ''
}

openPrivacy.addEventListener('click', () => {
  openModal(privacyModal)
  privacyModal.querySelector('.modal-close').focus()
})

privacyModal.querySelectorAll('[data-close-modal]').forEach(element => element.addEventListener('click', () => closeModal(privacyModal)))

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    lightboxImage.src = item.dataset.image
    lightboxImage.alt = item.dataset.alt
    openModal(lightbox)
    lightbox.querySelector('.lightbox-close').focus()
  })
})

lightbox.querySelectorAll('[data-close-lightbox]').forEach(element => element.addEventListener('click', () => closeModal(lightbox)))

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    if (privacyModal.classList.contains('is-open')) closeModal(privacyModal)
    if (lightbox.classList.contains('is-open')) closeModal(lightbox)
    if (mobileMenu.classList.contains('is-open')) setMenu(false)
  }
})

document.getElementById('currentYear').textContent = new Date().getFullYear()
