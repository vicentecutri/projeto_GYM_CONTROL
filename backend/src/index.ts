import express from 'express';
import userRouter from './routes/UserRouter';
import authRouter from './routes/AuthRouter';
import exercicioRoute from './routes/ExercicioRouter';
import treinoRouter  from './routes/TreinoRouter';
import matriculaRouter from './routes/MatriculaRouter';
import planoRouter from './routes/PlanoRouter';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", userRouter);
app.use("/login", authRouter);
app.use("/exercicio", exercicioRoute);
app.use("/treino", treinoRouter);
app.use("/matricula", matriculaRouter);
app.use("/plano", planoRouter);


app.listen(8000, ()=>{
    console.log("Servidor rodando na porta 8000")
});
