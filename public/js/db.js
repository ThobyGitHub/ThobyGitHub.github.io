var dbPromised = idb.open("soccerball", 1, function(upgradeDb) {
    var articlesObjectStore = upgradeDb.createObjectStore("matches", {
      keyPath: "id"
    });
    // articlesObjectStore.createIndex("post_title", "post_title", { unique: false });
});

function saveMatch(match) {
    dbPromised
      .then(function(db) {
        var tx = db.transaction("matches", "readwrite");
        var store = tx.objectStore("matches");
        console.log(match);
        store.put(match);
        return tx.complete;
      })
      .then(function() {
        console.log("Match berhasil di simpan.");
      });
  }

function unSaveMatch(matchId) {
    dbPromised
        .then(function(db) {
        var tx = db.transaction("matches", "readwrite");
        var store = tx.objectStore("matches");
        console.log(matchId);
        store.delete(matchId);
        return tx.complete;
    })
    .then(function() {
    console.log("Match berhasil di hapus.");
    });
}

function getAll() {
    return new Promise(function(resolve, reject) {
        dbPromised
        .then(function(db) {
            var tx = db.transaction("matches", "readonly");
            var store = tx.objectStore("matches");
            return store.getAll();
        })
        .then(function(matches) {
            resolve(matches);
        });
    });
}

function getById(id) {
    return new Promise(function(resolve, reject) {
      dbPromised
        .then(function(db) {
          var tx = db.transaction("matches", "readonly");
          var store = tx.objectStore("matches");
          return store.get(id);
        })
        .then(function(match) {
          resolve(match);
        });
    });
}