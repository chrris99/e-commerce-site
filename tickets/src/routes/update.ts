import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { validateRequest, RouteNotFoundError, requireAuth, NotAuthorizedError } from '@ccticketshop/shared'

import { Ticket } from '../models/ticket'

const router = express.Router()

router.put('/api/tickets/:id', 
requireAuth, 
[
    body('title').not().isEmpty().withMessage('Title is required when updating a ticket'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0')
], 
validateRequest, 
async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id)

    if (!ticket) {
        throw new RouteNotFoundError('Ticket with given ID not found')
    }

    if (ticket.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError('User not authorized to update this ticket')
    }

    ticket.set({
        title: req.body.title,
        price: req.body.price
    })

    await ticket.save()

    res.send(ticket)
})

export { router as updateTicketRouter }