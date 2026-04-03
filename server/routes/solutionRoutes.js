import {Router} from 'express'
import { createSolution, getSolutionsByProblemId, updateSolution, deleteSolution} from '../controllers/solutionController.js'

const router = Router()

router.post('/create/:problemId', createSolution)
router.get('/:problemId', getSolutionsByProblemId)
router.put('/update/:id', updateSolution)
router.delete('/delete/:id', deleteSolution)

export default router;