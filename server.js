import express from 'express';
import carrito from './carrito.js';
import productos from './productos.js';
import administradorMiddleware from "./administradorMiddleware.js";
import fs from 'fs';

class Funciones {
    getSiguienteId = ( productos ) => {
      let ultimoId = 0
      productos.forEach(producto => {
        if (producto.id > ultimoId){
          ultimoId = producto.id
        }
      });
      return ++ultimoId
    }
}
const funciones = new Funciones()

const app = express();
const PORT = process.env.PORT || 8080;
const router = express.Router();

const server = app.listen(PORT, ()=>{
  console.log('Servidor HTTP escuchando en el puerto', server.address().port);
});
server.on('error', error=>console.log('Error en servidor', error));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/', router);

app.use(express.static('public'));

//PRODUCTOS
router.get("/productos/listar", (req, res) => {
    if (productos.length == 0) {
        return res.status(404).json({ error: "No hay productos cargados" });
      }
    res.json(productos);
  });
  
router.get("/productos/listar/:id", (req, res) => {
    const { id } = req.params;
    const producto = productos.find((producto) => producto.id == id);
    if (!producto) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
    res.json(producto);
});
  
router.post("/productos/agregar", administradorMiddleware, (req, res) => {
    const newUser = {
    id: funciones.getSiguienteId(productos),
    ...req.body,
    };
    productos.push(newUser);
    res.status(201).json(newUser);
    fs.writeFileSync('./productos.txt', JSON.stringify(productos));
});

router.put("/productos/actualizar/:id", administradorMiddleware, (req, res) => {
  const { id } = req.params;
  let { name,
    description,
    code,
    image,
    price,
    stock } = req.body;
  let producto = productos.find((producto) => producto.id == id);
  if (!producto) {
    return res.status(404).json({ msg: "Producto no encontrado" });
  }
  (producto.name = name),
  (producto.description = description),
  (producto.code = code),
  (producto.image = image),
  (producto.price = price),
  (producto.stock = stock);

  res.status(200).json(producto);
  fs.writeFileSync('./productos.txt', JSON.stringify(productos));
});

router.delete("/productos/borrar/:id", administradorMiddleware, (req, res) => {
  const { id } = req.params;
  const producto = productos.find((producto) => producto.id == id);

  if (!producto) {
    return res.status(404).json({ msg: "Producto no encontrado" });
  }

  const index = productos.findIndex((producto) => producto.id == id);
  productos.splice(index, 1);

  res.status(200).end();
  fs.writeFileSync('./productos.txt', JSON.stringify(productos));
});

//CARRITO//
router.get("/carrito/listar", (req, res) => {
  res.json(carrito.productos);
});

router.get("/carrito/listar/:id_producto", (req, res) => {
  const { id_producto } = req.params;
  const producto = carrito.productos.find((producto) => producto.id == id_producto);
  res.json(producto);
});
                  
router.post("/carrito/agregar/:id_producto", (req, res) => {
  const { id_producto } = req.params;
 
  const producto = productos.find((producto) => producto.id == id_producto);

  carrito.productos.push( producto ); 
  res.json(carrito);
  fs.writeFileSync('./carrito.txt', JSON.stringify(carrito));
});
                  
router.delete("/carrito/borrar/:id_producto", (req, res) => {
  const { id_producto } = req.params;
  const producto = carrito.productos.find((producto) => producto.id == id_producto);
  console.log(carrito)
  if (!producto) {
    return res.status(404).json({ msg: "Carrito no encontrado" });
  }

  const index = carrito.productos.findIndex((producto) => productos.id == id_producto);
  carrito.productos.splice(index, 1);

  res.status(200).end();            
  fs.writeFileSync('./carrito.txt', JSON.stringify(carrito));
});
