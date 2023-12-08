import type {NextApiRequest, NextApiResponse} from 'next'
import * as service from "@/shared/services/transaction.service"
import {getAuthContext} from "@/shared/utils/get-auth-context";
type TransactionDto  = {
    toUserId: number;
    amount: number;
}
async function POST(req: NextApiRequest,
                    res: NextApiResponse) {
    try {
        const transaction: TransactionDto = req.body;
        const authData = await getAuthContext(req);
        if (authData != null) {
            const result = await service.createUserTransaction(authData.userId, transaction.toUserId, transaction.amount);
            res.status(200).json(result)
        } else {
            res.status(401);
        }
    } catch (ex: any) {
        switch (ex.message) {
            case "USER_REQUIRED":
                res.status(400).json({errors: {['account']: "Please select the account"}});
                break;

            case "AMOUNT_REQUIRED":
                res.status(400).json({errors: {['amount']: "Please enter amount "}});
                break;

            case "USER_TO_NOT_FOUND":
                res.status(400).json({errors: {['account']: "The account not found "}});
                break;

            case "USER_NO_MONEY":
                res.status(400).json({errors: {['amount']: "Not enough money for transaction "}});
                break;

            default:
                res.status(500).json({errors: {['general']: "Unknown error"}});
                break;
        }

    }
}

async function GET(req: NextApiRequest,
                   res: NextApiResponse) {
    try {

        const authData = await getAuthContext(req);
        if (authData != null) {
            const result = await service.getTransactions(authData.userId);

            res.status(200).json(result.map(s=>{
                delete s.fromUser.password;
                delete s.toUser.password;
               return s;
            }))
        } else {
            res.status(401);
        }
    } catch (e) {
        res.status(500).json({errors: {['general']: "Unknown error"}});
    }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    switch (req.method) {
        case 'POST':
            await POST(req, res);
            break;
        case 'GET':
            await GET(req, res);
            break;
        default:
            res.status(404);
            break;

    }
}
