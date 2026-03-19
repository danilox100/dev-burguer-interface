import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Image } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { api } from '../../../services/api';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  Container,
  Form,
  Input,
  InputGroup,
  Label,
  LabelUpload,
  Select,
  SubmitButton,
  ContainerCheckbox,
} from './styles';
import { toast } from 'react-toastify';

const schema = yup.object({
  name: yup.string().required('Nome é obrigatório'),

  price: yup
    .number()
    .typeError('Digite um número válido')
    .positive('O preço deve ser positivo')
    .required('Preço é obrigatório'),

  category: yup.object().nullable().required('Categoria é obrigatória'),
  offer: yup.bool(),
});

export function EditProduct() {
  const [fileName, setFileName] = useState(null);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  const {
    state: { product },
  } = useLocation();

  useEffect(() => {
    async function loadCategories() {
      const { data } = await api.get('/categories');
      setCategories(data);
    }

    loadCategories();
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const productFormData = new FormData();

    productFormData.append('name', data.name);
    productFormData.append('price', data.price * 100);
    productFormData.append('category_id', data.category.id);
    productFormData.append('file', data.file[0]);
    productFormData.append('offer', data.offer);

    await toast.promise(api.put(`/products/${product.id}`, productFormData), {
      pending: 'Editando Produto',
      success: 'Produto editado com Sucesso',
      error: 'Falha ao editar o produto, tente novamente',
    });

    setTimeout(() => {
      navigate('/admin/produtos');
    }, 2000);
  };

  const fileRegister = register('file');

  return (
    <Container>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <InputGroup>
          <Label>Nome</Label>
          <Input
            type="text"
            {...register('name')}
            defaultValue={product.name}
          />
          {errors.name && <span>{errors.name.message}</span>}
        </InputGroup>

        <InputGroup>
          <Label>Preço</Label>
          <Input
            type="number"
            {...register('price')}
            defaultValue={product.price}
          />
          {errors.price && <span>{errors.price.message}</span>}
        </InputGroup>

        <InputGroup>
          <LabelUpload>
            <Image size={20} />
            <input
              type="file"
              accept="image/png, image/jpeg"
              {...fileRegister}
              onChange={(e) => {
                setFileName(e?.target?.files[0]?.name);
                fileRegister.onChange(e);
              }}
            />

            {fileName || 'Upload do Produto'}
          </LabelUpload>

          {errors.file && <span>{errors.file.message}</span>}
        </InputGroup>

        <InputGroup>
          <Label>Categoria</Label>
          <Controller
            name="category"
            control={control}
            defaultValue={product.category}
            render={({ field }) => (
              <Select
                {...field}
                options={categories}
                getOptionLabel={(category) => category.name}
                getOptionValue={(category) => category.id}
                placeholder="Categorias"
                menuPortalTarget={document.body}
                onChange={(value) => field.onChange(value)}
                defaultValue={product.category}
              />
            )}
          />

          {errors.category && <span>{errors.category.message}</span>}
        </InputGroup>
        <InputGroup>
          <ContainerCheckbox>
            <input
              type="checkbox"
              defaultChecked={product.offer}
              {...register('offer')}
            />
            <Label>Produto em Oferta ?</Label>
          </ContainerCheckbox>
        </InputGroup>

        <SubmitButton type="submit">Editar Produto</SubmitButton>
      </Form>
    </Container>
  );
}
