import express from 'express';
import multer from 'multer'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import { __dirname } from './path.js'
import path from 'path'
import routerProd from './routes/products.routes.js';
import routerCart from './routes/cart.routes.js';
import { ProductManager } from './controllers/productManager.js';

const PORT = 8080;
const app = express();

//Server
const server = app.listen(PORT,()=>{
    console.log(`Server on port: ${PORT}`);
})

const io = new Server(server)

//Config Multer

const storage = multer.diskStorage({
    destination: (req, file, cb) => { //cb => callback
        cb(null, 'src/public/img') //el null hace referencia a que no envie errores
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${file.originalname}`) //concateno la fecha actual en ms con el nombre del archivo
        //1232312414heladera-samsung-sv
    }
})

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //URL extensas
const upload = multer({ storage: storage })

//Handlebars
app.engine('handlebars', engine()) //Defino que voy a trabajar con Handlebars
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, './views'))

const mensajes = []

//Conexion de Socket.io
io.on('connection', socket => {
	console.log('Conexión con Socket.io');

    const productManager = new ProductManager('./src/models/products.json'); 

	socket.on('load', async () => {
		const products = await productManager.getProducts();
		socket.emit('products', products);
	});

	socket.on('newProduct', async product => {
		await productManager.addProduct(product);
		const products = await productManager.getProducts();
		socket.emit('products', products);
	});

	socket.on('mensaje', info => {
        console.log(info)
        mensajes.push(info)
        io.emit('mensajes', mensajes)
    })
});


//Routes
app.use('/static', express.static(path.join(__dirname, '/public')))

app.get('/static', (req, res) => {
	res.render('index', {
		rutaCSS: 'index',
		rutaJS: 'index',
	});
});

app.get('/static/realtimeproducts', (req, res) => {
	res.render('realTimeProducts', {
		rutaCSS: 'realTimeProducts',
		rutaJS: 'realTimeProducts',
	});
});

app.get('/static/chat', (req, res) => {
	res.render('chat', {
		rutaCSS: 'chat',
		rutaJS: 'chat',
	});
});

app.use('/api/products', routerProd);
app.use('/api/carts', routerCart);

//Multer
app.post('/upload', upload.single('product'), (req, res) => {
    console.log(req.file)
    console.log(req.body)
    res.status(200).send("Imagen cargada")
})


/*import express from 'express'
import userRouter from './routes/user.routes.js'
import mongoose from 'mongoose'

const app = express()
const PORT = 4000

mongoose.connect('mongodb+srv://mmoraalvz2:mma$223$@cluster0.a8nxh9t.mongodb.net/?retryWrites=true&w=majority')
    .then(() => console.log("DB conectada"))
    .catch((error) => console.log("Error en conexion a MongoDB Atlas: ", error))

app.use(express.json())

app.use('/api/users', userRouter)

app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})*/