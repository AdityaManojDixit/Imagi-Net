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
        const existingUser = await User.findOne({ clerkId: user.clerkId });
        if (existingUser) {
            console.log("User already exists:", existingUser);
            return NextResponse.json({ message: "User already exists.", user: existingUser });
        }

        const newUser = await User.create(user); // Fixed: Use the incoming 'user' to create a new user
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

        // Check if the user exists
        if (!user) {
            return NextResponse.json({ message: "User not found." },{ status: 404 });
        }
        // Return the user object if found
        return NextResponse.json(
            JSON.parse(JSON.stringify(user)),
            { status: 200 } // Return a 200 status code for success
        );
    } catch (error) {
        handleError(error); // Handle the error (logging, etc.)
        return NextResponse.json(
            { message: "Error retrieving user.", error},
            { status: 500 } // Return a 500 status code for server error
        );
    }
}

// Update
export async function updateUser(clerkId: string, user: UpdateUserParams) {
    try {
        await connectToDatabase();
        const updatedUser = await User.findOneAndUpdate(
            { clerkId },
            user,
            { new: true } // Ensures the updated document is returned
        );
        if (!updatedUser) {
            return NextResponse.json({ message: "User update failed." });
        }
        return JSON.parse(JSON.stringify(updatedUser));
    } catch (error) {
        handleError(error);
        throw error;
    }
}

// Delete
export async function deleteUser(clerkId: string) {
    try {
        await connectToDatabase();
        // Find user
        const userToDelete = await User.findOne({ clerkId });
        if (!userToDelete) {
            return NextResponse.json({ message: "User not found." });
        }
        // Delete user
        const deletedUser = await User.findByIdAndDelete(userToDelete._id);
        revalidatePath("/");

        return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
    } catch (error) {
        handleError(error);
        throw error;
    }
}

