const fs = require('fs');

class SongListModule {
  constructor(csvFilePath) {
    this.csvFilePath = csvFilePath;
    this.songList = [];
    this.loadCSV();
  }

  loadCSV() {
    if (fs.existsSync(this.csvFilePath)) {
      const csvContent = fs.readFileSync(this.csvFilePath, { encoding: 'utf8' });
      const rows = csvContent.split('\n');
      const headers = rows[0].split(',');
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i].split(',');
        const song = {};
        for (let j = 0; j < headers.length; j++) {
          song[headers[j]] = row[j];
        }
        this.songList.push(song);
      }
      console.log('CSV file loaded successfully.');
    } else {
      console.log('CSV file not found. Creating a new one.');
    }
  }

  addSong(song) {
    const songExists = this.songList.some(
      (existingSong) =>
        existingSong.Title === song.Title && existingSong.Interpreter === song.Interpreter
    );

    if (!songExists) {
      song.DateAdded = new Date().toLocaleDateString();
      this.songList.push(song);
      this.saveToCSV();
      return true;
    }

    return false;
  }

  getLastTwoSongs() {
    const totalSongs = this.songList.length;
    if (totalSongs >= 2) {
      return this.songList.slice(totalSongs - 2);
    }
    return this.songList;
  }

  generateCSV() {
    const headers = ['Title', 'Interpreter', 'Album', 'DateAdded', 'UserAdded', 'Duration'];
    const csvContent = headers.join(',') + '\n';

    const csvRows = this.songList.map((song) => {
      return headers.map(header => song[header] || '').join(',');
    });

    return csvContent + csvRows.join('\n');
  }

  saveToCSV() {
    const csvContent = this.generateCSV();

    fs.writeFileSync(this.csvFilePath, csvContent, { encoding: 'utf8' });
  }
}

module.exports = SongListModule;
