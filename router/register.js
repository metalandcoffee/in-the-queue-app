    // Register Endpoint.
    // app.get('/register', checkNotAuthenticated, function (req, res) {
    //   res.render('register.ejs');
    // });

    // app.post('/register', async function (req, res) {

    //   // Encrypt password.
    //   const hashedPassword = await bcrypt.hash(req.body.password, 10);

    //   // Add user to database.
    //   usersCollection.insertOne(
    //     {
    //       name: req.body.name,
    //       email: req.body.email,
    //       password: hashedPassword
    //     }
    //   )
    //     .then(result => {
    //       res.redirect('/login');
    //     })
    //     .catch(error => console.error(error));
    // });