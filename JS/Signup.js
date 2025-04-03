//Get idea to Signup and Login Form in HTML with Firebase:https://youtu.be/WM178YopjfI?si=ETdOqk7hxNIzXD79
//Firebase Web Login and Signup Using JavaScript:https://youtu.be/flsPuZp6aTE?si=RhzEODB57fhSDcYW
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
  
  function isStrongPassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/;
    return passwordRegex.test(password);
   }
  
   document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const loginBtn = this.querySelector('button[type="submit"]');
    const username = this.querySelector('input[type="text"]').value;
    const password = this.querySelector('input[type="password"]').value;
  
    loginBtn.textContent = "Loading...";
    loginBtn.disabled = true;
    
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
        window.location.href = "../html/LandingPage.html"; 
      })
      .catch((error) => {
        alert(error.message === 'Username not found' ? "Login error: Username not found" : "Login error: " + error.message);
        console.error("Login error:", error);
    })
    .finally(() => {
        loginBtn.textContent = "Login";
        loginBtn.disabled = false;
    });
});
   
document.getElementById('signupForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const signupBtn = this.querySelector('button[type="submit"]');
  const username = this.querySelector('input[type="text"]').value;
  const email = this.querySelector('input[type="email"]').value;
  const password = this.querySelector('input[type="password"]').value;

    if (!isStrongPassword(password)) {
    alert("Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.");
    return;
    }

  signupBtn.textContent = "Creating Account...";
  signupBtn.disabled = true;
    
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
        alert(error.message === 'Username already exists' ? "Signup error: Username already exists" : "Signup error: " + error.message);
        console.error("Signup error:", error);
    })
    .finally(() => {
        signupBtn.textContent = "Sign Up";
        signupBtn.disabled = false;
    });
});

//Google Signin with firebase:https://youtu.be/Uhbn1KmiNbg?si=SCcDR7nfzzbipVuA
const googleSignInBtn = document.getElementById("googleSignInBtn");

googleSignInBtn.addEventListener("click", async () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    try {
        const result = await auth.signInWithPopup(provider);
        const user = result.user;

        if (user) {
            const userRef = db.collection("users").doc(user.uid);
            const doc = await userRef.get();

            if (!doc.exists) {
                await userRef.set({
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    email: user.email,
                    username: user.displayName
                });
            }
            window.location.href = "../html/LandingPage.html";
        }
    } catch (error) {
        console.error("Google Sign-In Error:", error);
    }
});

auth.onAuthStateChanged((user) => {
  console.log(user ? "User is signed in:" : "User is signed out", user);
});