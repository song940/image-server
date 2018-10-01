const gm = require('gm');
const qr = require('qr-image');

const http = require('http');
const kelp = require('kelp');
const send = require('kelp-send');
const body = require('kelp-body');

const app = kelp();

app.use(send);
app.use(body);

app.use((req, res) => {
  const { path, query } = req;
  const img = gm(path === '/qr' ?
    qr.image(query.text) : path);
  // resize
  let { width, height } = query;
  if(width){
    img.resize(width, height);
  }
  // crop
  const { crop } = query;
  if(crop){
    const [ w, h, x, y ] = crop.split(',');
    img.crop(w, h, x, y);
  }
  // rotate
  const { rotate } = query;
  if(rotate){
    const [ color, degrees ] = rotate.split(',');
    img.rotate(color, degrees);
  }
  // scale
  const { scale } = query;
  if(scale){
    const [ w, h ] = scale.split(',');
    img.scale(w, h);
  }
  // quality
  const { quality, q } = query;
  if(quality || q){
    img.quality(quality || q);
  }
  // format
  const { format } = query;
  if(format){
    img.setFormat(format);
  }
  const { interlace } = query;
  if(interlace){
    img.interlace(interlace);
  }
  img.stream().pipe(res);
});

app.use((_, res) => res.send(404));

http.createServer(app).listen(3000);