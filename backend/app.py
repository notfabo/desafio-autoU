import json
import os
import openai
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import PyPDF2 
import io

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)

def extrair_texto_pdf(file_stream):
    try:
        reader = PyPDF2.PdfReader(file_stream)
        texto = ""
        for page in reader.pages:
            texto += page.extract_text()
        return texto
    except Exception as e:
        print(f"Erro ao ler PDF: {e}")
        return None

def analisar_email_com_gpt(conteudo_email):
    prompt_sistema = """
    Você é um assistente de produtividade de uma empresa do setor financeiro.
    Sua função é analisar emails recebidos pela equipe e retornar:
    1. A classificação do email em UMA das seguintes categorias:
    - "Produtivo": quando o email exige uma ação, resposta ou contém informações relevantes para o trabalho
        (exemplos: solicitações de suporte, pedidos de atualização de status, dúvidas sobre processos, envio de arquivos importantes).
    - "Improdutivo": quando o email NÃO exige nenhuma ação imediata ou não é relevante para o trabalho
        (exemplos: mensagens de agradecimento, felicitações, spam, propagandas, newsletters pessoais).
    
    2. Uma sugestão de resposta curta, educada e profissional:
    - Se for "Produtivo": sugira uma resposta que reconheça o email e informe que a solicitação será tratada.
    - Se for "Improdutivo": retorne sempre "Nenhuma ação necessária.".
    
    ### Regras importantes:
    - Responda SEMPRE no mesmo idioma do email recebido.
    - Não invente informações que não estão no email.
    - Mantenha sempre um tom formal, cordial e profissional.
    - Se houver ambiguidade, classifique como "Produtivo".
    - Se o conteúdo do email for vazio, muito curto ou sem sentido, classifique como 'Improdutivo'.
    - Use frases curtas e diretas nas respostas.
    - Retorne SOMENTE em formato JSON válido.
    - Utilize apenas as chaves: "classificacao" e "sugestao_resposta".
    
    Exemplo de saída:
    {
    "classificacao": "Produtivo",
    "sugestao_resposta": "Prezado(a), recebemos sua solicitação e já estamos verificando o status. Retornaremos em breve."
    }
    """

    try:
        response = openai.chat.completions.create(
            model="gpt-4.1-nano",
            messages=[
                {"role": "system", "content": prompt_sistema},
                {"role": "user", "content": conteudo_email}
            ],
            temperature=0.2,
            max_completion_tokens=500
        )
        resultado_json = response.choices[0].message.content
        return resultado_json
    except Exception as e:
        print(f"Erro na API da OpenAI: {e}")
        return '{"classificacao": "Erro", "sugestao_resposta": "Não foi possível processar a solicitação. Verifique a chave da API e a conexão."}'


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/processar', methods=['POST'])
def processar_email():
    conteudo = ""
    if 'arquivo_email' in request.files and request.files['arquivo_email'].filename != '':
        arquivo = request.files['arquivo_email']
        if arquivo.filename.endswith('.txt'):
            conteudo = arquivo.read().decode('utf-8')
        elif arquivo.filename.endswith('.pdf'):
            stream_bytes = io.BytesIO(arquivo.read())
            conteudo = extrair_texto_pdf(stream_bytes)
            if conteudo is None:
                return jsonify({"classificacao": "Erro", "sugestao_resposta": "Não foi possível extrair texto do arquivo PDF."}), 400
    else:
        conteudo = request.form.get('texto_email')

    if not conteudo or conteudo.strip() == "":
        return jsonify({"classificacao": "Erro", "sugestao_resposta": "Nenhum conteúdo de email fornecido."}), 400

    resultado = analisar_email_com_gpt(conteudo)

    try:
        resultado_dict = json.loads(resultado)
        
        resultado_dict['conteudo_analisado'] = conteudo
        
        return jsonify(resultado_dict)

    except (json.JSONDecodeError, TypeError):
        return jsonify({
            "classificacao": "Erro", 
            "sugestao_resposta": "Erro ao processar a resposta da IA.",
            "conteudo_analisado": conteudo
        }), 500

    return resultado, 200, {'Content-Type': 'application/json'}

if __name__ == '__main__':
    app.run(debug=True)

app = app