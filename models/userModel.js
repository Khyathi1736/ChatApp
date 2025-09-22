import pool from "../config/db.js";
import bcrypt from "bcrypt";
const saltRounds = 10;


// to insert new user to database
export async function createUser(userName, password) {
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const query = `
           INSERT INTO users (user_name, password)
           VALUES ($1, $2)
           Returning id,user_name,created_at`;
        const values=[userName,hashedPassword];
        const res=await pool.query(query,values);
        return res.rows[0];
    } catch (err) {
        throw err;
    }
}


// find user by username
export async function getUserbyUsername(userName){
    try{
        const query='select * from users where user_name=$1';
        const values=[userName];
        const res=await pool.query(query,values);
        return res.rows[0];
    }catch(err){
        throw err;
    }
}


// find user by id
export async function getUserbyId(id){
    try{
        const query='select * from users where user_id=$1';
        const values=[id];
        const res=await pool.query(query,values);
        return res.rows[0];
    }catch(err){
        throw err;
    }
}




