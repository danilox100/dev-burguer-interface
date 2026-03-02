import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import {
  Container,
  Form,
  InputContainer,
  LeftContainer,
  RightContainer,
  Tittle,
  Link,
} from './styles';

import Logo from '../../assets/Logo.svg';
import  {Button}  from '../../components/Button';
import { api } from "../../services/api";


export function Login() {
  const navigate = useNavigate()

  const schema = yup
  .object({
    email: yup.string().email('Digite um email válido').required('O email é obrigatório'),
    password: yup.string().min(6, 'A senha deve ter no mínimo 6 caracteres').required('A senha é obrigatória'),
  })
  .required()

const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })
  console.log(errors)

  const onSubmit = async (data) => {
  try {
    const request = api.post('/sessions', {
      email: data.email,
      password: data.password
    })

    const response = await toast.promise(
      request,
      {
        pending: 'Verificando seus dados...',
        success: 'Seja bem vindo(a) ao Dev Burguer! 👨‍🍳',
        error: 'Email ou senha incorretos, tente novamente! 😥'
      }
    )

    const { token } = response.data

    localStorage.setItem('token', token)

    setTimeout(() => {
      navigate('/')
    }, 2000)

  } catch (error) {
    console.log(error)
  }
}

  return (
    <Container>
      <LeftContainer>
        <img src={Logo} alt="Logo" />
      </LeftContainer>

      <RightContainer>
        <Tittle>
          Olá, seja bem vindo ao <span>Dev Burguer!</span>
          <br />
           Acesse com seu<span> Login e senha.</span>
        </Tittle>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <InputContainer>
            <label>Email</label>
            <input type="email" placeholder="Digite seu email" {...register("email")}/>
            <p>{errors.email?.message}</p>
          </InputContainer>

          <InputContainer>
            <label>Senha</label>
            <input type="password" placeholder="Digite sua senha" {...register("password")}/>
            <p>{errors.password?.message}</p>
          </InputContainer>
        
          <Button type="submit">Entrar</Button>
        </Form>

        <p>Não possui conta? <Link to='/cadastro'>Clique aqui.</Link></p>
      </RightContainer>
      
    </Container>
  );
}
