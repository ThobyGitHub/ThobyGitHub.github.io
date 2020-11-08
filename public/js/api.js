
const API_KEY = "16d85bf702974259b17e4dff4faeade4";
const BASE_URL = "https://api.football-data.org/v2/";

const TEAM_ID = 61;
const ENDPOINT_MATCH = `${BASE_URL}teams/${TEAM_ID}/matches`;
const ENDPOINT_TEAM = `${BASE_URL}teams/${TEAM_ID}`;

// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}
// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}
// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}

const fetchAPI = url => {
  return fetch(url, {
      headers: {
          'X-Auth-Token': API_KEY
      }
  })
      .then(status)
      .then(json)
      .catch(err => {
          console.log(err)
      })
};

function showMatch(data){
  var matchHTML = "";
  data.matches.forEach(function(match) {
      matchHTML += `
          <div class="card">
            <a href="./match.html?id=${match.id}">
              <div class="card-image waves-effect waves-block waves-light">
                <img src="${match.competition.area.ensignUrl}" />
              </div>
            </a>
            <div class="card-content">
              <span class="card-title truncate">${match.competition.name}</span>
              <p>${match.homeTeam.name} vs ${match.awayTeam.name}</p>
              <P>SCORE: ${match.score.fullTime.homeTeam} - ${match.score.fullTime.awayTeam}</p>
            </div>
          </div>
        `;
  });
  // Sisipkan komponen card ke dalam elemen dengan id #content
  document.getElementById("match").innerHTML = matchHTML;
}

function showMatchById(data){
  var matchHTML = "";
  matchHTML += `
      <div class="card">
        <div class="card-image waves-effect waves-block waves-light">
          <img src="${data.match.competition.area.ensignUrl}" />
        </div>
        <div class="card-content">
          <span class="card-title truncate">${data.match.competition.name}</span>
          <p>${data.match.homeTeam.name} vs ${data.match.awayTeam.name}</p>
          <p>SCORE Fulltime: ${data.match.score.fullTime.homeTeam} - ${data.match.score.fullTime.awayTeam}</p>
          <p>SCORE Halftime: ${data.match.score.halfTime.homeTeam} - ${data.match.score.halfTime.awayTeam}</p>
        </div>
      </div>
    `;
  // Sisipkan komponen card ke dalam elemen dengan id #content
  document.getElementById("body-content").innerHTML = matchHTML;
}

function showTeam(data){
  var teamHTML = "";
  data.squad.forEach(function(team) {
      teamHTML += `
          <div class="card">
            <div class="card-image waves-effect waves-block waves-light col-s12">
              <img class="responsive-img" src="../img/photo.png" alt="People image" style="max-height:10em; max-width:10em; text-align:center; margin:auto; padding-top:10px;">
            </div>
            <div class="card-content">
              <span class="card-title truncate">${team.name}</span>
              <p>Position : ${team.position}</p>
              <p>Negara : ${team.countryOfBirth}</p>
              <p>Nomor : ${team.shirtNumber}</p>
              <p>Role : ${team.role}</p>
            </div>
          </div>
        `;
  });
  // Sisipkan komponen card ke dalam elemen dengan id #content
  document.getElementById("team").innerHTML = teamHTML;
}

// Blok kode untuk melakukan request data json
function getMatch() {
    if ('caches' in window) {
        caches.match(ENDPOINT_MATCH).then(function(response) {
          if (response) {
            response.json().then(function (data) {
              showMatch(data);
            })
          }
        })
    }

  fetchAPI(ENDPOINT_MATCH)
    .then(function(data) {
      showMatch(data);
    })
    .catch(error);
}

function getMatchById() {
  return new Promise(function(resolve, reject) {
    // Ambil nilai query parameter (?id=)
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("id");

    if ('caches' in window) {
      caches.match(`${BASE_URL}matches/${idParam}`).then(function(response) {
        if (response) {
          response.json().then(function (data) {
            showMatchById(data);
            resolve(data);
          })
        }
      })
    }

    fetchAPI(`${BASE_URL}matches/${idParam}`)
      .then(function(data) {
        showMatchById(data);
        resolve(data);
      })
      .catch(error);
    });
}

function getTeam() {
  if ('caches' in window) {
      caches.match(ENDPOINT_TEAM).then(function(response) {
        if (response) {
          response.json().then(function (data) {
            showTeam(data);
          })
        }
      })
  }

  fetchAPI(ENDPOINT_TEAM)
  .then(function(data) {
    showTeam(data);
  })
  .catch(error);
}

function getSavedMatches() {
  getAll().then(function(match) {
    console.log(match);
    // Menyusun komponen card artikel secara dinamis
    var matchHTML = "";
    match.forEach(function(match) {
      matchHTML += `
        <div class="card">
          <div class="card-image waves-effect waves-block waves-light">
            <img src="${match.competition.area.ensignUrl}" />
          </div>
          <div class="card-content">
            <span class="card-title truncate">${match.competition.name}</span>
            <p>${match.homeTeam.name} vs ${match.awayTeam.name}</p>
            <p>SCORE Fulltime: ${match.score.fullTime.homeTeam} - ${match.score.fullTime.awayTeam}</p>
            <p>SCORE Halftime: ${match.score.halfTime.homeTeam} - ${match.score.halfTime.awayTeam}</p>
          </div>
          <div class="container" style="text-align:right; margin-right:0;">
            <button class="btn red" id="unsave" onclick="unsaveMatch(${match.id})">
              unsave
            </button>
          </div>
        </div>
      `;
    });
    // Sisipkan komponen card ke dalam elemen dengan id #body-content
    document.getElementById("matches").innerHTML = matchHTML;
  });
}

function getSavedArticleById() {
  var urlParams = new URLSearchParams(window.location.search);
  var idParam = urlParams.get("id");
  
  getById(idParam).then(function(article) {
    articleHTML = '';
    var articleHTML = `
    <div class="card">
      <div class="card-image waves-effect waves-block waves-light">
        <img src="${article.cover}" />
      </div>
      <div class="card-content">
        <span class="card-title">${article.post_title}</span>
        ${snarkdown(article.post_content)}
      </div>
    </div>
  `;
    // Sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById("body-content").innerHTML = articleHTML;
  });
}