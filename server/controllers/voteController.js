import Solution from "../models/Solution.js";
import Vote from "../models/Vote.js";

export const voteSolution = async (req, res) => {
    try {
        const solutionId = req.params.solutionId;
        const userId = req.user.id;
        const solution = await Solution.findById(solutionId);
        if(!solution) {
            return res.status(404).json({message : "Solution not found"})
        }
        const alreadyVoted = await Vote.findOne({userId, solutionId})
        if(alreadyVoted) {
            return res.status(400).json({message : "You have already voted for this solution"})
        }
        const vote = new Vote({userId, solutionId})
        await vote.save()
        await Solution.findByIdAndUpdate(solutionId, {
            $inc: { votes: 1 }
        });
        res.status(200).json({message : "Vote added successfully"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : "Internal server Error"})
    }
}

export const removeVote = async (req, res) => {
    try {
        const solutionId = req.params.solutionId;
        const userId = req.user.id;
        const solution = await Solution.findById(solutionId);
        if(!solution) {
            return res.status(404).json({message : "Solution not found"})
        }
        const existingVote = await Vote.findOne({userId, solutionId})
        if(!existingVote) {
            return res.status(400).json({message : "You have not voted for this solution"})
        }
        await existingVote.deleteOne()
        await Solution.findByIdAndUpdate(solutionId, {
            $inc: { votes: -1 }
        });
        res.status(200).json({message : "Vote removed successfully"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : "Internal server Error"})
    }
}