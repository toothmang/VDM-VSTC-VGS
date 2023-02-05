import express from 'express'
import http  from'http';
import cors from 'cors';
import crypto  from 'crypto'
import geckos from '@geckos.io/server';
import gamestate from './common/gamestate.mjs';
const app = express();
const server = http.createServer(app);
app.use(express.json({ limit: '50mb' }));
app.use(cors());
const port = 4121

const playerRouter = express.Router();

var gameserver = {
  players: {},
  connections: {},
  gamestate: new gamestate(),

  respond_with_data: function(res, myData) {
    res.send({data: myData});
  },
  
  respond_with_error: function(res, errorMsg) {
    res.send({error: errorMsg});
  },

  /*
  hash_user: function(socket) {
    let userData = socket.request.headers['user-agent'] + socket.request.connection.remoteAddress;
    return crypto.createHash('md5').update(userData).digest('hex')
  },
  */

  makeplayer: function(channel, data) {
    let playerID = channel.id;
    this.connections[playerID] = channel;
    console.log("Adding player " + playerID);
    let nowish = new Date();
    this.players[playerID] = {
      id: playerID,
      created: nowish,
      pos: [0.0, -100.0, 0.0]
    };
  },

  dropplayer: function(channel, data) {
    let playerID = channel.id;
    delete this.connections[playerID];
    delete this.players[playerID];
    console.log(`Disconnecting player ${playerID}`);
  },
  
  setplayer: function (channel, data) {
    let playerID = channel.id;
    let player = this.players[playerID];
    player.pos = data.pos;
    player.color = data.color;

    channel.broadcast.emit('setplayer', player);
    
    if ('lagmebro' in data && data.lagmebro) {
      channel.emit('lagmebro', true);
    }
    
    //console.log(`setting position to ${data.x}, ${data.y} for player ${channel.id}`);
  },
  
  getplayers: function (channel, data) {
    let results = [];
  
    for(let p in this.players) {
      results.push(this.players[p]);
    }

    channel.emit('getplayers', results);
    //this.respond_with_data(res, results);
  },

  fire: function (channel, data) {
    /*
    let results = [];
  
    for(let p in this.players) {
      results.push(this.players[p]);
    }
    */

    channel.broadcast.emit('fire', data);

    /*
    for (let channelID in this.connections) {
        if (channelID != channel.id) {
            //console.log(`Sending ${channel.id}'s bullet over to ${channelID}`);
            this.connections[channelID].emit('fire', data);
        }
    }
    */

    //this.respond_with_data(res, results);
  },

  kill: function(channel, data) {
    this.gamestate.kill();
    console.log("Badjo killed - remaining: " + this.gamestate.getBaddiesRemaining());
    channel.broadcast.emit('kill', data);

    if (this.gamestate.isClear()) {
      this.gamestate.nextLevel();
      channel.room.emit('nextLevel', this.gamestate);
    }
    else {
      channel.room.emit('gamestate', this.gamestate);
    }
  }
};

//var players = {};

function hash_user(req) {
  let userData = req.get('User-Agent') + req.headers['x-forwarded-for'];
  return crypto.createHash('md5').update(userData).digest('hex')
  //return md5($_SERVER['REMOTE_ADDR'] . $_SERVER['HTTP_USER_AGENT']);
}


playerRouter.post('/', (req, res) => {

  //console.log(req.body);
  if ("getplayers" in req.body) {
    gameserver.getplayers(req, res);
  }
  else {
    let sb = JSON.stringify(req.body);
    res.send({error: `invalid request: ${sb}`});
  }
})

var env = process.env.NODE_ENV || 'development';

var geckosConfig = {
  portRange: {
    min: 5555,
    max: 5565
  }
};

if (env == "production") {
  geckosConfig.cors = {
    origin: "https://2ths1m.com",
    allowAuthorization: true
  };
}

const gio = geckos(geckosConfig);

gio.addServer(server);
gio.onConnection (channel => {
  console.log("Channel established: " + channel.id);

  channel.on('chat message', function(data) {
    console.log(JSON.stringify(data));
  });

  channel.on('makeplayer', function(data) {
    gameserver.makeplayer(channel, data);
    console.log(JSON.stringify(data));
  });

  channel.onDisconnect(function(data) {
    gameserver.dropplayer(channel, data);
  });

  channel.on('dropplayer', function(data) {
    gameserver.dropplayer(channel, data);
  });

  channel.on('setplayer', function(data) {
    gameserver.setplayer(channel, data);
  });

  channel.on('getplayers', function(data) {
    //console.log("getting players");
    //channel.emit("getplayers", [{id: 1}]);
    gameserver.getplayers(channel, data);
  })

  channel.on('fire', function(data) {
    //console.log('FIRE! ' + JSON.stringify(data));
    gameserver.fire(channel, data);
  })

  channel.on('kill', function(data) {
    gameserver.kill(channel, data);
  })

  channel.on('nextLevel', function(data) {
    channel.emit('nextLevel', gameserver.gamestate);
  })
});

//app.use('/gametest-server', playerRouter);
//app.use('/gametest-server', peerServer);

server.listen(port, () => {
  console.log(`GGJ23 server is listening on port ${port}.`);
});

//const peer = new Peer();

//console.log("Peer client id is " + peer.id);

