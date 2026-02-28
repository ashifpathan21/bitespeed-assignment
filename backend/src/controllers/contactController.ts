import type { Request, Response } from "express";
import prisma from "../model.js";


const createContact = async (email: string, phoneNumber: string, linkPrecedence: 'PRIMARY' | 'SECONDARY', linkedId?: number) => {
    try {
        const contact = await prisma.contact.create({
            data: {
                email,
                phoneNumber,
                linkPrecedence,
                linkedId: linkedId ?? null
            }
        })
        return contact;
    } catch (error) {
        return null
    }
}

const findPrimaryContact = async (email?: string, phoneNumber?: string) => {
    try {
        if (!email && !phoneNumber) {
            return null;
        }
        const primaryContact = await prisma.contact.findFirst({
            where: {
                deletedAt: null,
                OR: [
                    { email },
                    { phoneNumber }
                ]
            }
        })
        if (!primaryContact) return null;

        if (primaryContact.linkPrecedence === 'PRIMARY') {
            return primaryContact;
        }

        return await prisma.contact.findFirst({
            where: {
                //@ts-ignore
                id: primaryContact.linkedId,
                deletedAt: null
            }
        });
    } catch (error) {
        return null
    }
}

const findSecondaryContacts = async (primaryId: number) => {
    try {
        if (!primaryId) {
            return [];
        }
        const secondaryContacts = await prisma.contact.findMany({
            where: {
                deletedAt: null,
                linkedId: primaryId
            }
        })
        return secondaryContacts
    } catch (error) {
        return [];
    }
}
export const getDetails = async (req: Request, res: Response) => {
    try {
        const email = req.body?.email;
        const phoneNumber = req.body?.phoneNumber;
        if (!email && !phoneNumber) {
            return res.status(400).json({
                success: false,
                message: "Empty Fields"
            })
        }
        let emails: string[] = [], phoneNumbers: string[] = [], secondaryContactIds: number[] = [], primaryContactId: number;
        if (email && phoneNumber) {
            const contact = await prisma.contact.findFirst({
                where: {
                    deletedAt: null,
                    email: email,
                    phoneNumber: phoneNumber
                }
            });
            if (!contact) {
                const isExist = await prisma.contact.findFirst({
                    where: {
                        deletedAt: null,
                        OR: [
                            { email },
                            { phoneNumber }
                        ]
                    }
                })
                if (isExist) {
                    const newC = await createContact(email, phoneNumber, 'SECONDARY', isExist.linkedId ? isExist.linkedId : isExist.id)
                } else {
                    const newC = await createContact(email, phoneNumber, 'PRIMARY')
                }
            }
        }
        const primary = await findPrimaryContact(email, phoneNumber);
        if (!primary) {
            throw new Error('Primary Contact Not Found');
        }
        const secondary = await findSecondaryContacts(primary.id)
        const emailSet = new Set<string>()
        const phoneSet = new Set<string>()
        if (primary.email) {
            emails.push(primary.email)
            emailSet.add(primary.email)
        }
        if (primary.phoneNumber) {
            phoneNumbers.push(primary.phoneNumber)
            phoneSet.add(primary.phoneNumber)
        }
        primaryContactId = primary.id
        secondary.forEach((cont) => {
            if (cont.email && !emailSet.has(cont.email)) {
                emails.push(cont.email)
                emailSet.add(cont.email)
            }
            if (cont.phoneNumber && !phoneSet.has(cont.phoneNumber)) {
                phoneNumbers.push(cont.phoneNumber)
                phoneSet.add(cont.phoneNumber)
            }
            secondaryContactIds.push(cont.id)
        })
        return res.status(200).json({
            success: true,
            contact: {
                primaryContactId,
                emails,
                phoneNumbers,
                secondaryContactIds
            }
        })
    } catch (error) {
        console.log("Error Occured", error)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}