const express = require('express');
const app = express();
const pool = require('./config/db');

app.use(express.json());

function calcularImc(peso, altura) {
    const totalImc = peso / (altura * altura) 
}

function classificacao(totalImc) {
    if(imc < 18.5) {
    console.log("Magreza")
} else if(imc >= 18.5 && imc < 24.9) {
    console.log(`Seu imc eh: ${totalImc.toFixed(2)} \nPeso normal`)
} else if(imc >= 25 && imc <29.9) {
    console.log(`Seu imc eh: ${totalImc.toFixed(2)} \nSobrepeso`)
} else if(imc >= 30 && imc <34.9) {
    console.log(`Seu imc eh: ${totalImc.toFixed(2)} \nObesidade grau I`)
} else if(imc >= 35 && imc < 39.9) {
    console.log(`Seu imc eh: ${totalImc.toFixed(2)} \nObesidade grau II`)
} else if(imc > 40) {
    console.log(`Seu imc eh: ${totalImc.toFixed(2)} \nObesidade grau III`)
}

}

app.get('/IMC', async (_, res) =>{
    try{
        const imc = await pool.query('SELECT * FROM tb_imc');
        res.status(200).json(imc.rows);
    } catch (err) {
        console.error('Error when searching for register')
    }
});

app.post('/IMC', async (req, res) => {
    const {name, weight, height, imc, classification } = req.body
})