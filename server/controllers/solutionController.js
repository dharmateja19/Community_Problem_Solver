import Solution from '../models/Solution.js';
import Problem from '../models/Problem.js'

export const createSolution = async (req, res) => {
    try {
        const problemId = req.params.problemId;
        const problem = await Problem.findById(problemId)
        if(!problem) {
            return res.status(404).json({message : "Problem Not Found"})
        }
        const {description} = req.body;
        if(!description) {
            return res.status(400).json({message : "Solution description is required"})
        }
        const solution = new Solution({problemId, user :  req.user.id, description})
        await solution.save()
        res.status(201).json({message : "Your Solution was Added", solution})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : "Internal server Error"})
    }
}

export const getSolutionsByProblemId = async (req, res) => {
    try {
        const problemId = req.params.problemId;
        const problem = await Problem.find({problemId})
        if(!problem) {
            return res.status(404).json({message : "Problem Not Found"})
        }
        const solutions = await Solution.find({problemId}).populate("user", "name email").sort({ votes: -1 });
        res.status(200).json({message : "Solutions Found Successfully", solutions})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : "Internal server Error"})
    }
}

export const updateSolution = async (req, res) => {
    try {
        const id = req.params.id;
        const solution = await Solution.findById(id);
        if(!solution) {
            return res.status(404).json({message : "Solution not found"})
        }
        const {description} = req.body 
        if(!description) {
            return res.status(400).json({message : "solution description is required"})
        }
        if(solution.user.toString() != req.user.id.toString()) {
            return res.status(402).json({message : unauthorized})
        }
        solution.description = description
        await solution.save()
        res.status(200).json({message : "Solution updated", solution})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : "Internal server Error"})
    }
}

export const deleteSolution = async (req, res) => {
    try {
        const id = req.params.id
        const solution = await Solution.findById(id);
        if(!solution) {
            return res.status(404).json({message : "Solution not found"})
        }
        if(solution.user.toString() != req.user.id.toString()) {
            return res.status(402).json({message : unauthorized})
        }
        await solution.deleteOne()
        res.status(200).json({message : "Solution deleted"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : "Internal server Error"})
    }
}