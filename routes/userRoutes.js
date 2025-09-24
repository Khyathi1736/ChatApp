import express from 'express';
import { signUp, signIn, removeUser } from "../controllers/userController.js";

const userRoutes = express.Router();

// signup route 
// Post /users/signup 
// body:{userName,password}

userRoutes.post("/signup", async (req, res) => {
    try {
        const { userName, password } = req.body;
        const result = await signUp(userName, password);
        res.status(201).json(result);
    } catch (err) {
        console.log("Internal error occured while signing up!!");
        res.status(500).json({ success: false, error: err.message });
    }
});


// signin user 
// post users/signin 
// body {userName,password}

userRoutes.post("/signin", async (req, res) => {
    try {
        const { userName, password } = req.body;
        const result = await signIn(userName, password);
        res.status(200).json(result);
    } catch (err) {
        console.log("some intrnal error occured while signing in!!");
        res.status(500).json({ success: false, error: err.message });
    }
});

// soft delete user 
// Delete users/delete-user
// body {userName,password}

userRoutes.delete("/delete-user", async (req, res) => {
    try {
        const { userName, password } = req.body;
        const result = await removeUser(userName, password);
        res.status(200).json(result);
    } catch (err) {
        console.log("some intrnal error occured while deleting user!!");
        res.status(500).json({ success: false, error: err.message });
    }
});

export default userRoutes;
