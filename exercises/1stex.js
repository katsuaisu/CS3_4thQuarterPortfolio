// ---- STAR RATING STUFF ----
let rating = 0;
const stars = document.querySelectorAll('.star');

// click handler for the stars
// supports half stars too (click left half = half star)
document.getElementById('star-input-container').onclick = function (e) {
    if (e.target.classList.contains('star')) {
        const box = e.target.getBoundingClientRect();
        const isHalf = (e.clientX - box.left) < (box.width / 2);
        const val = parseInt(e.target.dataset.value);

        rating = isHalf ? val - 0.5 : val;

        // repaint the stars visually
        // i love css
        stars.forEach((s, i) => {
            s.className = 'star'; // wipe it first
            if (i + 1 <= rating) s.classList.add('full');
            else if (i + 0.5 === rating) s.classList.add('half');
        });
    }
};


// ---- GENRE TAG COLORS ----
// color map for each genre
const genreColors = {
    'Action': { bg: '#ffe0b2', color: '#e65c00' },
    'Drama': { bg: '#e1d5f7', color: '#7c3aed' },
    'Comedy': { bg: '#d4f5d4', color: '#2e7d32' },
    'Sci-Fi': { bg: '#b3ecff', color: '#0277bd' },
    'Horror': { bg: '#ffd6d6', color: '#c62828' },
    'Romance': { bg: '#ffe0f0', color: '#d81b60' },
    'Animation': { bg: '#fff9c4', color: '#f57f17' },
};


// ---- RENDER MOVIE LIST ----
const list = document.getElementById('movieList');

function render() {
    list.innerHTML = '';

    // grab whatever's in storage (or empty array if nothing)
    const items = JSON.parse(localStorage.getItem('myMovies')) || [];

    // nothing saved yet
    if (items.length === 0) {
        list.innerHTML = '<p class="empty-msg">No movies yet... add one! 🎀</p>';
        return;
    }

    items.forEach((m, index) => {
        const div = document.createElement('div');
        div.className = 'movie-card';

        // build star display string (full, half, empty)
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= m.rating) {
                starsHtml += '<span>★</span>';
            } else if (i - 0.5 === m.rating) {
                // half star using unicode trick - close enough LMAO
                starsHtml += '<span style="opacity:0.6">★</span>';
            } else {
                starsHtml += '<span class="empty-star">★</span>';
            }
        }

        // pick the genre color, fallback to default if something weird
        const gc = genreColors[m.genre] || { bg: '#eee', color: '#555' };

        div.innerHTML = `
            <div class="movie-info">
                <strong>${m.title}</strong> <span style="color:#aaa;font-size:0.85rem">(${m.year || '??'})</span><br>
                <span class="genre-tag" style="background:${gc.bg};color:${gc.color}">${m.genre}</span>
                <span style="margin-left:6px;font-size:0.8rem;color:#aaa">×${m.ratingCount || 1} rated</span><br>
                <span class="card-stars">${starsHtml}</span>
                <span style="font-size:0.8rem;color:#bbb;margin-left:4px">${m.rating}★</span>
            </div>
            <button class="delete-btn" data-index="${index}">✕ del</button>
        `;

        list.appendChild(div);
    });

    // hook up all delete buttons after rendering
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.onclick = function () {
            const i = parseInt(this.dataset.index);
            deleteMovie(i);
        };
    });
}


// ---- DELETE MOVIE ----
function deleteMovie(index) {
    const items = JSON.parse(localStorage.getItem('myMovies')) || [];
    const movieName = items[index].title;

    // confirmation popup before actually deleting
    const confirmed = confirm(`Remove "${movieName}" from your list?`);
    if (!confirmed) return; // do nothing

    items.splice(index, 1); // rip it out
    localStorage.setItem('myMovies', JSON.stringify(items));
    render();
}


// ---- ADD / UPDATE MOVIE ----
document.getElementById('addBtn').onclick = function () {
    const title = document.getElementById('movieTitle').value.trim();
    const year = document.getElementById('movieYear').value.trim();
    const genre = document.getElementById('movieGenre').value;

    // basic validation - title and at least 1 star . . .?? 
    if (!title || rating === 0) {
        alert("Please fill in the title and give it a rating ");
        return;
    }

    const saved = JSON.parse(localStorage.getItem('myMovies')) || [];

    // check if this title already exists (case-insensitive )
    const existingIndex = saved.findIndex(
        m => m.title.toLowerCase() === title.toLowerCase()
    );

    if (existingIndex !== -1) {
        // UPDATE: average the old rating with the new one
        const old = saved[existingIndex];
        const prevCount = old.ratingCount || 1; // how many times it's been rated
        const newAvg = ((old.rating * prevCount) + rating) / (prevCount + 1);

        // round to nearest 0.5 so stars still display nicely
        const rounded = Math.round(newAvg * 2) / 2;

        saved[existingIndex] = {
            title: old.title, // keep original capitalization
            year: year || old.year, // update year if provided, keep old otherwise
            genre: genre,
            rating: rounded,
            ratingCount: prevCount + 1
        };

        alert(`Updated "${old.title}"! New avg rating: ${rounded}★ (${prevCount + 1} ratings) ✨`);

    } else {
        // NEW MOVIE - just push it in
        saved.push({
            title,
            year,
            genre,
            rating,
            ratingCount: 1
        });
    }

    localStorage.setItem('myMovies', JSON.stringify(saved));

    // reset the form fields
    document.getElementById('movieTitle').value = '';
    document.getElementById('movieYear').value = '';
    rating = 0;
    stars.forEach(s => s.className = 'star'); // clear star highlights

    render();
};



render();