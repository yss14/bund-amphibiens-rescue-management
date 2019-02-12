import * as Express from "express";
import { Checker, isCheckError } from "../utils/checker";
import { HTTPStatusCode } from "../types/HTTPStatusCode";

type IRequestHandler<Request> = (
	((request: Request, response: Express.Response) => any) |
	((request: Request, response: Express.Response, next: Express.NextFunction) => any)
);

export const CheckRequest = <A, B>(checker: Checker<A, B>) => <Request>(handler: IRequestHandler<Request & B>) => {
	return (request: Request & A, response: Express.Response, next: Express.NextFunction): void => {
		const result = checker(request);
		if (isCheckError(result)) {
			return void (response.status(HTTPStatusCode.BAD_REQUEST).send({ errors: result[0] }));
		}
		handler(<Request & B><unknown>request, response, next);
	};
};

export interface CheckedExpressRequest<M> extends Express.Request {
	body: M extends Checker<infer A, infer B> ? B : never;
}