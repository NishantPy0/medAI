from flask import Flask, render_template, request
import google.generativeai as genai
import PyPDF2
import os

app = Flask(__name__)

# Configure the model
genai.configure(api_key='AIzaSyBSdq4MXGKDJhKZ-NMC02xHt78W6v5Xv1I')
model = genai.GenerativeModel('gemini-1.5-flash')

# Ensure the upload folder exists
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    data = request.form
    prompt = data.get('prompt')
    file = request.files.get('pdf')

    if file:
        # Save and process the PDF
        pdf_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(pdf_path)
        extracted_text = extract_text_from_pdf(pdf_path)
        summary_prompt = f"Summarize the following text: {extracted_text}"
        response = model.generate_content(summary_prompt)
        summary_text = response._result.candidates[0].content.parts[0].text
    elif prompt:
        # Process the text prompt
        prompt_text = prompt
        response = model.generate_content(prompt_text)
        summary_text = response._result.candidates[0].content.parts[0].text
    else:
        return {'error': 'No input provided'}, 400

    return {'prompt': prompt, 'response': summary_text}

def extract_text_from_pdf(pdf_path):
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ''
        for page in reader.pages:
            text += page.extract_text()
        return text

# if __name__ == '__main__':
#     app.run(debug=True)
