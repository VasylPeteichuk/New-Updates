// 0. Модалка з погодженням
// Показує модальне вікно з погодженням користувача. Якщо погодився раніше — не показує.
// Зберігає вибір у localStorage, щоб не турбувати повторно.
const config = { saveConsent: true, storageKey: 'mySiteUserConsent' };
const modal = document.getElementById('customModalWrapper');
const content = document.getElementById('customSiteContent');

window.onload = function () {
  if (config.saveConsent) {
    if (localStorage.getItem(config.storageKey) === 'true') {
      if (modal) modal.style.display = 'none';
      if (content) content.classList.remove('custom-blocked');
      return;
    }
  }
  if (content) content.classList.add('custom-blocked');
  if (modal) modal.style.display = 'flex';
};

function customAcceptTerms() {
  // Користувач погодився — зберігаємо і ховаємо модалку
  if (config.saveConsent) localStorage.setItem(config.storageKey, 'true');
  if (modal) modal.style.display = 'none';
  if (content) content.classList.remove('custom-blocked');
}

function customDenyAccess() {
  // Відмова — показуємо повідомлення, доступ заблокований
  alert("Ви не погодились. Доступ заборонено.");
}

// 1. Модалка Privacy
// Відкриває і закриває модальне вікно з інформацією про політику приватності
// Закривається при кліку на фон або натисканні Escape
(function(){
  const openBtn = document.getElementById('openPrivacyModal');
  const privacyModal = document.getElementById('privacyModal');
  const closeBtn = document.getElementById('closePrivacyModal');
  if (!openBtn || !privacyModal || !closeBtn) return;

  openBtn.addEventListener('click', () => {
    privacyModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // блокуємо прокрутку фону
  });
  closeBtn.addEventListener('click', () => {
    privacyModal.classList.remove('active');
    document.body.style.overflow = '';
  });
  privacyModal.addEventListener('click', e => {
    if (e.target === privacyModal) {
      privacyModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  document.addEventListener('keydown', e => {
    if (e.key === "Escape" && privacyModal.classList.contains('active')) {
      privacyModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
})();

// 2. Sticky navbar
// Фіксує navbar зверху при прокрутці сторінки
const navbar = document.getElementById("navbar");
const stickyOffset = navbar ? navbar.offsetTop : 0;
window.onscroll = () => {
  if (!navbar) return;
  if (window.pageYOffset >= stickyOffset) navbar.classList.add("sticky");
  else navbar.classList.remove("sticky");
};

// 3. Відкрити/закрити бокове меню (sidenav)
// Змінює ширину меню і відступ контенту при відкритті/закритті
function openNav() {
  const sidenav = document.getElementById("mySidenav");
  const main = document.getElementById("main");
  if (!sidenav || !main) return;
  sidenav.style.width = "250px";
  main.style.marginLeft = "250px";
  document.body.style.backgroundColor = "rgba(0,0,0,0.87)"; // затемнює фон
}
function closeNav() {
  const sidenav = document.getElementById("mySidenav");
  const main = document.getElementById("main");
  if (!sidenav || !main) return;
  sidenav.style.width = "0";
  main.style.marginLeft = "0";
  document.body.style.backgroundColor = "";
}

// 4. Карусель (галерея з прокруткою)
// Реалізує кнопки стрілок та можливість перетягування (drag) мишею/дотиком
// Після перетягування прокрутка автоматично "приклеюється" до картки
const carousel = document.querySelector(".carousel");
if (carousel) {
  const firstImage = carousel.querySelector("img");
  const arrowIcons = document.querySelectorAll(".wrapper i");
  let isDragging = false, startX = 0, scrollStart = 0, scrollDiff = 0;

  function toggleArrowIcons() {
    setTimeout(() => {
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      arrowIcons[0].style.display = carousel.scrollLeft <= 0 ? "none" : "block";
      arrowIcons[1].style.display = carousel.scrollLeft >= maxScroll ? "none" : "block";
    }, 100);
  }

  function scrollCarousel(dir) {
    const cardW = firstImage.clientWidth + 14;
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
    const delta = dir === "right" ? cardW : -cardW;
    carousel.scrollLeft = Math.min(Math.max(carousel.scrollLeft + delta, 0), maxScroll);
    toggleArrowIcons();
  }

  arrowIcons.forEach(icon => {
    icon.addEventListener("click", () => scrollCarousel(icon.id === "right" ? "right" : "left"));
  });

  function autoCenter() {
    const cardW = firstImage.clientWidth + 14;
    const offset = carousel.scrollLeft % cardW;
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
    if (carousel.scrollLeft > 0 && carousel.scrollLeft < maxScroll) {
      if (offset > cardW / 3) carousel.scrollLeft += cardW - offset;
      else carousel.scrollLeft -= offset;
    }
    toggleArrowIcons();
  }

  function startDrag(e) {
    isDragging = true;
    startX = e.type === "touchstart" ? e.touches[0].pageX : e.pageX;
    scrollStart = carousel.scrollLeft;
    carousel.classList.add("dragging");
  }

  function dragMove(e) {
    if (!isDragging) return;
    const currentX = e.type === "touchmove" ? e.touches[0].pageX : e.pageX;
    scrollDiff = currentX - startX;
    carousel.scrollLeft = scrollStart - scrollDiff;
  }

  function stopDrag() {
    if (!isDragging) return;
    isDragging = false;
    carousel.classList.remove("dragging");
    if (Math.abs(scrollDiff) > 10) autoCenter();
  }

  carousel.addEventListener("mousedown", startDrag);
  carousel.addEventListener("touchstart", startDrag);
  document.addEventListener("mousemove", dragMove);
  carousel.addEventListener("touchmove", dragMove);
  document.addEventListener("mouseup", stopDrag);
  carousel.addEventListener("touchend", stopDrag);

  toggleArrowIcons();
}

// 5. Реклама Carbon Ads fallback
// Перевіряє чи працює скрипт реклами, і якщо ні — завантажує fallback скрипт
try {
  fetch(new Request("", { method: 'HEAD', mode: 'no-cors' }))
    .then(() => true)
    .catch(() => {
      const script = document.createElement("script");
      script.src = "//cdn.carbonads.com/carbon.js?serve=CE7DC2JW&placement=wwwcssscriptcom";
      script.id = "_carbonads_js";
      document.getElementById("carbon-block").appendChild(script);
    });
} catch (e) {
  console.error("Помилка реклами:", e);
}

// 6. Google Analytics
// Ініціалізує Google Analytics для відстеження відвідувань
window.dataLayer = window.dataLayer || [];
function gtag(){ dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-LLWL5N9CSM');

// 7. Кнопка "Вгору"
// Показує кнопку "вгору" при прокрутці вниз, плавно скролить догори при кліку
const btnUp = {
  el: document.querySelector('.btn-up'),
  show() { this.el.classList.remove('btn-up_hide'); },
  hide() { this.el.classList.add('btn-up_hide'); },
  addEventListener() {
    window.addEventListener('scroll', () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      y > 400 ? this.show() : this.hide();
    });
    this.el.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
if (btnUp.el) btnUp.addEventListener();

// 8. Аккордеон
// Розкриває/закриває секції при кліку, дозволяє відкривати лише одну секцію одночасно
document.querySelectorAll('.accordion-item').forEach(item => {
  const link = item.querySelector('.accordion-link');
  const answer = item.querySelector('.answer');

  link.addEventListener('click', e => {
    e.preventDefault();
    const isActive = item.classList.contains('active');
    // Закриваємо всі відкриті
    document.querySelectorAll('.accordion-item.active').forEach(open => {
      if (open !== item) {
        open.classList.remove('active');
        open.querySelector('.answer').style.maxHeight = null;
      }
    });
    // Відкриваємо/закриваємо поточний
    if (isActive) {
      item.classList.remove('active');
      answer.style.maxHeight = null;
    } else {
      item.classList.add('active');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

// 9. Відправка форми
// Перевіряє, чи заповнене ім'я, відправляє дані JSON на сервер, виводить повідомлення
function sendForm(event) {
  event.preventDefault();
  const form = event.target;
  if (form.username && form.username.value.trim() === "") {
    alert('Заповніть Ім\'я');
    return;
  }
  const data = Object.fromEntries(new FormData(form).entries());
  fetch('https://your-api-endpoint.example.com/api/send', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  })
  .then(res => { if (!res.ok) throw new Error('Помилка'); return res.json(); })
  .then(() => { alert('Успішно!'); form.reset(); })
  .catch(err => alert('Помилка: ' + err.message));
}
