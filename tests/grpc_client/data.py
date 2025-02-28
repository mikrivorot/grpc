# tests/grpc_client/test_data/transaction_data.py
from client.dto.transaction_dto import TransactionCommitResponseDTO, TransactionsCommitResponseDTO, TransactionStatus
from constants import Messages

VALID_TRANSACTION_REQUEST = {
    "user_id": 1,
    "amount": 50,
    "currency": "EUR"
}

VALID_BULK_REQUEST = [
    {
        "user_id": 1,
        "amount": 50,
        "currency": "EUR"
    },
    {
        "user_id": 2,
        "amount": 75,
        "currency": "EUR"
    }
]

TRANSACTION_RESPONSES = {
    "success": TransactionCommitResponseDTO(
        message=[Messages.COMMIT_SUCCESS],
        status=TransactionStatus.COMMITTED
    ),
    "with_steps": [
        TransactionCommitResponseDTO(
            message=[Messages.START_MESSAGE,  Messages.PROCESSING],
            status=TransactionStatus.PROCESSING
        ),
        TransactionCommitResponseDTO(
            message=[Messages.COMMIT_SUCCESS],
            status=TransactionStatus.COMMITTED
        )
    ],
    "bulk": TransactionsCommitResponseDTO(
        transferred_amount = 125,
        message=[Messages.START_MESSAGE,  Messages.PROCESSING, Messages.COMMIT_SUCCESS],
        status=TransactionStatus.COMMITTED,
        refused_transactions = 0
    ),
    "bulk_with_steps": [
        TransactionCommitResponseDTO(
            message=[Messages.COMMIT_SUCCESS],
            status=TransactionStatus.COMMITTED
        ),
        TransactionCommitResponseDTO(
            message=[Messages.COMMIT_SUCCESS],
            status=TransactionStatus.COMMITTED
        )
    ]
}