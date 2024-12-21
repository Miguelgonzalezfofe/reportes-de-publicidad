// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js'
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js"
import { doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js"
import { showMessage } from "./showMessage.js";
import closeModal from "./closeModal.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAefggokHT9iciw4h87CFYc64rQCF3KdGw",
    authDomain: "web-mileidiz.firebaseapp.com",
    projectId: "web-mileidiz",
    storageBucket: "web-mileidiz.firebasestorage.app",
    messagingSenderId: "5001942114",
    appId: "1:5001942114:web:3253e8aac209e68667ed3b"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
const db = getFirestore(app)
const loggedOutLinks = document.querySelectorAll('.logged-Out')
const loggedInLinks = document.querySelectorAll('.logged-In')
const nameuser = document.querySelector('#nameUser')

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('User is signed in')
        if (nameuser) {
            nameuser.innerHTML = user.email
        }
        loggedInLinks.forEach(link => link.style.display = 'block')
        loggedOutLinks.forEach(link => link.style.display = 'none')

    } else {
        console.log('User is signed out')
        if (nameuser) {
            nameuser.innerHTML = ''
        }
        loggedInLinks.forEach(link => link.style.display = 'none')
        loggedOutLinks.forEach(link => link.style.display = 'block')
    }
})
/* Registro de usuarios */
const signUpForm = document.querySelector('#registerForm')
const btnRegister = document.querySelector('#btnRegister')
if (signUpForm && btnRegister) {
    btnRegister.addEventListener('click', async (e) => {
        e.preventDefault()
        const name = signUpForm['nameRegister'].value
        const email = signUpForm['emailRegister'].value
        const password = signUpForm['passwordRegister'].value

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            await createUser(email, { name })
            await createData(email, { dato: [] })
            showMessage("Usuario registrado", "success")
            closeModal('registerModal')
            setTimeout(() => {
                window.location.href = "./ingreso.html"
            }, 2500)


        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                showMessage("Correo en uso", "error")

            }
            else if (error.code === "auth/invalid-email") {
                showMessage("correo invalido", "error")
            }
            else if (error.code === "auth/weak-password") {
                showMessage("contraseña debil", "error")
            } else if (error.code) {
                showMessage("algo salio mal", "error")
            }
            else {
                console.log(error.code, error.message)
            }
        }

    })
}

/* Inicio de sesion */
const loginForm = document.querySelector('#loginForm')
const btnLogin = document.querySelector('#btnIngreso')
if (loginForm && btnLogin) {
    btnLogin.addEventListener('click', async (e) => {
        e.preventDefault()
        const email = loginForm['emailLogin'].value
        const password = loginForm['passwordLogin'].value

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            showMessage("Usuario logueado", "success")
            console.log(userCredential.user)
            setTimeout(() => {
                window.location.href = "./ingreso.html"
            }, 2500)
        } catch (error) {
            if (error.code === "auth/invalid-credential") {
                showMessage("Error", "error")
            }
            else if (error.code === "auth/wrong-password") {
                showMessage("contraseña invalida", "error")
            }
            else if (error.code === "auth/user-not-found") {
                showMessage("usuario no encontrado", "error")
            }
            else {
                showMessage("Tenemos un error", "error")
            }
            console.log(error.code)
        }
    })
}


/* cerrar sesion */
const btnLogout = document.querySelector('#CerrarSesion')
if (btnLogout) {
    btnLogout.addEventListener('click', async (e) => {
        await signOut(auth)
        showMessage("Sesion cerrada", "success")
        setTimeout(() => {
            window.location.href = "../index.html"
        }, 1500)
    })

}

export const createUser = async (email, data) => setDoc(doc(db, "users", email), data)
export const getUser = async (email) => getDoc(doc(db, "users", email))
export const createData = async (email, data) => setDoc(doc(db, `users/${email}/BaseDatos`, "Datos"), data)
export const getData = async (email) => getDoc(doc(db, `users/${email}/BaseDatos`, "Datos"))
export const upDateData = async (email, data) => updateDoc(doc(db, `users/${email}/BaseDatos`, "Datos"), data)


