import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock
from client.dto.transaction_dto import TransactionStatus
from client.grpc_client import GRPCClient
from client.routers.transaction_router import get_grpc_client
from client.main import app
from data import VALID_TRANSACTION_REQUEST, TRANSACTION_RESPONSES, VALID_BULK_REQUEST
from constants import TestEndpoints, StatusCodes, Messages

@pytest.fixture
def mock_grpc_client():
    mock = MagicMock(spec=GRPCClient)
    mock.transaction_commit.return_value = TRANSACTION_RESPONSES["success"]
    mock.transaction_commit_with_steps.return_value = TRANSACTION_RESPONSES["with_steps"]
    mock.transactions_commit.return_value = TRANSACTION_RESPONSES["bulk"]
    mock.transactions_with_steps_commit.return_value = TRANSACTION_RESPONSES["bulk_with_steps"]
    return mock

@pytest.fixture(autouse=True)
def override_dependency(mock_grpc_client):
    app.dependency_overrides[get_grpc_client] = lambda: mock_grpc_client
    yield
    app.dependency_overrides.clear()

@pytest.fixture
def test_client():
    return TestClient(app)

# def test_transaction_commit_without_steps(test_client, mock_grpc_client):
#     response = test_client.post(TestEndpoints.TRANSACTION_COMMIT, 
#                             json=VALID_TRANSACTION_REQUEST)
    
#     assert response.status_code == StatusCodes.CREATED
#     assert response.json()["statusCode"] == StatusCodes.CREATED
#     response_data = response.json()["response"]
#     assert response_data["status"] == TransactionStatus.COMMITTED.value
#     assert Messages.COMMIT_SUCCESS in response_data["message"]
    
#     mock_grpc_client.transaction_commit.assert_called_once()
#     call_args = mock_grpc_client.transaction_commit.call_args[0][0]
#     assert call_args.user_id == VALID_TRANSACTION_REQUEST["user_id"]
#     assert call_args.amount == VALID_TRANSACTION_REQUEST["amount"]
#     assert call_args.currency == VALID_TRANSACTION_REQUEST["currency"]

# def test_transaction_commit_with_steps(test_client, mock_grpc_client):
#     response = test_client.post(TestEndpoints.TRANSACTION_COMMIT, 
#                             json=VALID_TRANSACTION_REQUEST,
#                             params={"with_steps": True})
    
#     assert response.status_code == StatusCodes.CREATED
#     assert response.json()["statusCode"] == StatusCodes.CREATED
#     response_data = response.json()["response"]
    
#     assert response_data[0]["status"] == TransactionStatus.PROCESSING.value
#     assert Messages.PROCESSING in response_data[0]["message"]
#     assert response_data[1]["status"] == TransactionStatus.COMMITTED.value
#     assert Messages.COMMIT_SUCCESS in response_data[1]["message"]
    
#     mock_grpc_client.transaction_commit_with_steps.assert_called_once()
#     call_args = mock_grpc_client.transaction_commit_with_steps.call_args[0][0]
#     assert call_args.user_id == VALID_TRANSACTION_REQUEST["user_id"]
#     assert call_args.amount == VALID_TRANSACTION_REQUEST["amount"]
#     assert call_args.currency == VALID_TRANSACTION_REQUEST["currency"]
    

def test_bulk_transaction_commit(test_client, mock_grpc_client):
    response = test_client.post(
        TestEndpoints.TRANSACTION_BULK_COMMIT, 
        json=VALID_BULK_REQUEST
    )
    
    assert response.status_code == StatusCodes.CREATED
    assert response.json()["statusCode"] == StatusCodes.CREATED
    response_data = response.json()["response"]
    
    assert response_data["status"] == TransactionStatus.COMMITTED.value
    assert Messages.COMMIT_SUCCESS in response_data["message"]
    
    mock_grpc_client.transactions_commit.assert_called_once()
    call_args = mock_grpc_client.transactions_commit.call_args[0][0]
    assert len(call_args) == len(VALID_BULK_REQUEST)
    for req, sent in zip(VALID_BULK_REQUEST, call_args):
        assert sent.user_id == req["user_id"]
        assert sent.amount == req["amount"]
        assert sent.currency == req["currency"]
        

def test_bulk_transaction_commit_with_response_per_request(test_client, mock_grpc_client):
    response = test_client.post(
        TestEndpoints.TRANSACTION_BULK_COMMIT,
        json=VALID_BULK_REQUEST,
        params={"response_per_request": True}
    )
    
    assert response.status_code == StatusCodes.CREATED
    assert response.json()["statusCode"] == StatusCodes.CREATED
    response_data = response.json()["response"]
    
    # Verify response is a list of individual responses
    assert isinstance(response_data, list)
    assert len(response_data) == len(VALID_BULK_REQUEST)
    
    for transaction in response_data:
        assert transaction["status"] == TransactionStatus.COMMITTED.value
        assert Messages.COMMIT_SUCCESS in transaction["message"]
    
    mock_grpc_client.transactions_with_steps_commit.assert_called_once()
    call_args = mock_grpc_client.transactions_with_steps_commit.call_args[0][0]
    assert len(call_args) == len(VALID_BULK_REQUEST)
    for req, sent in zip(VALID_BULK_REQUEST, call_args):
        assert sent.user_id == req["user_id"]
        assert sent.amount == req["amount"]
        assert sent.currency == req["currency"]