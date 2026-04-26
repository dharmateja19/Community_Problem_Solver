import Problem from "../models/Problem.js"
import Tracking from "../models/Tracking.js"
import { createNotification } from "../utils/notifications.js"

export const createProblem = async (req, res) => {
    try {
        const {title, description, image, location} = req.body;
        if(!title || !description || !location) {
            return res.status(400).json({message : "Title, Description and location are mandatory"})
        }
        const problem = new Problem({title, description, user : req.user.id, image, location})
        await problem.save()
        await Tracking.create({
            problemId: problem._id,
            status: problem.status,
            note: "Problem created",
            updatedBy: req.user.id
        })

        await createNotification({
            userId: req.user.id,
            title: "Problem posted successfully",
            message: `Your problem ${title} has been posted successfully.`,
            type: "problem",
            link: `/problems/${problem._id}`
        })

        res.status(201).json({message : "Problem Added Successfully", problem})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : "Internal server Error"})
    }
}

export const getAllProblems = async (req, res) => {
    try {
        const problems = await Problem.find().populate("user", "name email").sort({ createdAt: -1 });
        res.status(200).json({message : "Problems found successfully", problems})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : "Internal server Error"})
    }
}

export const getProblemById = async (req, res) => {
    try {
        const id = req.params.id
        const problem = await Problem.findById(id)
        if(!problem) {
            return res.status(404).json({message : "Problem Not Found"})
        }
        await problem.populate("user", "name email")
        res.status(200).json({message : "Problem Found", problem})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : "Internal server Error"})
    }
}

export const updateProblemStatus = async (req, res) => {
    try {
        const id = req.params.id
        const problem = await Problem.findById(id)
        if(!problem) {
            return res.status(404).json({message : "Problem Not Found"})
        }
        if(problem.user.toString() !== req.user.id.toString()) {
            return res.status(403).json({message : "Unauthorized"})
        }
        const {status} = req.body;
        if(!status) {
            return res.status(400).json({message : "Status is required"})
        }
        if(!["open", "in-progress", "completed"].includes(status)) {
            return res.status(400).json({message : "Invalid status"})
        }
        const currStatus = problem.status;
        const validUpdates = {
            "open" : ["in-progress"],
            "in-progress" : ["completed"],
            "completed" : []
        }
        if (problem.status === status) {
            return res.status(400).json({message: "Problem is already in this status"});
        }
        if(!validUpdates[currStatus].includes(status)) {
            return res.status(400).json({message : "Invalid status update"})
        }
        problem.status = status;
        await problem.save()
        await Tracking.create({
            problemId: problem._id,
            status,
            note: `Status updated to ${status}`,
            updatedBy: req.user.id
        })

        await createNotification({
            userId: problem.user,
            title: "Problem status updated",
            message: `Your problem ${problem.title} status changed to ${status}.`,
            type: "status",
            link: `/problems/${problem._id}`,
            emailSubject: "Problem status updated",
            emailText: `The status of your problem titled ${problem.title} changed to ${status}.`
        })

        res.status(200).json({message : "Problem status updated successfully", problem})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : "Internal server Error"})
    }
}

export const deleteProblem = async (req, res) => {
    try {
        const id = req.params.id
        const problem = await Problem.findById(id)
        if(!problem) {
            return res.status(404).json({message : "Problem Not Found"})
        }
        if(problem.user.toString() !== req.user.id.toString()){
            return res.status(403).json({message : "Unauthorized"})
        }
        await problem.deleteOne()
        res.status(200).json({message : "Problem deleted successfully", problem})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : "Internal server Error"})
    }
}