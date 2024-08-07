from flask import Flask, render_template, request
import google.generativeai as genai

app = Flask(__name__)


# api_key = 'AIzaSyBSdq4MXGKDJhKZ-NMC02xHt78W6v5Xv1I'
genai.configure(api_key=api_key)

model = genai.GenerativeModel('gemini-1.5-flash')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    data = request.get_json()
    prompt = data['prompt']
    response = model.generate_content(prompt)
    generated_text = response._result.candidates[0].content.parts[0].text
    return {'prompt': prompt, 'response': generated_text}

# Add RAG features in Aug 4th

# Remember to comment this during productions
# if __name__ == '__main__':
#     app.run(debug=True
