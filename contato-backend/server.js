require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de teste
app.get('/', (req, res) => {
    res.send('Servidor rodando 🚀');
});

// Rota que recebe o formulário
app.post('/enviar-mensagem', async (req, res) => {
    const { nome, email, mensagem } = req.body;

    if (!nome || !email || !mensagem) {
        return res.status(400).json({ error: 'Preencha todos os campos' });
    }

    try {
        // configuração de e-mail
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Email pra mim
        await transporter.sendMail({
            from: `"Contato Site" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: 'Nova sugestão recebida',
            html: `
                <p><strong>Nome:</strong> ${nome}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Mensagem:</strong><br>${mensagem}</p>
            `
        });

        // Email automático do usuário
        await transporter.sendMail({
            from: `"Equipe do Site" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Recebemos sua mensagem 😊',
            html: `
                <p>Olá <strong>${nome}</strong>,</p>
                <p>Obrigado por enviar sua sugestão! Ela será analisada com atenção.</p>
                <p>Atenciosamente,<br>Equipe</p>
            `
        });

        res.json({ success: true, message: 'Mensagem enviada com sucesso' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao enviar e-mail' });
    }
});

// Começa o servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
