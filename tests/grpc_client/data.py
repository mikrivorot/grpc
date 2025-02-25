from client.dto.transaction_dto import TransactionCommitResponseDTO, TransactionStatus

VALID_TRANSACTION_REQUEST = {
    "user_id": 1,
    "amount": 50,
    "currency": "EUR"
}

TRANSACTION_RESPONSES = {
    "success": TransactionCommitResponseDTO(
        message=["Transaction committed successfully"],
        status=TransactionStatus.COMMITTED
    ),
    "with_steps": [
        TransactionCommitResponseDTO(
            message=["Transaction started", "Processing transaction"],
            status=TransactionStatus.PROCESSING
        ),
        TransactionCommitResponseDTO(
            message=["Transaction committed successfully"],
            status=TransactionStatus.COMMITTED
        )
    ]
}