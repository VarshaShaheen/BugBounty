const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSzRyX-vmf8Q8o_ADAT8C70IjLizGxjn2xXVxVT5Hn857LZSMf3aw5L2L6MGqg2Dht0HDyJ6AafGaIA/pub?gid=1270119593&single=true&output=csv";

/*
  We'll display:
    - 2nd place => "two.png"
    - 1st place => "three.png"
    - 3rd place => "one.png"

  Because in createPodium(), we have order = [1, 0, 2].
  => index=0 => 2nd place => 'two.png'
  => index=1 => 1st place => 'three.png'
  => index=2 => 3rd place => 'one.png'
*/
const podiumImages = ["two.png", "three.png", "one.png"];

function parseCSV(text) {
  const lines = text.trim().split("\n");
  const [headerLine, ...rows] = lines;
  const headers = headerLine.split(",");

  const emailIndex = headers.findIndex(h => h.toLowerCase().includes("email"));
  const pointsIndex = headers.findIndex(h => h.toLowerCase().includes("point"));

  // Remove trailing empty line if present
  if (rows.length > 1) rows.pop();

  return rows.map(line => {
    const cols = line.split(",");
    const email = cols[emailIndex]?.trim();
    const name = email?.split("@")[0]; // portion before '@'
    return {
      email,
      name,
      points: parseInt(cols[pointsIndex]?.trim()) || 0
    };
  });
}

async function loadData() {
  try {
    const response = await fetch(CSV_URL);
    const csvText = await response.text();
    let users = parseCSV(csvText);

    // Filter out invalid entries
    users = users.filter(u => u.email && !isNaN(u.points));

    // Sort descending by points
    users.sort((a, b) => b.points - a.points);

    const top3 = users.slice(0, 3);
    const rest = users.slice(3);

    createPodium(top3);
    fillTable(rest);
  } catch (error) {
    console.error("Error loading or parsing CSV:", error);
  }
}

function createPodium(top3) {
  const podium = document.getElementById("podium");
  // The array order => [1, 0, 2] => 2nd, 1st, 3rd
  const order = [1, 0, 2];
  const podiumClasses = ["podium-second", "podium-first", "podium-third"];

  order.forEach((posIndex, idx) => {
    const user = top3[posIndex];
    if (!user) return;

    const card = document.createElement("div");
    card.className = `podium-card ${podiumClasses[idx]}`;

    let contentHTML = `
      <h3>${user.name}</h3>
      <div class="points">${user.points} pts</div>
    `;

    // Add the respective image for each place
    const imageFile = podiumImages[idx];
    contentHTML += `
      <img
        src="images/${imageFile}"
        alt="Podium Image"
        class="podium-img"
      />
    `;

    card.innerHTML = contentHTML;
    podium.appendChild(card);
  });
}

function fillTable(users) {
  const tbody = document.querySelector("#leaderboard tbody");
  tbody.innerHTML = "";

  users.forEach((u, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${i + 4}</td>
      <td>${u.name}</td>
      <td>${u.points}</td>
    `;
    tbody.appendChild(row);
  });
}

// Initialize
loadData();
