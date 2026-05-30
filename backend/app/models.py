from pydantic import BaseModel
from typing import Optional
from enum import Enum

class EmailCategory(str, Enum):
    ORDER_STATUS = "order_status"
    PRODUCT_QUESTION = "product_question"
    COMPLAINT = "complaint"
    REFUND_REQUEST = "refund_request"
    FEEDBACK = "feedback"
    SPAM = "spam"
    GENERAL_INQUIRY = "general_inquiry"

class DecisionAction(str, Enum):
    AUTO_REPLY = "auto_reply"
    HUMAN_REVIEW = "human_review"
    IGNORE = "ignore"

class EmailRequest(BaseModel):
    from_email: str
    subject: str
    body: str

class EmailResponse(BaseModel):
    response: str
    category: EmailCategory
    action: DecisionAction
    confidence: float
    reviewed: bool = False