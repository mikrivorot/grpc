# client/models/response_models.py
from typing import Generic, TypeVar
from pydantic import BaseModel

T = TypeVar('T')

class APIResponse(BaseModel, Generic[T]):
    response: T
    statusCode: int