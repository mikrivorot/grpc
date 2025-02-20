from pydantic import BaseModel, Field, field_validator
from typing import List

# TODO
# status - enum?
# message = type


class TransactionCommitRequestDTO(BaseModel):
    amount: int = Field(
        ...,
        description="Transaction amount",
        example=10,
        gt=0,
        lt=100
    )
    user_id: int = Field(
        ...,
        description="ID of the user initiating the transaction",
        example=1
    )
    currency: str = Field(
        ...,
        description="Currency code",
        example="EUR",
        min_length=3,
        max_length=3
    )

    @field_validator('currency')
    def currency_must_be_uppercase(cls, v) -> str:
        return v.upper()

class TransactionCommitResponseDTO(BaseModel):
    status: str = Field(..., example="COMMITTED")
    message: List[str] = Field(..., example=["Transaction committed successfully"])
    

class TransactionsRefusedResponseDTO(TransactionCommitResponseDTO):
    refused_transactions: int = Field(..., example=10, description="Total amount of refused transactions") 
    

class TransactionsCommitResponseDTO(TransactionsRefusedResponseDTO):
    transferred_amount: int = Field(..., example=10, description="Total sum of successfully committed transactions") 
