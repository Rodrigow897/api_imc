const express = require('express');
const app = express();
const pool = require('./config/db');

app.use(express.json());

function calcularImc(peso, altura) {
    const totalImc = peso / (altura * altura)
    return totalImc;
}

function classificacao(totalImc) {
    if(totalImc < 18.5) {
    return `Abaixo do peso`
} else if(totalImc >= 18.5 && totalImc < 24.9) {
    return `Peso normal`
} else if(totalImc >= 25 && totalImc <29.9) {
    return `Sobrepeso`
} else if(totalImc >= 30 && totalImc <34.9) {  
    return `Obesidade grau I`
} else if(totalImc >= 35 && totalImc < 39.9) {
    return `Obesidade grau II`
} else if(totalImc > 40) {
    return `Obesidade grau III`
}

}

app.get('/IMC', async (_, res) =>{
    try{
        const imc = await pool.query('SELECT * FROM tb_user');
        res.status(200).json(imc.rows);
    } catch (err) {
        console.error('Error when searching for user')
    }
});

app.post('/IMC', async (req, res) => {
    const {name, weight, height } = req.body;

    if (!name || !weight || !height) {
        return res.status(400).json({ error: 'Nome, peso e altura são obrigatorios'});
    }

    const imcValue = calcularImc(weight, height);
    const classificationImc = classificacao(imcValue);

    try {
        const imc = await pool.query('INSERT INTO tb_user (name, weight, height, imc, classification) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, weight, height, imcValue.toFixed(2), classificationImc]
        );
        res.status(200).json(imc.rows[0]);

    } catch (err) {
        console.error('Erro ao inserir usuário', err);
        res.status(500).json({error: 'Erro ao inserir usuário'});
    }
});

app.put('/IMC/:id', async (req, res) => {
    const {id} = req.params;
    const {name, weight, height, imc, classification} = req.body;

    try{
        const im = await pool.query('UPDATE tb_user SET name = $1, weight = $2, height = $3, imc = $4, classification = $5 WHERE id = $6 RETURNING *',
            [name, weight, height, imc, classification, id]
        );
        if (im.rowCount === 0) {
            res.status(404).json({error:'Usuário não encontrado'});
        }
        res.status(200).json(im.rows[0]);

    } catch (err) {
        console.error('Erro ao atualizar usuário', err);
        res.status(500).json({error: 'Erro ao atualizar usuário'});
    }
});

app.delete('/IMC/:id', async (req, res) => {
    const {id} = req.params;

    try{
        const imc = await pool.query('DELETE FROM tb_user WHERE id = $1 RETURNING *', [id]);

        if (imc.rowCount === 0) {
            res.status(404).json({error: 'Usuário não encontrado'});
        }

        res.status(200).json({message: 'Usuário excluido com sucesso'});

    } catch (err) {
        console.error('Erro ao excluir usuário', err);
        res.status(500).json({error: 'Erro ao excluir usuário'});
    }
});

const PORT = 3000
app.listen(PORT, ()=> {
    console.log('Server started in 3000...')
});