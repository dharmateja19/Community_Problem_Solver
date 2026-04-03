import {Router} from 'express'
import { createProblem, getAllProblems, getProblemById, updateProblemStatus, deleteProblem } from '../controllers/problemController.js'

const router = Router()

router.post('/create', createProblem)
router.get('/', getAllProblems)
router.get('/:id', getProblemById)
router.patch('/status/:id', updateProblemStatus)
router.delete('/delete/:id', deleteProblem)

export default router