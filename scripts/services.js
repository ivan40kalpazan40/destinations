function loadPartials(context){

    const user = getUser();
    context.isLogged = Boolean(user);
    context.email = user? user.email:'Guest';
    
    
    return context.loadPartials({
        'header': '../views/header.hbs',
        'footer': '../views/footer.hbs'
    });
}


function createUserData(data){
    const { email, uid } = data.user;
    localStorage.setItem('user', JSON.stringify({email, uid}));
}

function getUser(){
    const user = localStorage.getItem('user');
    return user? JSON.parse(user):null;
}

function clearUser(){
    this.localStorage.removeItem('user');
}


// error handler
function errorHandler(err){
    let errorCode = err.code;
    let errorMessage = err.message;
    console.log(`${errorCode}: ${errorMessage}`);
}