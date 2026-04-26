import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

import User from "../models/User.js";
import Problem from "../models/Problem.js";
import Solution from "../models/Solution.js";
import Vote from "../models/Vote.js";
import Discussion from "../models/Discussion.js";
import Tracking from "../models/Tracking.js";
import Notification from "../models/Notification.js";

dotenv.config();

const primaryEmail = "suman.tati2005@gmail.com";

const run = async () => {
    await mongoose.connect(process.env.MONGODB_URL);

    const hashedDefaultPassword = await bcrypt.hash("123456", 10);

    let primaryUser = await User.findOne({ email: primaryEmail });
    if (!primaryUser) {
        primaryUser = await User.create({
            name: "Suman Tati",
            email: primaryEmail,
            password: hashedDefaultPassword
        });
    } else {
        primaryUser.password = hashedDefaultPassword;
        await primaryUser.save();
    }

    let helperUser = await User.findOne({ email: "charan.mock@cps.local" });
    if (!helperUser) {
        helperUser = await User.create({
            name: "Charan Mock",
            email: "charan.mock@cps.local",
            password: hashedDefaultPassword
        });
    } else {
        helperUser.password = hashedDefaultPassword;
        await helperUser.save();
    }

    const existing = await Problem.find({ user: primaryUser._id }).limit(1);
    if (existing.length === 0) {
        const problems = await Problem.insertMany([
            {
                title: "Streetlight Not Working Near Main Road",
                description: "The streetlight near the bus stop on Main Road has not been working for over a week. Area is dark at night and unsafe.",
                user: primaryUser._id,
                location: "Main Road Bus Stop",
                status: "open"
            },
            {
                title: "Garbage Overflow in Community Park",
                description: "Dustbins are overflowing in Greenview Park and waste is spreading around. Needs urgent cleanup and more bins.",
                user: primaryUser._id,
                location: "Greenview Community Park",
                status: "in-progress"
            },
            {
                title: "Potholes on School Route",
                description: "Multiple potholes are causing traffic and risk for school children on Lakeview School Route.",
                user: primaryUser._id,
                location: "Lakeview School Route",
                status: "completed"
            }
        ]);

        const [p1, p2, p3] = problems;

        const solutions = await Solution.insertMany([
            {
                problemId: p1._id,
                user: helperUser._id,
                description: "Raise a municipality maintenance ticket and attach two night-time photos for quick action.",
                votes: 2
            },
            {
                problemId: p2._id,
                user: helperUser._id,
                description: "Place temporary waste collection point and schedule daily pickup for one week.",
                votes: 3
            },
            {
                problemId: p3._id,
                user: helperUser._id,
                description: "Mark potholes with paint and prioritize patchwork before monsoon.",
                votes: 5
            }
        ]);

        await Vote.create({ userId: primaryUser._id, solutionId: solutions[0]._id });

        await Discussion.insertMany([
            {
                problemId: p1._id,
                user: primaryUser._id,
                message: "I have uploaded latest photos for better visibility."
            },
            {
                problemId: p2._id,
                user: helperUser._id,
                message: "Local volunteers are ready to support temporary cleanup."
            }
        ]);

        await Tracking.insertMany([
            { problemId: p1._id, status: "open", note: "Reported by resident", updatedBy: primaryUser._id },
            { problemId: p2._id, status: "in-progress", note: "Assigned to sanitation team", updatedBy: helperUser._id },
            { problemId: p3._id, status: "completed", note: "Repair work finished", updatedBy: helperUser._id }
        ]);

        await Notification.insertMany([
            {
                user: primaryUser._id,
                title: "Welcome to Community Problem Solver",
                message: "Your account is ready and mock data has been added for testing.",
                type: "system",
                link: "/dashboard"
            },
            {
                user: primaryUser._id,
                title: "Solution Received",
                message: "A community member suggested a solution to your reported issue.",
                type: "solution",
                link: `/problems/${p1._id}`
            }
        ]);
    }

    const summary = {
        seededFor: primaryEmail,
        primaryUserId: String(primaryUser._id),
        problemsByPrimaryUser: await Problem.countDocuments({ user: primaryUser._id }),
        helperUserSolutions: await Solution.countDocuments({ user: helperUser._id }),
        totalDiscussions: await Discussion.countDocuments(),
        loginPasswordForSeededUsers: "123456"
    };

    console.log(JSON.stringify(summary, null, 2));
    await mongoose.disconnect();
};

run().catch(async (error) => {
    console.error("Seed failed:", error);
    try {
        await mongoose.disconnect();
    } catch {}
    process.exit(1);
});
