const express = require('express');
const path = require('path');   // path module is used to work with file and directory paths
const ejs = require('ejs');  // ejs module is used to render the html file
const fs = require('fs');  // fs module is used to read and write files 

const app = express();
app.use(express.json()); // for parsing application/json    
app.use(express.urlencoded({ extended: true }));  // for parsing application/x-www-form-urlencoded  
app.use(express.static(path.join(__dirname, 'public'))); // to serve static files   

app.set('view engine', 'ejs'); //   set the view engine to ejs  

app.get('/', (req, res) => {
    fs.readdir('./files', (err, files) => {
        if (err) {
            console.log(err);
        } else {
            res.render("index", { files: files });
        }
    });
});

app.get('/files/:filename', (req, res) => {
    fs.readFile(`./files/${req.params.filename}`, 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            res.send('Error reading file');
        } else {
            res.render('show' , {filename: req.params.filename, filedetails: data});
        }
    });
});

app.get('/edit/:filename', (req, res) => {
    res.render('edit', {filename: req.params.filename});
});
app.post('/edit', (req, res) => {
    fs.rename(`./files/${req.body.oldfilename}`, `./files/${req.body.newfilename}`, (err) => {
        if (err) {
            console.log(err);
            res.send('Error renaming file');
        } else {
            res.redirect('/');
            console.log('File renamed successfully');
        }
    });
});

app.post('/create', (req, res) => {
    console.log(req.body);
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.details, (err) => {
        if (err) {
            console.log(err);
            res.send('Error writing file');
        } else {
            res.redirect('/');
            console.log('File created successfully');
        }
    });
})



app.listen(3000, () => {
    console.log('Server is running on port 3000');
});