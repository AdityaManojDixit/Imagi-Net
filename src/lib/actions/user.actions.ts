"use server";

import { revalidatePath } from "next/cache";
import User from "../db/models/user.model";
import { connectToDatabase } from "../db/mongoose";
import { handleError } from "../utils";

// Create
export async function createUser(user: CreateUserParams) {
    try {
        await connectToDatabase();
        const newUser = await User.create(user);
        return JSON.parse(JSON.stringify(newUser));
    } catch (error) {
        console.error("Error creating user:", error);
        handleError(error);
        throw error; 
    }
}

// Read
export async function getUserById(userId: string) {
    try {
        await connectToDatabase();
        const user = await User.findOne({ clerkId: userId });
        if (!user) throw new Error("User not found");
        return JSON.parse(JSON.stringify(user));
    } catch (error) {
        handleError(error);
        throw error; // Add this line to re-throw the error after handling
    }
}

// Update
export async function updateUser(clerkId: string, user: UpdateUserParams) {
    try {
        await connectToDatabase();
        const updatedUser = await User.findOneAndUpdate(
            { clerkId },
            user,
            { new: true } // This option ensures the updated document is returned
        );
        if (!updatedUser) { // Fixed: should check 'updatedUser' instead of 'updateUser'
            throw new Error("User update failed");
        }
        return JSON.parse(JSON.stringify(updatedUser));
    } catch (error) {
        handleError(error);
        throw error; // Add this line to re-throw the error after handling
    }
}

// Delete
export async function deleteUser(clerkId: string) {
    try {
        await connectToDatabase();
        // Find user
        const userToDelete = await User.findOne({ clerkId }); // Fixed: Pass clerkId as an object
        if (!userToDelete) {
            throw new Error("User not found");
        }
        // Delete user
        const deletedUser = await User.findByIdAndDelete(userToDelete._id); // Fixed: Await the delete operation
        revalidatePath("/");

        return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
    } catch (error) {
        handleError(error);
        throw error; // Add this line to re-throw the error after handling
    }
}
