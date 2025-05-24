# HRMS Backend System - Setup Instructions

1. Create a virtual environment (optional):
   python -m venv venv
   source venv/bin/activate (Linux/Mac)
   .\venv\Scripts\activate (Windows)

2. Install the required packages:
   pip install -r requirements.txt

3. Run the FastAPI server:
   uvicorn main:app --reload

4. Access the API documentation:
   http://127.0.0.1:8000/docs