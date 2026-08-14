import express from 'express';
import { engine } from 'express-handlebars';


// Create an instance of the Express application
const app = express();

// Set up Handlebars as the view engine
app.engine('hbs', engine({
    extname: 'hbs',
}));
app.set('view engine', 'hbs');
app.set('views', 'src/views');


// Setup static files
app.use(express.static('src/public'));

// Add cors middleware
app.use(cors());




app.get('/', (req, res) => {
  res.send('Hello, World!');
});






const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}...`);
});


