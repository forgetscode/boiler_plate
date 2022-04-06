import { Request, Response } from 'express';
import { Session, SessionData } from 'express-session';

//types for user sessin
export type MyContext = {
    req: Request & {
        session: Session & Partial<SessionData> & { userId?: number };
    };
    res: Response;
};