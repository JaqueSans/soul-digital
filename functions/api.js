const admin = require("firebase-admin");
const express = require("express");
const api = express();
const cors = require("cors");


//middleware -> está entre a requisição
api.use(express.json()); //corpo json é convertido no objeto req.body
//CORS -> CROSS-ORIGIN RESOURCE SHARING
//Maneira do back nao deixar que origens diferentes façam requisição de um recurso
//Maneira de fazer com que um front local/externo consiga acessar os recursos da api
api.use(cors());

const auth = admin.auth();
const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });


const onlySuper = async (req, res, next) => {
    try {
        const userToken = req.headers.authorization.slice(7); //Bearer hi232i2i2i2ojj2
        const decodedToken = await auth.verifyIdToken(userToken);
        const user = await auth.getUser(decodedToken.uid);

        if (user.customClaims["super"]) { //{admin: true, super: false}
            next();
        } else {
            res.status(401).json({ success: false, message: "Usuário não é super administrador" })
        }

    } catch (err) {
        //Cai aqui se o usuário não enviar o token
        res.status(400).json({ success: false, message: "Token Inválido" });
    }
}
// Rotas
/*
{
    "email": "nataliaabreu2000@hotmail.com",
    "password": "123456",
    "displayName": "Natinha"
}'
    
*/

// Rota de adição
api.post("/admin", onlySuper, async (req, res) => {
    try {
        const { email, password, displayName } = req.body;

        if (!email && !password) {
            return res
                .status(400)
                .json({ success: false, message: "Email/senha indefinidos" });
        }

        const user = await auth.createUser({
            email: email,
            password: password,
            displayName: displayName,
        });

        await auth.setCustomUserClaims(user.uid, { admin: true });

        // Espelhamento de informações
        await db
            .collection("admins") // const admins = collection("admins");
            .doc(user.uid) // const adminDoc = doc(this.admins, user.uid);
            .set({ uid: user.uid, email: email, displayName: displayName }); // setDoc(this.admins, {})

        res.status(201).json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
});

// Rota de listagem
api.get("/admin", onlySuper, async (req, res) => {
    const snapshots = await db.collection("admins").get();
    const admins = snapshots.docs.map((doc) => doc.data());
    res.json(admins);
});

//Rota de update
api.put("/admin/:uid", onlySuper, async (req, res) => {
    try {
        const { uid } = req.params;
        const { email, password, displayName } = req.body;

        const user = await auth.updateUser(uid, {
            email: email,
            password: password,
            displayName: displayName,
        });

        await db
            .collection("admins")
            .doc(user.uid)
            .update({ email: user.email, displayName: user.displayName });

        res.json({ success: true }); // por padrão o status é 200
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
});

//Rota de exclusão de usuario
api.delete("/admin/:uid", onlySuper, async (req, res) => {
    try {
        const { uid } = req.params;
        await auth.deleteUser(uid);
        await db.collection("admins").doc(uid).delete();

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
});

module.exports = { api }; // export api;