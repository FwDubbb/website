//Some things in here might be unnecessary and unrelated to the website
//I made many changes to the website whilst building it, so ignore those.


const mainText = document.getElementById("typed-text");
const extraText = document.getElementById("typed-extra");

async function typeText(element, text, speed = 100) {
  for (let i = 0; i < text.length; i++) {
    element.textContent += text[i];
    await new Promise(res => setTimeout(res, speed));
  }
}

async function deleteText(to = 0, speed = 50) {
  while (mainText.textContent.length > to) {
    mainText.textContent = mainText.textContent.slice(0, -1);
    await new Promise(res => setTimeout(res, speed));
  }
}

async function runTypewriter() {
  await typeText(mainText, "Major - Software Engineering. Minor- None~2023");
  await new Promise(res => setTimeout(res, 800));

  await deleteText("Major - Software Engineering. Minor- ".length);
  await new Promise(res => setTimeout(res, 600));



  extraText.style.opacity = 1;
  await typeText(extraText, "Cybersecurity~2025:)", 70);
}

runTypewriter();


//  Scroll-in and Project Descriptions Typewriter 
function typeWriterEffect(el, text, speed = 20) {
  let i = 0;
  function type() {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.classList.contains('show')) {
      entry.target.classList.add('show');


      const description = entry.target.querySelector('.project-description');
      if (description && description.dataset.text && !description.classList.contains('typed')) {
        description.classList.add('typed');
        typeWriterEffect(description, description.dataset.text, 20);
      }
    }
  });
}, { threshold: 0.3 });


document.querySelectorAll('.project-row').forEach(row => {
  observer.observe(row);
});

let currentSlide = 0;
const slides = document.querySelectorAll('.slide-img');

function showSlide(index) {
  slides.forEach((img, i) => {
    img.classList.remove('active');
    if (i === index) img.classList.add('active');
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

// Initialize
showSlide(currentSlide);
setInterval(nextSlide, 3000); 


document.querySelectorAll('.school-card').forEach(card => {
  card.addEventListener('click', () => {

    card.classList.toggle('flipped');

  });
});


document.querySelectorAll('.read-more').forEach(button => {
  button.addEventListener('click', () => {
    const fullText = button.previousElementSibling;
    fullText.classList.toggle('hidden');
    button.textContent = fullText.classList.contains('hidden') ? 'Read More' : 'Read Less';
  });
});



