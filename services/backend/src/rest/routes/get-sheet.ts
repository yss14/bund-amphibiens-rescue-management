import * as Express from "express";
import {
  SheetService,
  SheetNotFoundError,
} from "../../services/sheet-service/SheetService";
import { HTTPStatusCode } from "../../types/HTTPStatusCode";
import { __TEST__ } from "../../utils/env/env-constants";

export const makeGetSheetRoute =
  (sheetService: SheetService): Express.RequestHandler =>
  async (req, res) => {
    const sheetID = req.params.sheetID;

    try {
      const sheet = await sheetService.getSheet(sheetID);

      res.json(sheet);
    } catch (error) {
      const err = error as Error;
      if (
        err.message ===
        "Argument passed in must be a single String of 12 bytes or a string of 24 hex characters"
      ) {
        res
          .status(HTTPStatusCode.BAD_REQUEST)
          .json({ error: "Invalid sheetID" });
      } else if (err instanceof SheetNotFoundError) {
        res
          .status(HTTPStatusCode.NOT_FOUND)
          .json({ error: `Sheet with id ${sheetID} not found` });
      } else {
        /* istanbul ignore if */
        if (!__TEST__) {
          console.error(err);
        }

        res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).end();
      }
    }
  };
