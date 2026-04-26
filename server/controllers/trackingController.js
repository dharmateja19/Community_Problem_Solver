import Problem from "../models/Problem.js";
import Tracking from "../models/Tracking.js";

export const getTrackingByProblemId = async (req, res) => {
    try {
        const { problemId } = req.params;

        const problem = await Problem.findById(problemId);
        if (!problem) {
            return res.status(404).json({ message: "Problem Not Found" });
        }

        const tracking = await Tracking.find({ problemId })
            .populate("updatedBy", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({ message: "Tracking history found successfully", tracking });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server Error" });
    }
};