
function showForm(formType) {
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('signupForm').classList.remove('active');
    document.getElementById('loginTab').classList.remove('active');
    document.getElementById('signupTab').classList.remove('active');
    
    document.getElementById(formType + 'Form').classList.add('active');
    document.getElementById(formType + 'Tab').classList.add('active');
  }
  
  function goHome() {
    window.location.href = "../html/LandinPage.html";
  }
  
  
  document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = this.querySelector('input[type="text"]').value;
    const password = this.querySelector('input[type="password"]').value;
    
    
    db.collection('users').where('username', '==', username).get()
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          throw new Error('Username not found');
        }
        
        
        const userDoc = querySnapshot.docs[0];
        const userEmail = userDoc.data().email;
        
       
        return auth.signInWithEmailAndPassword(userEmail, password);
      })
      .then((userCredential) => {
       
        const user = userCredential.user;
        console.log("User logged in:", user);
        window.location.href = "../html/GamePage.html"; 
      })
      .catch((error) => {
        
        if (error.message === 'Username not found') {
          alert("Login error: Username not found");
        } else {
          alert("Login error: " + error.message);
        }
        console.error("Login error:", error);
      });
  });
  
  
  document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const password = this.querySelector('input[type="password"]').value;
    
    
    db.collection('users').where('username', '==', username).get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          throw new Error('Username already exists');
        }
        
       
        return auth.createUserWithEmailAndPassword(email, password);
      })
      .then((userCredential) => {
        
        const user = userCredential.user;
        
        
        return db.collection('users').doc(user.uid).set({
          username: username,
          email: email,
          createdAt: new Date()
        });
      })
      .then(() => {
        alert("Account created successfully!");
        
        
        document.getElementById('signupForm').reset();
        
        
        showForm('login');
      })
      .catch((error) => {
       
        if (error.message === 'Username already exists') {
          alert("Signup error: Username already exists");
        } else {
          alert("Signup error: " + error.message);
        }
        console.error("Signup error:", error);
      });
  });
  
  
  auth.onAuthStateChanged((user) => {
    if (user) {
      
      console.log("User is signed in:", user);
    } else {
     
      console.log("User is signed out");
    }
  });