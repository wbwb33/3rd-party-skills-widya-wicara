declare namespace Express {
  export type Send = (body?: any) => Response;
  export type Error = (error: string | object) => Response;
  export type Message = (msg: {
    action: string;
    data: string | object;
  }) => Response;
  export type InsertErrors = (error: {
    code: string;
    message: string;
    detail: string;
  }) => Response;

  export interface Response {
    /**
     * Send a Success response with statusCode: 200
     * @action is used to tell what action is being excecuted
     * @data is data related to succeded action
     */
    sendOK: Message;

    /**
     * Send a Success Insert query response with statusCode: 201
     * @action is used to tell what action is being excecuted
     * @data is data related to succeded action
     */
    sendInsertOK: Message;

    /**
     * Send a Not Modified response with statusCode: 400.
     * This used to upsert a query and the update was not perform because the data is same
     */
    sendNotModified: Send;

    /**
     * Send an Error response with statusCode: 400.
     */
    sendError: Error;

    /**
     * Send an Insert Error response with statusCode: 400.
     * This is used catch an insert query error
     */
    sendInsertError: InsertErrors;

    /**
     * Send a Not Found response with statusCode: 404.
     */
    sendNotFound: Error;

    /**
     * Send an Internal Server Error response with statusCode: 500.
     */
    sendInternalError: any;
  }
}
