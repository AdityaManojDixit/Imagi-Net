"use server"

import { revalidatePath } from "next/cache";
import User from "../db/models/user.model"
import { connectToDatabase } from "../db/mongoose"
import { handleError } from "../utils"

//Create
export async function createUser(user : CreateUserParams){
    try{
        await connectToDatabase();
        const newUser = await User.create(user);
        return JSON.parse(JSON.stringify(newUser));

    }catch(error){
        handleError(error);
    }
}
//Read
export async function getUserById(userId: string){
    try{
        await connectToDatabase();
        const user = await User.findOne({clerkId : userId});
        if(!user) throw new Error("User not found");
        return JSON.parse(JSON.stringify(user));

    }catch(error){
        handleError(error);
    }
}

//Update
export async function updateUser(clerkId: string, user : UpdateUserParams){
    try{
        await connectToDatabase();
        const updatedUser = await User.findByIdAndUpdate(
            {clerkId},
            user,
            {new:true}
        );
        if(!updateUser){
            throw new Error("User update failed");
        }
        return JSON.parse(JSON.stringify(updatedUser));
       
    }catch(error){
        handleError(error);
    }
}

//Delete
export async function deleteUser(clerkId : String){
    try{
        await connectToDatabase();
        //find user
        const userToDelete = await User.findOne(clerkId);
        if(!userToDelete){
            throw new Error("User not found");
        }
        //delete user
        const deletedUser = User.findByIdAndDelete(userToDelete._id)
        revalidatePath("/")

        return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;

    }catch(error){
        handleError(error);
    }
}