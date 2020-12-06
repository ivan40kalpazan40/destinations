const app = Sammy('#container', function(){

    // VIEW ENGINE
    this.use('Handlebars', 'hbs');

    // GET HOME
    this.get('#/home', function(context){
        if(Boolean(getUser())){
            db.collection('destinations')
            .get()
            .then(res => {
                context.destinations = [];
                res.forEach(destination =>{
                    const isAuthor = destination.data().author === getUser().email;
                    context.destinations.push({ id:destination.id, ...destination.data(), isAuthor });
                });
                loadPartials(context).then(function(){
                    this.partial('../views/home.hbs');
                });
            }).catch(errorHandler);
        }else{
            loadPartials(context).then(function(){
                this.partial('../views/home.hbs');
            });
        }
        
        
    });

    // GET LOGIN
    this.get('#/login', function(context){
        loadPartials(context).then(function(){
            this.partial('../views/login.hbs');
        });
    });

    // POST LOGIN
    this.post('/login', function(context){
        const { email, password } = context.params;
        auth.signInWithEmailAndPassword(email, password)
        .then(res => {
            createUserData(res);
            this.redirect('#/home');
        })
        .catch(errorHandler);
    });

    // GET REGISTER 
    this.get('#/register', function(context){
        loadPartials(context).then(function(){
            this.partial('../views/register.hbs');
        });
    });

    // POST REGISTER
    this.post('/register', function(context){
        const { email, password, rePassword } = context.params;
        if(password !== rePassword) return;
        auth.createUserWithEmailAndPassword(email, password)
            .then(res => {
                createUserData(res);
                this.redirect('#/home');
            })
            .catch(errorHandler);
    });

    // GET Create destination
    this.get('#/create-destination', function(context){
        loadPartials(context).then(function(){
            this.partial('../views/create.hbs');
        });
    });

    // POST Create destination
    this.post('/create-destination', function(context){
        const { destination, city, duration, departureDate, imgUrl } = context.params;
        db.collection('destinations').add({
            destination,
            city,
            duration,
            departureDate,
            imgUrl,
            author: getUser().email
        }).then(res => {
            context.redirect('#/home');
        }).catch(errorHandler);
    });

    // GET details/:id
    this.get('#/details/:id', function(context){
        const { id } = context.params;
        db.collection('destinations')
            .doc(id)
            .get()
            .then(res => {
                const isAuthor = res.data().author === getUser().email;
                context.destination = { id,...res.data(), isAuthor };
                loadPartials(context).then(function(context){
                    this.partial('../views/details.hbs');
                });
            })
            .catch(errorHandler);
    });

    // GET EDIT destination/:id
    this.get('#/edit/:id', function(context){
        const { id } = context.params;
        db.collection('destinations')
            .doc(id)
            .get()
            .then(res => {
                context.destination = { id, ...res.data() };
                loadPartials(context).then(function(context){
                    this.partial('../views/edit.hbs');
                });
            })
            .catch(errorHandler);
    });

    // POST EDIT destination/:id
    this.post('/edit/:id', function(context){
        const { city, destination, duration, departureDate, imgUrl, id } = context.params;
        db.collection('destinations')
            .doc(id)
            .set({
                city,
                destination,
                duration,
                departureDate,
                imgUrl,
                author: getUser().email
            })
            .then(res => {
                this.redirect(`#/details/${id}`);
            })
            .catch(errorHandler);
    });

    // GET all destinations
    this.get('#/destinations', function(context){

        db.collection('destinations')
            .where('author', '==', getUser().email)
            .get()
            .then(res=> {
                context.myplaces = [];
                res.forEach(destination => {
                    const isAuthor = destination.data().author === getUser().email;
                    context.myplaces.push({ id:destination.id, ...destination.data(), isAuthor });
                });
                loadPartials(context).then(function(context){
                    this.partial('../views/destinations.hbs');
                });
            })
            .catch(errorHandler);
    });

    // DELETE destination/:id
    this.get('#/delete/:id', function(context){
        const { id } = context.params;
        db.collection('destinations')
            .doc(id)
            .delete()
            .then(function(){
                context.redirect('#/destinations');
            })
            .catch(errorHandler);
    });

    // LOGOUT
    this.get('#/logout', function(context){
        auth.signOut().then(function() {
            clearUser();
            context.redirect('#/login');
          }).catch(errorHandler);
    });

});



(()=>{
    app.run('#/home');
})();