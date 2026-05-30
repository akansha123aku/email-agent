import os
from typing import Tuple
from groq import Groq
from app.models import EmailRequest, EmailCategory, DecisionAction, EmailResponse
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class EmailAgent:
    def __init__(self, groq_api_key: str):
        logger.info("Initializing Email Agent...")
        self.client = Groq(api_key=groq_api_key)
        logger.info("Email Agent ready!")
    
    def classify_email(self, email: EmailRequest) -> Tuple[EmailCategory, float]:
        prompt = f"""Classify this email into ONE category:

- order_status: customer asking about order delivery, tracking, or shipping status
- product_question: customer asking about product features, size, color, compatibility
- complaint: customer saying product is damaged, defective, poor quality (but NOT asking for refund yet)
- refund_request: customer explicitly asking for money back, refund, or return
- feedback: customer giving positive feedback or saying thank you
- spam: promotional or irrelevant emails
- general_inquiry: other questions

Email:
From: {email.from_email}
Subject: {email.subject}
Body: {email.body}

Respond with ONLY category|confidence (e.g., refund_request|0.95)"""
        
        try:
            response = self.client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2,
                max_tokens=50
            )
            result = response.choices[0].message.content.strip()
            
            if "|" in result:
                category_str, confidence_str = result.split("|")
                category = EmailCategory(category_str.strip().lower())
                confidence = float(confidence_str.strip())
            else:
                category = EmailCategory.GENERAL_INQUIRY
                confidence = 0.5
            
            return category, confidence
            
        except Exception as e:
            logger.error(f"Classification failed: {e}")
            return EmailCategory.GENERAL_INQUIRY, 0.5
    
    def decide_action(self, category: EmailCategory, confidence: float) -> DecisionAction:
        if category == EmailCategory.COMPLAINT or category == EmailCategory.REFUND_REQUEST:
            return DecisionAction.HUMAN_REVIEW
        if category == EmailCategory.SPAM:
            return DecisionAction.IGNORE
        if confidence < 0.7:
            return DecisionAction.HUMAN_REVIEW
        return DecisionAction.AUTO_REPLY
    
    def generate_response(self, email: EmailRequest, category: EmailCategory) -> str:
        prompts = {
            "order_status": f"""Write a short, professional response. Sign with "Akansha".

Customer said: {email.body}

Keep response 2-3 sentences. Be helpful. End with "Best regards, Akansha"

Write response:""",
            
            "product_question": f"""Write a helpful response. Sign with "Akansha".

Customer question: {email.body}

Keep it short. End with "Best regards, Akansha\"""",
            
            "feedback": f"""Write a grateful response. Sign with "Akansha".

Customer feedback: {email.body}

Thank them. Offer THANKS10 discount. End with "Best regards, Akansha\"""",
            
            "general_inquiry": f"""Write a helpful response. Sign with "Akansha".

Customer inquiry: {email.body}

Be helpful. End with "Best regards, Akansha\"""",
        }
        
        prompt = prompts.get(category.value, prompts["general_inquiry"])
        
        try:
            response = self.client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.5,
                max_tokens=150
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            logger.error(f"Response generation failed: {e}")
            return "Thank you for your message. Our team will get back to you shortly."
    
    def process_email(self, email: EmailRequest) -> EmailResponse:
        try:
            category, confidence = self.classify_email(email)
            logger.info(f"Email classified as: {category} ({confidence:.0%})")
            
            action = self.decide_action(category, confidence)
            logger.info(f"Decision: {action}")
            
            if action == DecisionAction.AUTO_REPLY:
                response_text = self.generate_response(email, category)
            elif action == DecisionAction.HUMAN_REVIEW:
                # Different messages for complaint vs refund
                if category == EmailCategory.COMPLAINT:
                    response_text = "We apologize for the inconvenience. A support agent will investigate and get back to you within 24 hours."
                elif category == EmailCategory.REFUND_REQUEST:
                    response_text = "We understand your concern about the refund. A support agent will process your request and respond within 24 hours."
                else:
                    response_text = "Thank you for reaching out. A support agent will review your request and respond within 24 hours."
            else:
                response_text = "No response needed."
            
            return EmailResponse(
                response=response_text,
                category=category,
                action=action,
                confidence=confidence,
                reviewed=(action == DecisionAction.HUMAN_REVIEW)
            )
            
        except Exception as e:
            logger.error(f"Email processing failed: {e}")
            return EmailResponse(
                response="An error occurred while processing your request.",
                category=EmailCategory.GENERAL_INQUIRY,
                action=DecisionAction.HUMAN_REVIEW,
                confidence=0.0,
                reviewed=True
            )