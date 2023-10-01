const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const readline = require('readline');
const SongListModule = require('./songListModule');

const CSV_FILE_PATH = 'songs.csv';

let songListModule;

if (isMainThread) {
  console.log('Hilo principal iniciado.');

  songListModule = new SongListModule(CSV_FILE_PATH);

  const statusWorker = new Worker(__filename, {
    workerData: { task: 'status' }
  });

  statusWorker.on('message', (message) => {
    console.log('Estado de la lista y las dos últimas canciones:');
    console.log(message);
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('¿Quieres agregar una canción? (Sí/No): ', (answer) => {
    if (answer.toLowerCase() === 'si' || answer.toLowerCase() === 'sí') {
      rl.question('Título de la canción: ', (title) => {
        rl.question('Intérprete: ', (interpreter) => {
          rl.question('Álbum: ', (album) => {
            rl.question('Nombre del usuario que la agregó: ', (userAdded) => {
              rl.question('Duración: ', (duration) => {
                const songToAdd = {
                  Title: title,
                  Interpreter: interpreter,
                  Album: album,
                  UserAdded: userAdded,
                  Duration: duration
                };

                const songAdded = songListModule.addSong(songToAdd);

                if (songAdded) {
                  console.log('Canción agregada exitosamente.');
                } else {
                  console.log('La canción ya existe en la lista.');
                }

                rl.close();
              });
            });
          });
        });
      });
    } else {
      rl.close();
    }
  });
} else {
  console.log('Hilo secundario para mostrar estado iniciado.');

  const statusInfo = {
    songList: songListModule?.songList || 'N/A',
    lastTwoSongs: songListModule?.getLastTwoSongs() || 'Empty list'
  };

  parentPort.postMessage(statusInfo);
}
