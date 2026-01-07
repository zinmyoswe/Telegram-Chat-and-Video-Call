import { v } from "convex/values";
import { mutation, query } from "./_generated/server";


//Get user by Clerk userId
export const getUserByClerkId = query({
    args: { userId: v.string() },
    handler: async (ctx, { userId }) => {
        if (!userId) {
            return null;
        }

        return await ctx.db
        .query("users")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .first();
    },
});

//Create or update user (sync from Clerk)
export const upsertUser = mutation({
    args: {
        userId: v.string(),
        name: v.string(),
        email: v.string(),
        imageUrl: v.string(),
    },
    handler: async (ctx, { userId, name, email, imageUrl }) => {
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .first();

        if (existingUser) {
            // Update existing user
            await ctx.db.patch(existingUser._id, {
                name,
                imageUrl,
            });
            return existingUser._id;
        } 

        return await ctx.db
            .insert("users", {
                userId,
                name,
                email,
                imageUrl,
            });
    },
});

// Search users by name or email
export const searchUsers = query({
    args: { searchTerm: v.string() },
    handler: async (ctx, { searchTerm }) => {
        if (!searchTerm.trim()) {
            return [];
        }

        const normalizedTerm = searchTerm.toLowerCase.trim();

        //GET all users and filter them by name or email containing the search term
        const allUsers = await ctx.db.query("users").collect();

        return allUsers
            .filter((user) =>
                user.name.toLowerCase().includes(normalizedTerm) ||
                user.email.toLowerCase().includes(normalizedTerm)
            )
            .slice(0, 20); // Limit to 10 results
    },
}); 