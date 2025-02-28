class TestEndpoints:
    TRANSACTION_COMMIT = "/transaction/commit"
    TRANSACTION_BULK_COMMIT = "/transaction/commit/bulk"

class StatusCodes:
    CREATED = 201
    BAD_REQUEST = 400
    SERVER_ERROR = 500

class Messages:
    START_MESSAGE = "Transaction started"
    COMMIT_SUCCESS = "Transaction committed successfully"
    PROCESSING = "Processing transaction"