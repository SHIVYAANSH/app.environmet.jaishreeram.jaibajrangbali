const GEMINI_API_KEY = "AIzaSyA9K-18UsgQIq4pPmkPx6QW8Q5hjYG4Pdw";

const tips = [
  { title: "Take shorter showers", desc: "Reduce your shower time by 2 minutes to save water daily." },
  { title: "Turn off taps", desc: "While brushing or washing hands — saves litres every day." },
  { title: "Fix leaking taps", desc: "A single drip per second wastes over 11,000 litres a year." },
  { title: "Use a bucket, not a hose", desc: "Especially while washing vehicles or watering plants." },
  { title: "Harvest rainwater", desc: "Collect and use rainwater for cleaning and gardening." },
  { title: "Use low-flow fixtures", desc: "Install water-saving toilets and faucets at home." },
  { title: "Run full loads only", desc: "Don’t waste water on small laundry or dish cycles." },
  { title: "Spread awareness", desc: "Educate your friends and family about saving water!" }
];

const tipsGrid = document.getElementById("tipsGrid");

function typeWriterEffect(element, text, delay = 28) {
  return new Promise(resolve => {
    element.innerHTML = "";
    let i = 0;
    const typing = setInterval(() => {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
      } else {
        clearInterval(typing);
        resolve();
      }
    }, delay);
  });
}

async function generateSolutionsSequentially() {
  for (let i = 0; i < tips.length; i++) {
    const { title, desc } = tips[i];

    const card = document.createElement("div");
    card.className = "tip-card";
    card.style.transition = "transform 0.4s ease";
    card.style.opacity = 0;
    card.innerHTML = `
      <h3 id="line1-${i}" style="color: #16a34a; font-size: 18px; font-weight: 600;">🤖 Thinking...</h3>

      <h3 id="line1-${i}" style="color: #16a34a; font-size: 18px; font-weight: 600;"></h3>
      <p id="line2-${i}" style="color: #1e293b; font-weight: bold; font-size: 16px;"></p>
      <p id="line3-${i}" style="color: #334155; font-size: 14.5px;"></p>
      <p id="line4-${i}" style="color: #0f766e; font-style: italic; font-size: 14px;"></p>
    `;
    tipsGrid.appendChild(card);

    // Fade-in effect
    setTimeout(() => {
      card.style.opacity = 1;
      card.style.transform = "scale(1)";
    }, 100);

    try {
      const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + GEMINI_API_KEY, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You're helping a student win a competition. Create a PERFECT 4-line version of this water-saving tip:\n"${title} – ${desc}"\nMake it:\n- Engaging (not boring)\n- Emotional and powerful\n- Modern and punchy\n- Real and short\nReturn:\n1. An emoji + catchy heading\n2. A bold, sharp action line\n3. One clear benefit or motivation\n4. A heart-touching or wow fact to end.\nSeparate all 4 by new lines. Keep it simple, clean and superb.`
            }]
          }]
        })
      });

      const data = await res.json();
      const lines = data?.candidates?.[0]?.content?.parts?.[0]?.text.trim().split("\n").filter(Boolean) || [];

      const l1 = document.getElementById(`line1-${i}`);
      const l2 = document.getElementById(`line2-${i}`);
      const l3 = document.getElementById(`line3-${i}`);
      const l4 = document.getElementById(`line4-${i}`);

      await typeWriterEffect(l1, lines[0] || "💧 Water Wins Start Small");
      await typeWriterEffect(l2, lines[1] || title);
      await typeWriterEffect(l3, lines[2] || desc);
      await typeWriterEffect(l4, lines[3] || "One small habit = thousands of litres saved.");
    } catch (e) {
      document.getElementById(`line1-${i}`).innerText = "⚠️ Failed to load";
      document.getElementById(`line2-${i}`).innerText = title;
      document.getElementById(`line3-${i}`).innerText = desc;
      document.getElementById(`line4-${i}`).innerText = "Try refreshing or check your internet/API key.";
    }

    await new Promise(res => setTimeout(res, 700)); // buffer before next tip
  }
}

generateSolutionsSequentially();

// Scroll arrow logic
const scrollArrow = document.createElement("div");
scrollArrow.id = "scrollArrow";
scrollArrow.innerHTML = `
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#15803d" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <polyline points="5 12 12 19 19 12" />
  </svg>`;
scrollArrow.style.position = "fixed";
scrollArrow.style.bottom = "30px";
scrollArrow.style.left = "50%";
scrollArrow.style.transform = "translateX(-50%)";
scrollArrow.style.cursor = "pointer";
scrollArrow.style.zIndex = "9999";
scrollArrow.style.animation = "bounce 1.2s infinite ease-in-out";
scrollArrow.style.transition = "opacity 0.3s ease";
document.body.appendChild(scrollArrow);

scrollArrow.addEventListener("click", () => {
  window.scrollBy({ top: window.innerHeight / 2, behavior: "smooth" });
});

window.addEventListener("scroll", () => {
  const bottomReached = (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 50);
  scrollArrow.style.opacity = bottomReached ? "0" : "1";
});
