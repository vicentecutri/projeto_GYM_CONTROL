import express from 'express';
import userRouter from './routes/UserRouter';
import authRouter from './routes/AuthRouter';
import exercicioRoute from './routes/ExercicioRouter';
import treinoRouter  from './routes/TreinoRouter';


const app = express();
app.use(express.json());

app.use("/users", userRouter);
app.use("/login", authRouter);
app.use("/exercicio", exercicioRoute);
app.use("/treino", treinoRouter);


app.listen(8000, ()=>{
    console.log("Servidor rodando na porta 8000")
});
