"use server";

import { revalidatePath } from "next/cache";
import User from "../db/models/user.model";
import { connectToDatabase } from "../db/mongoose";
import { handleError } from "../utils";
import { NextResponse } from "next/server";

// Create
export async function createUser(user: CreateUserParams) {
    try {
        await connectToDatabase();
        //Check exsiting user

        const existingUser = await User.findOne({
            $or: [
                { email : user.email },
                { clerkId: user.clerkId },
                { username : user.username}
            ]
        });
        if (existingUser) {
            throw new Error("User already exists.");
        } 
        
        const newUser = await User.create(user);
        
        //Return newUser
        return JSON.parse(JSON.stringify(newUser));
    } catch (error) {
        console.error("[Error] : user.actions.ts");
        handleError(error);
    }
}

// Read
export async function getUserById(userId: string) {
    try {
        await connectToDatabase();
        const user = await User.findOne({ clerkId: userId });

        // Check if the user exists
        if (!user) {
            throw new Error("User not found");
        }
       
        //Return user
        return JSON.parse(JSON.stringify(user));
    } catch (error) {
        console.error("[Error] : user.actions.ts ");
        handleError(error); 
    }
}

// Update
export async function updateUser(clerkId: string, user: UpdateUserParams) {
    try {
        await connectToDatabase();

        const userToUpdate = await User.findOne({ clerkId });
        if (!userToUpdate) {
            throw new Error("User to update not found.");
        }

        const updatedUser = await User.findOneAndUpdate(
            { clerkId },
            user,
            { new: true } // Ensures the updated document is returned
        );
        if (!updatedUser) {
            throw new Error("User update failed.");
        }

        //Return updated user
        return JSON.parse(JSON.stringify(updatedUser));
    } catch (error) {
        console.error("[Error] : user.actions.ts");
        handleError(error);
    }
}

// Delete
export async function deleteUser(clerkId: string) {
    try {
        await connectToDatabase();
        // Find user
        const userToDelete = await User.findOne({ clerkId });
        if (!userToDelete) {
            throw new Error("User to delete not found");
        }

        // Delete user
        const deletedUser = await User.findByIdAndDelete(userToDelete._id);
        revalidatePath("/");

        //Return deleted user
        return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
    } catch (error) {
        console.error("[Error] : user.actions.ts ");
        handleError(error);
    }
}

// USE CREDITS
export async function updateCredits(userId: string, creditFee: number) {
    try {
      await connectToDatabase();
  
      const updatedUserCredits = await User.findOneAndUpdate(
        { _id: userId },
        { $inc: { creditBalance: creditFee }},
        { new: true }
      )
  
      if(!updatedUserCredits) throw new Error("User credits update failed");
  
      return JSON.parse(JSON.stringify(updatedUserCredits));
    } catch (error) {
      handleError(error);
    }
}
