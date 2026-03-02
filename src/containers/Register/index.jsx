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



export function Register() {
  const navigate = useNavigate()

  const schema = yup
  .object({
    name: yup.string().required('O nome é obrigatório'),
    email: yup.string().email('Digite um email válido').required('O email é obrigatório'),
    password: yup.string().min(6, 'A senha deve ter no mínimo 6 caracteres').required('A senha é obrigatória'),
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'As senhas devem ser iguais').required('A confirmação de senha é obrigatória'),
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

const onSubmit = async data => {
        try {
            const {status} = await api.post('/users', {
                name: data.name,
                email: data.email,
                password: data.password,
            },
            {
                validateStatus: () => true
            },
        ); 

        if (status === 201 || status === 200){
            setTimeout(() => {
                navigate('/login');
            }, 2000)
            toast.success('Sua conta foi criada com sucesso')
        } else if(status === 409){
            toast.error('Email já cadastrado, tente outro.')
        } else{
            throw new Error();
        }

        } catch (error) {
            toast.error('Falha no Sistema! Tente novamente mais tarde');
        }

      };

  return (
    <Container>
      <LeftContainer>
        <img src={Logo} alt="Logo" />
      </LeftContainer>

      <RightContainer>
        <Tittle>
          <span>Criar Conta</span>
        </Tittle>
        <Form onSubmit={handleSubmit(onSubmit)}>
        
         <InputContainer>
            <label>Nome</label>
            <input type="text" placeholder="Digite seu nome" {...register("name")}/>
            <p>{errors.name?.message}</p>
          </InputContainer>

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

          <InputContainer>
            <label>Confimar Senha</label>
            <input type="password" placeholder="Confirme sua senha" {...register("confirmPassword")}/>
            <p>{errors.confirmPassword?.message}</p>
          </InputContainer>
        
          <Button type="submit">Confirmar Cadastro</Button>
        </Form>

        <p>Já possui conta? <Link to='/login'>Clique aqui.</Link></p>
      </RightContainer>
      
    </Container>
  );
}
